// Dio HTTP istemci fabrikası.
// Interceptor'ları ve temel yapılandırmayı burada tanımlar.

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/api_constants.dart';
import 'network_interceptor.dart';

class DioClient {
  DioClient._();

  /// Yapılandırılmış Dio instance'ı oluşturur.
  static Dio createDio(FlutterSecureStorage storage) {
    final dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: const Duration(milliseconds: ApiConstants.connectTimeout),
        receiveTimeout: const Duration(milliseconds: ApiConstants.receiveTimeout),
        headers: const {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.add(
      NetworkInterceptor(storage: storage, dio: dio),
    );

    // Debug modda loglama — sadece debug build'de çalışır
    assert(() {
      dio.interceptors.add(
        LogInterceptor(
          requestBody: true,
          responseBody: true,
          // Token'ları loglamıyoruz — güvenlik
          requestHeader: false,
          responseHeader: false,
        ),
      );
      return true;
    }());

    return dio;
  }
}
