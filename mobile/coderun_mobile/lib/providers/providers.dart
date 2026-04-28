// Tüm Riverpod provider tanımları.

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/network/dio_client.dart';
import '../core/notifications/notification_service.dart';
import '../data/datasources/auth_remote_datasource.dart';
import '../data/datasources/module_remote_datasource.dart';
import '../data/datasources/gamification_remote_datasource.dart';
import '../data/datasources/placement_remote_datasource.dart';
import '../data/repositories/auth_repository.dart';
import '../data/repositories/module_repository.dart';
import '../data/repositories/gamification_repository.dart';

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

/// Dio HTTP istemci provider'ı.
final dioProvider = Provider<Dio>((ref) {
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
