// Genel uygulama sabitleri.

import '../config/api_endpoint_config.dart';

abstract class AppConstants {
  static const String appName = 'Coderun';
  static const int splashDuration = 2; // saniye
  static const int maxLoginAttempts = 5;
  static const String defaultLocale = 'tr_TR';

  /// Aktif API kök adresi (emülatör / USB / dart-define / profil override).
  static String get apiBaseUrl => ApiEndpointConfig.baseUrl;
}
