// Go_router navigasyon tanımları.
// Auth durumuna göre otomatik yönlendirme yapar.
// refreshListenable ile GoRouter yeniden oluşturulmadan redirect tetiklenir.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../presentation/screens/splash/splash_screen.dart';
import '../../presentation/screens/auth/login_screen.dart';
import '../../presentation/screens/auth/register_screen.dart';
import '../../presentation/screens/home/home_screen.dart';

/// StateNotifier değişikliklerini ChangeNotifier'a köprüleyen yardımcı sınıf.
/// GoRouter'ın refreshListenable parametresi için kullanılır.
class _RouterNotifier extends ChangeNotifier {
  _RouterNotifier(this._ref) {
    _ref.listen<AuthState>(authProvider, (_, __) => notifyListeners());
  }

  final Ref _ref;

  AuthState get authState => _ref.read(authProvider);
}

final routerProvider = Provider<GoRouter>((ref) {
  final notifier = _RouterNotifier(ref);

  return GoRouter(
    initialLocation: '/',
    refreshListenable: notifier,
    redirect: (BuildContext context, GoRouterState state) {
      final authState = notifier.authState;
      final isOnSplash = state.matchedLocation == '/';
      final isOnAuth = state.matchedLocation == '/login' ||
          state.matchedLocation == '/register';

      return authState.when(
        initial: () => isOnSplash ? null : '/',
        loading: () => isOnSplash ? null : '/',
        authenticated: (_) => isOnAuth || isOnSplash ? '/home' : null,
        unauthenticated: () => isOnAuth ? null : '/login',
        error: (_) => isOnAuth ? null : '/login',
      );
    },
    routes: [
      GoRoute(
        path: '/',
        builder: (_, __) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (_, __) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (_, __) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (_, __) => const HomeScreen(),
      ),
    ],
  );
});
