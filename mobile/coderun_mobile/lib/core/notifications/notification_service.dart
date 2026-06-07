import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:go_router/go_router.dart';
import 'package:dio/dio.dart';
import '../constants/api_constants.dart';

class NotificationService {
  final FirebaseMessaging? _messaging;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();
  Dio? _dio;
  final bool _firebaseEnabled;
  GlobalKey<NavigatorState>? _navigatorKey;

  NotificationService({Dio? dio, bool firebaseEnabled = false})
      : _dio = dio,
        _firebaseEnabled = firebaseEnabled,
        _messaging = firebaseEnabled ? FirebaseMessaging.instance : null;

  /// Riverpod Dio provider hazır olduğunda FCM token kaydı için bağlanır.
  void bindDio(Dio dio) {
    _dio = dio;
    final messaging = _messaging;
    if (!_firebaseEnabled || messaging == null) return;
    messaging.getToken().then((token) {
      if (token != null) {
        _registerTokenToBackend(token);
      }
    });
  }

  void setNavigatorKey(GlobalKey<NavigatorState> key) {
    _navigatorKey = key;
  }

  Future<void> initialize() async {
    await _initializeLocalNotifications();

    if (!_firebaseEnabled || _messaging == null) {
      debugPrint('FCM devre dışı — yerel bildirimler kullanılabilir.');
      return;
    }

    await _requestPermission();

    final token = await _messaging.getToken();
    if (token != null) {
      debugPrint('FCM Token alındı, backend\'e kaydediliyor...');
      await _registerTokenToBackend(token);
    }

    _messaging.onTokenRefresh.listen(_registerTokenToBackend);

    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    FirebaseMessaging.onMessageOpenedApp.listen(_handleBackgroundMessage);

    final initialMessage = await _messaging.getInitialMessage();
    if (initialMessage != null) {
      _handleBackgroundMessage(initialMessage);
    }
  }

  Future<void> _requestPermission() async {
    final messaging = _messaging;
    if (messaging == null) return;

    final settings = await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
    debugPrint('FCM izin durumu: ${settings.authorizationStatus}');
  }

  Future<void> _initializeLocalNotifications() async {
    const androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings();
    const settings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );
    await _localNotifications.initialize(settings);

    const channel = AndroidNotificationChannel(
      'coderun_channel',
      'Coderun Bildirimleri',
      description: 'Günlük hatırlatmalar ve streak bildirimleri',
      importance: Importance.high,
    );
    await _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(channel);
  }

  void _handleForegroundMessage(RemoteMessage message) {
    _showLocalNotification(
      title: message.notification?.title ?? 'Coderun',
      body: message.notification?.body ?? '',
    );
  }

  void _handleBackgroundMessage(RemoteMessage message) {
    debugPrint('Bildirime tıklandı: ${message.data}');

    final route = message.data['route'] as String?;
    if (route != null && _navigatorKey?.currentContext != null) {
      final context = _navigatorKey!.currentContext!;
      // ignore: use_build_context_synchronously
      GoRouter.of(context).push(route);
    }
  }

  Future<void> _showLocalNotification({
    required String title,
    required String body,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'coderun_channel',
      'Coderun Bildirimleri',
      importance: Importance.high,
      priority: Priority.high,
    );
    const details = NotificationDetails(android: androidDetails);
    await _localNotifications.show(0, title, body, details);
  }

  Future<void> showStreakReminder(int currentStreak) async {
    await _showLocalNotification(
      title: 'Streakini kaybetme! 🔥',
      body: '$currentStreak günlük serini korumak için bugün çalış!',
    );
  }

  Future<void> _registerTokenToBackend(String token) async {
    final dio = _dio;
    if (dio == null) {
      debugPrint('Dio client yok, FCM token kaydedilemedi');
      return;
    }

    try {
      await dio.post(
        ApiConstants.registerFcmToken,
        data: {'fcm_token': token},
      );
      debugPrint('FCM token backend\'e kaydedildi');
    } catch (e) {
      debugPrint('FCM token backend\'e kaydedilemedi: $e');
    }
  }
}
