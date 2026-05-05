// Go_router navigasyon tanımları.
// Auth durumuna göre otomatik yönlendirme yapar.
// refreshListenable ile GoRouter yeniden oluşturulmadan redirect tetiklenir.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../presentation/screens/splash/splash_screen.dart';
import '../../presentation/screens/onboarding/welcome_screen.dart';
import '../../presentation/screens/onboarding/choose_path_screen.dart';
import '../../presentation/screens/auth/login_screen.dart';
import '../../presentation/screens/auth/register_screen.dart';
import '../../presentation/screens/home/home_screen.dart';
import '../../presentation/screens/learn/learning_path_screen.dart';
import '../../presentation/screens/lesson/lesson_screen.dart';
import '../../presentation/screens/lesson/lesson_result_screen.dart';
import '../../presentation/screens/badges/badges_screen.dart';
import '../../presentation/screens/mentor/mentor_chat_screen.dart';
import '../../presentation/screens/placement/placement_screen.dart';
import '../../data/models/lesson_result_model.dart';

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
      final loc = state.matchedLocation;
      final isOnSplash = loc == '/';
      final isOnAuth = loc == '/login' || loc == '/register';
      final isOnOnboarding = loc == '/welcome' || loc == '/choose-path';

      return authState.when(
        initial: () => isOnSplash ? null : '/',
        loading: () => isOnSplash ? null : '/',
        authenticated: (_) =>
            isOnAuth || isOnSplash || isOnOnboarding ? '/home' : null,
        unauthenticated: () =>
            isOnAuth || isOnOnboarding ? null : '/welcome',
        error: (_) => isOnAuth || isOnOnboarding ? null : '/welcome',
      );
    },
    routes: [
      GoRoute(
        path: '/',
        builder: (_, __) => const SplashScreen(),
      ),
      GoRoute(
        path: '/welcome',
        builder: (_, __) => const WelcomeScreen(),
      ),
      GoRoute(
        path: '/choose-path',
        builder: (_, __) => const ChoosePathScreen(),
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
        path: '/mentor',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>?;
          return MentorChatScreen(
            moduleSlug: extra?['moduleSlug'] as String?,
            lessonTitle: extra?['lessonTitle'] as String?,
            questionText: extra?['questionText'] as String?,
            context: (extra?['context'] as String?) ?? 'general',
          );
        },
      ),
      GoRoute(
        path: '/home',
        builder: (_, __) => const HomeScreen(),
        routes: [
          GoRoute(
            path: 'badges',
            builder: (_, __) => const BadgesScreen(),
          ),
          GoRoute(
            path: 'learn/:moduleSlug',
            builder: (context, state) => LearningPathScreen(
              moduleSlug: state.pathParameters['moduleSlug']!,
            ),
            routes: [
              GoRoute(
                path: 'placement',
                builder: (context, state) => PlacementScreen(
                  moduleSlug: state.pathParameters['moduleSlug']!,
                ),
              ),
              GoRoute(
                path: 'lesson/:lessonId',
                builder: (context, state) => LessonScreen(
                  lessonId: state.pathParameters['lessonId']!,
                  moduleSlug: state.pathParameters['moduleSlug']!,
                ),
                routes: [
                  GoRoute(
                    path: 'result',
                    builder: (context, state) => LessonResultScreen(
                      result: state.extra as LessonResultModel,
                      moduleSlug: state.pathParameters['moduleSlug']!,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
