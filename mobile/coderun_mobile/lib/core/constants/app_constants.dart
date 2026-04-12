// Genel uygulama sabitleri.

abstract class AppConstants {
  static const String appName = 'Coderun';
  static const int splashDuration = 2; // saniye
  static const int maxLoginAttempts = 5;
  static const String defaultLocale = 'tr_TR';

  // Environment-based base URL
  // Development, staging, production için farklı URL'ler
  static String get apiBaseUrl {
    const env = String.fromEnvironment('ENV', defaultValue: 'development');
    const customUrl = String.fromEnvironment('API_BASE_URL');

    // Eğer custom URL verilmişse onu kullan
    if (customUrl.isNotEmpty) {
      return customUrl;
    }

    // Environment'a göre URL döndür
    switch (env) {
      case 'production':
        return 'https://api.coderun.com/api/v1';
      case 'staging':
        return 'https://staging-api.coderun.com/api/v1';
      case 'development':
      default:
        // Android emulator için 10.0.2.2, iOS simulator için localhost kullanılabilir
        return 'http://10.0.2.2:8000/api/v1';
    }
  }
}
