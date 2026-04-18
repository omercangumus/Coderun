// SecureStorage anahtar sabitleri.
// Token ve kullanıcı bilgilerini şifreli olarak saklamak için kullanılır.

abstract class StorageKeys {
  static const String accessToken = 'access_token';
  static const String refreshToken = 'refresh_token';
  static const String userId = 'user_id';
  static const String username = 'username';
  static const String isLoggedIn = 'is_logged_in';
  static const String streakMilestoneShown = 'streak_milestone_shown';
  static const String notificationEnabled = 'notification_enabled';
  static const String notificationHour = 'notification_hour';
  static const String notificationMinute = 'notification_minute';
}
