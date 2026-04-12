// API URL'leri ve endpoint sabitleri.
// 10.0.2.2 → Android emülatörden host machine localhost'a erişim adresi.

import 'app_constants.dart';

abstract class ApiConstants {
  // Base URL — environment-based, AppConstants'tan alınıyor
  static String get baseUrl => AppConstants.apiBaseUrl;

  // Auth endpoint'leri
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String refresh = '/auth/refresh';
  static const String me = '/auth/me';
  static const String logout = '/auth/logout';

  // Modül endpoint'leri
  static const String modules = '/modules';
  static const String moduleBySlug = '/modules/{slug}';
  static const String moduleProgress = '/modules/{slug}/progress';

  static String getModuleBySlug(String slug) => '/modules/$slug';
  static String getModuleProgress(String slug) => '/modules/$slug/progress';

  // Ders endpoint'leri
  static const String lessonsByModule = '/lessons/module/{moduleId}';
  static const String lessonDetail = '/lessons/{lessonId}';

  static String getLessonsByModule(String moduleId) => '/lessons/module/$moduleId';
  static String getLessonDetail(String lessonId) => '/lessons/$lessonId';
  static String submitLesson(String lessonId) => '/lessons/$lessonId/submit';

  // Placement endpoint'leri
  static String getPlacementQuestions(String slug) => '/placement/$slug';
  static String submitPlacement(String slug) => '/placement/$slug/submit';

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
