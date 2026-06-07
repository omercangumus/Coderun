// Uygulama başlangıç işlemleri — Firebase opsiyonel (dev'de google-services.json olmadan çalışır).

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

import '../config/api_endpoint_config.dart';
import '../notifications/notification_service.dart';

class AppBootstrap {
  AppBootstrap._();

  static bool firebaseEnabled = false;

  static Future<NotificationService> initialize() async {
    WidgetsFlutterBinding.ensureInitialized();
    await ApiEndpointConfig.load();
    firebaseEnabled = await _tryInitializeFirebase();

    final notificationService = NotificationService(firebaseEnabled: firebaseEnabled);
    await notificationService.initialize();
    return notificationService;
  }

  static Future<bool> _tryInitializeFirebase() async {
    const skipFirebase = bool.fromEnvironment(
      'SKIP_FIREBASE',
      defaultValue: kDebugMode,
    );

    if (skipFirebase) {
      debugPrint('Firebase atlandı (SKIP_FIREBASE / debug modu).');
      return false;
    }

    try {
      await Firebase.initializeApp();
      return true;
    } catch (error, stackTrace) {
      debugPrint('Firebase başlatılamadı — bildirimler devre dışı: $error');
      debugPrint('$stackTrace');
      return false;
    }
  }
}
