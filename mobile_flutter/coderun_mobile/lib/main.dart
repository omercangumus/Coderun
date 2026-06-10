// Coderun mobil uygulama giriş noktası.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/bootstrap/app_bootstrap.dart';
import 'core/constants/app_constants.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'providers/providers.dart';

void main() async {
  final notificationService = await AppBootstrap.initialize();

  runApp(
    ProviderScope(
      overrides: [
        notificationServiceProvider.overrideWith((ref) {
          final dio = ref.watch(dioProvider);
          notificationService.bindDio(dio);
          return notificationService;
        }),
      ],
      child: const CoderunApp(),
    ),
  );
}

class CoderunApp extends ConsumerWidget {
  const CoderunApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final themeMode = ref.watch(themeModeProvider);

    final ThemeData appTheme;
    final ThemeMode materialThemeMode;
    if (themeMode == 'dark') {
      appTheme = AppTheme.darkTheme;
      materialThemeMode = ThemeMode.dark;
    } else if (themeMode == 'coderun-comfort') {
      appTheme = AppTheme.comfortTheme;
      materialThemeMode = ThemeMode.light;
    } else {
      appTheme = AppTheme.lightTheme;
      materialThemeMode = ThemeMode.light;
    }

    return MaterialApp.router(
      title: AppConstants.appName,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: materialThemeMode,
      // Comfort teması seçiliyken light/dark yerine özel palet kullan.
      builder: (context, child) {
        if (themeMode == 'coderun-comfort') {
          return Theme(data: appTheme, child: child ?? const SizedBox.shrink());
        }
        return child ?? const SizedBox.shrink();
      },
      routerConfig: router,
      debugShowCheckedModeBanner: false,
      locale: const Locale('tr', 'TR'),
      supportedLocales: const [
        Locale('tr', 'TR'),
        Locale('en', 'US'),
      ],
    );
  }
}
