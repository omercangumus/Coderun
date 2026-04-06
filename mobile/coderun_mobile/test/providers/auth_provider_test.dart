// Auth provider unit testleri.
// Mocktail ile AuthRepository mock'lanır.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:coderun_mobile/data/models/api_response_model.dart';
import 'package:coderun_mobile/data/models/token_model.dart';
import 'package:coderun_mobile/data/models/user_model.dart';
import 'package:coderun_mobile/data/repositories/auth_repository.dart';
import 'package:coderun_mobile/providers/auth_provider.dart';
import 'package:coderun_mobile/providers/providers.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

UserModel _fakeUser() => UserModel(
      id: 'test-id',
      email: 'test@example.com',
      username: 'testuser',
      xp: 0,
      level: 1,
      streak: 0,
      createdAt: DateTime(2026, 3, 23),
    );

TokenModel _fakeToken() => const TokenModel(
      accessToken: 'access',
      refreshToken: 'refresh',
      tokenType: 'bearer',
      expiresIn: 1800,
    );

void main() {
  late MockAuthRepository mockRepo;
  late ProviderContainer container;

  setUp(() {
    mockRepo = MockAuthRepository();
    container = ProviderContainer(
      overrides: [
        authRepositoryProvider.overrideWithValue(mockRepo),
      ],
    );
  });

  tearDown(() => container.dispose());

  test('test_initial_state: başlangıç state\'i initial veya unauthenticated', () {
    when(() => mockRepo.isLoggedIn()).thenAnswer((_) async => false);
    // AuthNotifier constructor'da checkAuthStatus çağrılır
    // isLoggedIn false → unauthenticated
    expect(
      container.read(authProvider),
      anyOf([
        const AuthState.initial(),
        const AuthState.unauthenticated(),
      ]),
    );
  });

  test('test_check_auth_not_logged_in: storage boş → unauthenticated', () async {
    when(() => mockRepo.isLoggedIn()).thenAnswer((_) async => false);

    await container.read(authProvider.notifier).checkAuthStatus();

    expect(container.read(authProvider), const AuthState.unauthenticated());
  });

  test('test_check_auth_logged_in: token var → authenticated', () async {
    when(() => mockRepo.isLoggedIn()).thenAnswer((_) async => true);
    when(() => mockRepo.getCurrentUser()).thenAnswer(
      (_) async => ApiResponse.success(_fakeUser()),
    );

    await container.read(authProvider.notifier).checkAuthStatus();

    expect(
      container.read(authProvider),
      AuthState.authenticated(_fakeUser()),
    );
  });

  test('test_login_success: başarılı login → authenticated state', () async {
    when(() => mockRepo.login(any(), any())).thenAnswer(
      (_) async => ApiResponse.success(_fakeToken()),
    );
    when(() => mockRepo.getCurrentUser()).thenAnswer(
      (_) async => ApiResponse.success(_fakeUser()),
    );

    await container.read(authProvider.notifier).login('test@example.com', 'Password1');

    expect(
      container.read(authProvider),
      AuthState.authenticated(_fakeUser()),
    );
  });

  test('test_login_failure: yanlış şifre → error state', () async {
    when(() => mockRepo.login(any(), any())).thenAnswer(
      (_) async => const ApiResponse.error('Geçersiz kimlik bilgileri'),
    );

    await container.read(authProvider.notifier).login('test@example.com', 'wrong');

    expect(
      container.read(authProvider),
      const AuthState.error('Geçersiz kimlik bilgileri'),
    );
  });

  test('test_register_success: başarılı kayıt → authenticated state', () async {
    when(() => mockRepo.register(any(), any(), any())).thenAnswer(
      (_) async => ApiResponse.success(_fakeUser()),
    );
    when(() => mockRepo.login(any(), any())).thenAnswer(
      (_) async => ApiResponse.success(_fakeToken()),
    );
    when(() => mockRepo.getCurrentUser()).thenAnswer(
      (_) async => ApiResponse.success(_fakeUser()),
    );

    await container.read(authProvider.notifier).register(
          'test@example.com',
          'testuser',
          'Password1',
        );

    expect(
      container.read(authProvider),
      AuthState.authenticated(_fakeUser()),
    );
  });

  test('test_logout: logout → unauthenticated state', () async {
    when(() => mockRepo.clearTokens()).thenAnswer((_) async {});

    await container.read(authProvider.notifier).logout();

    expect(container.read(authProvider), const AuthState.unauthenticated());
  });
}
