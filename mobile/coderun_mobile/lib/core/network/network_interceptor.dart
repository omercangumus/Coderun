// Token ekleme ve otomatik yenileme interceptor'ı.
// 401 hatası alındığında refresh token ile yeni access token alır.

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/api_constants.dart';
import '../constants/storage_keys.dart';

class NetworkInterceptor extends Interceptor {
  final FlutterSecureStorage _storage;
  final Dio _dio;

  // Refresh işlemi sırasında sonsuz döngüyü önlemek için flag
  bool _isRefreshing = false;

  NetworkInterceptor({
    required FlutterSecureStorage storage,
    required Dio dio,
  })  : _storage = storage,
        _dio = dio;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // Refresh endpoint'i için token ekleme — sonsuz döngü önlemi
    if (options.path.contains(ApiConstants.refresh)) {
      return handler.next(options);
    }

    final token = await _storage.read(key: StorageKeys.accessToken);
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    return handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    // Sadece 401 hatalarını yakala ve refresh endpoint'i değilse işle
    if (err.response?.statusCode == 401 &&
        !err.requestOptions.path.contains(ApiConstants.refresh) &&
        !_isRefreshing) {
      _isRefreshing = true;

      try {
        final refreshToken = await _storage.read(key: StorageKeys.refreshToken);
        if (refreshToken == null) {
          await _clearAndReject(err, handler);
          return;
        }

        // Yeni token al
        final response = await _dio.post(
          ApiConstants.refresh,
          data: {'refresh_token': refreshToken},
        );

        final newAccessToken = response.data['access_token'] as String?;
        final newRefreshToken = response.data['refresh_token'] as String?;

        if (newAccessToken == null) {
          await _clearAndReject(err, handler);
          return;
        }

        // Yeni token'ları kaydet
        await _storage.write(key: StorageKeys.accessToken, value: newAccessToken);
        if (newRefreshToken != null) {
          await _storage.write(key: StorageKeys.refreshToken, value: newRefreshToken);
        }

        // Orijinal isteği yeni token ile tekrar gönder
        final retryOptions = err.requestOptions;
        retryOptions.headers['Authorization'] = 'Bearer $newAccessToken';
        final retryResponse = await _dio.fetch(retryOptions);
        return handler.resolve(retryResponse);
      } catch (_) {
        await _clearAndReject(err, handler);
      } finally {
        _isRefreshing = false;
      }
    } else {
      return handler.next(err);
    }
  }

  Future<void> _clearAndReject(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    await _storage.deleteAll();
    return handler.next(err);
  }
}
