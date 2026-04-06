// Auth repository katmanı.
// DataSource ile Provider arasında köprü kurar, hataları ApiResponse'a dönüştürür.

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../core/network/api_exception.dart';
import '../../core/constants/storage_keys.dart';
import '../datasources/auth_remote_datasource.dart';
import '../models/api_response_model.dart';
import '../models/token_model.dart';
import '../models/user_model.dart';

abstract class AuthRepository {
  Future<ApiResponse<TokenModel>> login(String email, String password);
  Future<ApiResponse<UserModel>> register(
    String email,
    String username,
    String password,
  );
  Future<ApiResponse<UserModel>> getCurrentUser();
  Future<void> saveTokens(TokenModel tokens);
  Future<void> clearTokens();
  Future<bool> isLoggedIn();
  Future<String?> getAccessToken();
}

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final FlutterSecureStorage _storage;

  const AuthRepositoryImpl({
    required AuthRemoteDataSource remoteDataSource,
    required FlutterSecureStorage storage,
  })  : _remoteDataSource = remoteDataSource,
        _storage = storage;

  @override
  Future<ApiResponse<TokenModel>> login(
    String email,
    String password,
  ) async {
    try {
      final tokens = await _remoteDataSource.login(email, password);
      await saveTokens(tokens);
      return ApiResponse.success(tokens);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<ApiResponse<UserModel>> register(
    String email,
    String username,
    String password,
  ) async {
    try {
      final user = await _remoteDataSource.register(email, username, password);
      return ApiResponse.success(user);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<ApiResponse<UserModel>> getCurrentUser() async {
    try {
      final user = await _remoteDataSource.getMe();
      return ApiResponse.success(user);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<void> saveTokens(TokenModel tokens) async {
    await Future.wait([
      _storage.write(key: StorageKeys.accessToken, value: tokens.accessToken),
      _storage.write(key: StorageKeys.refreshToken, value: tokens.refreshToken),
      _storage.write(key: StorageKeys.isLoggedIn, value: 'true'),
    ]);
  }

  @override
  Future<void> clearTokens() async {
    await _storage.deleteAll();
  }

  @override
  Future<bool> isLoggedIn() async {
    final value = await _storage.read(key: StorageKeys.isLoggedIn);
    return value == 'true';
  }

  @override
  Future<String?> getAccessToken() async {
    return _storage.read(key: StorageKeys.accessToken);
  }
}
