// API URL'leri ve endpoint sabitleri.
// 10.0.2.2 → Android emülatörden host machine localhost'a erişim adresi.

abstract class ApiConstants {
  // Base URL — production'da environment variable'dan alınacak
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';

  // Auth endpoint'leri
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String refresh = '/auth/refresh';
  static const String me = '/auth/me';
  static const String logout = '/auth/logout';

  // Modül endpoint'leri
  static const String modules = '/modules';

  // Gamification endpoint'leri
  static const String leaderboard = '/gamification/leaderboard';
  static const String stats = '/gamification/stats';
  static const String badges = '/gamification/badges';
  static const String levelProgress = '/gamification/level-progress';
  static const String streak = '/gamification/streak';

  // Timeout değerleri (milisaniye)
  static const int connectTimeout = 30000;
  static const int receiveTimeout = 30000;
}
