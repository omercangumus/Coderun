// Tüm Riverpod provider tanımları.

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/network/dio_client.dart';
import '../core/notifications/notification_service.dart';
import '../data/datasources/auth_remote_datasource.dart';
import '../data/datasources/mentor_remote_datasource.dart';
import '../data/datasources/module_remote_datasource.dart';
import '../data/datasources/gamification_remote_datasource.dart';
import '../data/datasources/placement_remote_datasource.dart';
import '../data/repositories/auth_repository.dart';
import '../data/repositories/mentor_repository.dart';
import '../data/repositories/module_repository.dart';
import '../data/repositories/gamification_repository.dart';
import '../data/repositories/code_runner_repository.dart';
import '../data/datasources/code_runner_remote_datasource.dart';

/// NotificationService provider — main.dart'ta override edilir.
final notificationServiceProvider = Provider<NotificationService>((ref) {
  final dio = ref.watch(dioProvider);
  return NotificationService(dio: dio);
});

/// Şifreli depolama provider'ı.
final secureStorageProvider = Provider<FlutterSecureStorage>((ref) {
  return const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );
});

/// API URL değişince Dio yeniden oluşturulur (profil → geliştirici ayarı).
final apiConfigRevisionProvider = StateProvider<int>((ref) => 0);

/// Dio HTTP istemci provider'ı.
final dioProvider = Provider<Dio>((ref) {
  ref.watch(apiConfigRevisionProvider);
  final storage = ref.watch(secureStorageProvider);
  return DioClient.createDio(storage);
});

/// Auth uzak veri kaynağı provider'ı.
final authRemoteDataSourceProvider = Provider<AuthRemoteDataSource>((ref) {
  final dio = ref.watch(dioProvider);
  return AuthRemoteDataSourceImpl(dio: dio);
});

/// Auth repository provider'ı.
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final dataSource = ref.watch(authRemoteDataSourceProvider);
  final storage = ref.watch(secureStorageProvider);
  return AuthRepositoryImpl(
    remoteDataSource: dataSource,
    storage: storage,
  );
});

/// Module uzak veri kaynağı provider'ı.
final moduleRemoteDataSourceProvider = Provider<ModuleRemoteDataSource>((ref) {
  final dio = ref.watch(dioProvider);
  return ModuleRemoteDataSourceImpl(dio: dio);
});

/// Module repository provider'ı.
final moduleRepositoryProvider = Provider<ModuleRepository>((ref) {
  final dataSource = ref.watch(moduleRemoteDataSourceProvider);
  return ModuleRepositoryImpl(remoteDataSource: dataSource);
});

/// Gamification uzak veri kaynağı provider'ı.
final gamificationRemoteDataSourceProvider =
    Provider<GamificationRemoteDataSource>((ref) {
  final dio = ref.watch(dioProvider);
  return GamificationRemoteDataSourceImpl(dio: dio);
});

/// Gamification repository provider'ı.
final gamificationRepositoryProvider = Provider<GamificationRepository>((ref) {
  final dataSource = ref.watch(gamificationRemoteDataSourceProvider);
  return GamificationRepositoryImpl(remoteDataSource: dataSource);
});

/// Placement uzak veri kaynağı provider'ı.
final placementDataSourceProvider = Provider<PlacementRemoteDataSource>((ref) {
  return PlacementRemoteDataSourceImpl(dio: ref.watch(dioProvider));
});

/// Mentor uzak veri kaynağı provider'ı.
final mentorRemoteDataSourceProvider = Provider<MentorRemoteDataSource>((ref) {
  return MentorRemoteDataSourceImpl(dio: ref.watch(dioProvider));
});

/// Mentor repository provider'ı.
final mentorRepositoryProvider = Provider<MentorRepository>((ref) {
  return MentorRepositoryImpl(
    remoteDataSource: ref.watch(mentorRemoteDataSourceProvider),
  );
});

/// Code Runner uzak veri kaynağı provider'ı.
final codeRunnerRemoteDataSourceProvider =
    Provider<CodeRunnerRemoteDataSource>((ref) {
  final dio = ref.watch(dioProvider);
  return CodeRunnerRemoteDataSourceImpl(dio: dio);
});

/// Code Runner repository provider'ı.
final codeRunnerRepositoryProvider = Provider<CodeRunnerRepository>((ref) {
  final dataSource = ref.watch(codeRunnerRemoteDataSourceProvider);
  return CodeRunnerRepositoryImpl(remoteDataSource: dataSource);
});

/// Theme mode provider using secure storage persistence
final themeModeProvider = StateNotifierProvider<ThemeModeNotifier, String>((ref) {
  final storage = ref.watch(secureStorageProvider);
  return ThemeModeNotifier(storage);
});

class ThemeModeNotifier extends StateNotifier<String> {
  final FlutterSecureStorage _storage;
  static const _themeKey = 'selected_theme';

  ThemeModeNotifier(this._storage) : super('light') {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final savedTheme = await _storage.read(key: _themeKey);
    if (savedTheme != null) {
      state = savedTheme;
    }
  }

  Future<void> setTheme(String theme) async {
    await _storage.write(key: _themeKey, value: theme);
    state = theme;
  }
}
