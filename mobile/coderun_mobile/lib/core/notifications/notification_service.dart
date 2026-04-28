import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:go_router/go_router.dart';
import 'package:dio/dio.dart';
import '../constants/api_constants.dart';

class NotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();
  final Dio? _dio;
  GlobalKey<NavigatorState>? _navigatorKey;

  NotificationService({Dio? dio}) : _dio = dio;

  void setNavigatorKey(GlobalKey<NavigatorState> key) {
    _navigatorKey = key;
  }

  Future<void> initialize() async {
    await _requestPermission();
    await _initializeLocalNotifications();

    // FCM token al ve backend'e kaydet
    final token = await _messaging.getToken();
    if (token != null) {
      debugPrint('FCM Token alındı, backend\'e kaydediliyor...');
      await _registerTokenToBackend(token);
    }

    // Token yenilendiğinde backend'i güncelle
    _messaging.onTokenRefresh.listen(_registerTokenToBackend);

    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    FirebaseMessaging.onMessageOpenedApp.listen(_handleBackgroundMessage);

    final initialMessage = await _messaging.getInitialMessage();
    if (initialMessage != null) {
      _handleBackgroundMessage(initialMessage);
    }
  }

  Future<void> _requestPermission() async {
    final settings = await _messaging.requestPermission(
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
    // Bildirime tıklandığında ilgili ekrana yönlendir
    debugPrint('Bildirime tıklandı: ${message.data}');
    
    final route = message.data['route'] as String?;
    if (route != null && _navigatorKey?.currentContext != null) {
      // go_router ile yönlendirme
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
    if (_dio == null) {
      debugPrint('Dio client yok, FCM token kaydedilemedi');
      return;
    }

    try {
      await _dio!.post(
        ApiConstants.registerFcmToken,
        data: {'fcm_token': token},
      );
      debugPrint('FCM token backend\'e kaydedildi');
    } catch (e) {
      debugPrint('FCM token backend\'e kaydedilemedi: $e');
    }
  }
}
