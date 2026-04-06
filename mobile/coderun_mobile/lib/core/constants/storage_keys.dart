// SecureStorage anahtar sabitleri.
// Token ve kullanıcı bilgilerini şifreli olarak saklamak için kullanılır.

abstract class StorageKeys {
  static const String accessToken = 'access_token';
  static const String refreshToken = 'refresh_token';
  static const String userId = 'user_id';
  static const String username = 'username';
  static const String isLoggedIn = 'is_logged_in';
}
