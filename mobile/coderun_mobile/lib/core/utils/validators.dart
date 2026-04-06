// Form validasyon fonksiyonları.
// Tüm hata mesajları Türkçe döner.

abstract class Validators {
  /// Email adresi doğrulama.
  static String? validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'E-posta adresi boş bırakılamaz';
    }
    final emailRegex = RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    if (!emailRegex.hasMatch(value.trim())) {
      return 'Geçerli bir e-posta adresi girin';
    }
    return null;
  }

  /// Şifre doğrulama.
  /// En az 8 karakter, 1 büyük harf, 1 rakam zorunlu.
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Şifre boş bırakılamaz';
    }
    if (value.length < 8) {
      return 'Şifre en az 8 karakter olmalıdır';
    }
    if (!value.contains(RegExp(r'[A-Z]'))) {
      return 'Şifre en az bir büyük harf içermelidir';
    }
    if (!value.contains(RegExp(r'[0-9]'))) {
      return 'Şifre en az bir rakam içermelidir';
    }
    return null;
  }

  /// Kullanıcı adı doğrulama.
  /// 3-30 karakter, sadece harf, rakam ve alt çizgi.
  static String? validateUsername(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Kullanıcı adı boş bırakılamaz';
    }
    if (value.trim().length < 3) {
      return 'Kullanıcı adı en az 3 karakter olmalıdır';
    }
    if (value.trim().length > 30) {
      return 'Kullanıcı adı en fazla 30 karakter olabilir';
    }
    final usernameRegex = RegExp(r'^[a-zA-Z0-9_]+$');
    if (!usernameRegex.hasMatch(value.trim())) {
      return 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir';
    }
    return null;
  }

  /// Genel zorunlu alan kontrolü.
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName boş bırakılamaz';
    }
    return null;
  }

  /// Şifre eşleşme kontrolü.
  static String? validatePasswordMatch(String? value, String password) {
    if (value == null || value.isEmpty) {
      return 'Şifre tekrarı boş bırakılamaz';
    }
    if (value != password) {
      return 'Şifreler eşleşmiyor';
    }
    return null;
  }
}
