// Auth state yönetimi.
// Kullanıcının oturum durumunu ve işlemlerini yönetir.

import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/user_model.dart';
import '../data/repositories/auth_repository.dart';
import 'providers.dart';

part 'auth_provider.freezed.dart';

@freezed
class AuthState with _$AuthState {
  const factory AuthState.initial() = _Initial;
  const factory AuthState.loading() = _Loading;
  const factory AuthState.authenticated(UserModel user) = _Authenticated;
  const factory AuthState.unauthenticated() = _Unauthenticated;
  const factory AuthState.error(String message) = _Error;
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _authRepository;

  AuthNotifier(this._authRepository) : super(const AuthState.initial()) {
    checkAuthStatus();
  }

  /// Uygulama açılışında oturum durumunu kontrol eder.
  Future<void> checkAuthStatus() async {
    try {
      final loggedIn = await _authRepository.isLoggedIn();
      if (!loggedIn) {
        state = const AuthState.unauthenticated();
        return;
      }

      final response = await _authRepository.getCurrentUser();
      response.when(
        success: (user) => state = AuthState.authenticated(user),
        error: (_, __) => state = const AuthState.unauthenticated(),
        loading: () => state = const AuthState.unauthenticated(),
      );
    } catch (_) {
      state = const AuthState.unauthenticated();
    }
  }

  /// Kullanıcı girişi yapar.
  Future<void> login(String email, String password) async {
    state = const AuthState.loading();
    try {
      final tokenResponse = await _authRepository.login(email, password);
      await tokenResponse.when(
        success: (_) async {
          final userResponse = await _authRepository.getCurrentUser();
          userResponse.when(
            success: (user) => state = AuthState.authenticated(user),
            error: (message, _) => state = AuthState.error(message),
            loading: () {},
          );
        },
        error: (message, _) => state = AuthState.error(message),
        loading: () {},
      );
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  /// Yeni kullanıcı kaydı yapar ve otomatik giriş uygular.
  Future<void> register(
    String email,
    String username,
    String password,
  ) async {
    state = const AuthState.loading();
    try {
      final response = await _authRepository.register(email, username, password);
      await response.when(
        success: (_) => login(email, password),
        error: (message, _) => state = AuthState.error(message),
        loading: () {},
      );
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  /// Oturumu kapatır.
  Future<void> logout() async {
    await _authRepository.clearTokens();
    state = const AuthState.unauthenticated();
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return AuthNotifier(repository);
});
