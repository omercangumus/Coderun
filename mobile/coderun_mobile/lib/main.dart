// Coderun mobil uygulama giriş noktası.

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/constants/app_constants.dart';
import 'core/notifications/notification_service.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'providers/providers.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  // NotificationService başlangıçta Dio olmadan başlatılır (sadece izin ve local notifications için)
  // Dio ile FCM token kaydı ProviderScope içinde yapılır
  final notificationService = NotificationService();
  await notificationService.initialize();

  runApp(
    ProviderScope(
      overrides: [
        notificationServiceProvider.overrideWith((ref) {
          final dio = ref.watch(dioProvider);
          return NotificationService(dio: dio);
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

    ThemeData appTheme;
    if (themeMode == 'dark') {
      appTheme = AppTheme.darkTheme;
    } else if (themeMode == 'coderun-comfort') {
      appTheme = AppTheme.comfortTheme;
    } else {
      appTheme = AppTheme.lightTheme;
    }

    return MaterialApp.router(
      title: AppConstants.appName,
      theme: appTheme,
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
