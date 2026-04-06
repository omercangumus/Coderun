// Validators unit testleri.

import 'package:flutter_test/flutter_test.dart';
import 'package:coderun_mobile/core/utils/validators.dart';

void main() {
  group('Validators.validateEmail', () {
    test('test_email_valid: geçerli email → null döner', () {
      expect(Validators.validateEmail('test@example.com'), isNull);
      expect(Validators.validateEmail('user.name+tag@domain.co'), isNull);
    });

    test('test_email_invalid_format: geçersiz format → hata mesajı döner', () {
      expect(Validators.validateEmail('notanemail'), isNotNull);
      expect(Validators.validateEmail('missing@'), isNotNull);
      expect(Validators.validateEmail('@nodomain.com'), isNotNull);
    });

    test('test_email_empty: boş değer → hata mesajı döner', () {
      expect(Validators.validateEmail(''), isNotNull);
      expect(Validators.validateEmail(null), isNotNull);
    });
  });

  group('Validators.validatePassword', () {
    test('test_password_valid: geçerli şifre → null döner', () {
      expect(Validators.validatePassword('Password1'), isNull);
      expect(Validators.validatePassword('SecurePass123'), isNull);
    });

    test('test_password_too_short: 7 karakter → hata mesajı döner', () {
      final result = Validators.validatePassword('Pass1A');
      expect(result, isNotNull);
      expect(result, contains('8'));
    });

    test('test_password_no_uppercase: büyük harf yok → hata mesajı döner', () {
      final result = Validators.validatePassword('password123');
      expect(result, isNotNull);
      expect(result, contains('büyük harf'));
    });

    test('test_password_no_number: rakam yok → hata mesajı döner', () {
      final result = Validators.validatePassword('PasswordABC');
      expect(result, isNotNull);
      expect(result, contains('rakam'));
    });

    test('test_password_empty: boş değer → hata mesajı döner', () {
      expect(Validators.validatePassword(''), isNotNull);
      expect(Validators.validatePassword(null), isNotNull);
    });
  });

  group('Validators.validateUsername', () {
    test('test_username_valid: geçerli kullanıcı adı → null döner', () {
      expect(Validators.validateUsername('user123'), isNull);
      expect(Validators.validateUsername('my_user'), isNull);
      expect(Validators.validateUsername('ABC'), isNull);
    });

    test('test_username_too_short: 2 karakter → hata mesajı döner', () {
      final result = Validators.validateUsername('ab');
      expect(result, isNotNull);
      expect(result, contains('3'));
    });

    test('test_username_invalid_chars: özel karakter → hata mesajı döner', () {
      final result = Validators.validateUsername('user@name');
      expect(result, isNotNull);
      expect(result, contains('harf'));
    });

    test('test_username_empty: boş değer → hata mesajı döner', () {
      expect(Validators.validateUsername(''), isNotNull);
      expect(Validators.validateUsername(null), isNotNull);
    });
  });
}
