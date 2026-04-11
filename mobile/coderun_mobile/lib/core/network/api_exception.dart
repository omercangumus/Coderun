// Özel API hata sınıfları.
// DioException'ları anlamlı Türkçe mesajlara dönüştürür.

import 'package:dio/dio.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final String? errorCode;

  const ApiException({
    required this.message,
    this.statusCode,
    this.errorCode,
  });

  factory ApiException.fromDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
        return const ApiException(
          message: 'Bağlantı zaman aşımına uğradı',
          errorCode: 'CONNECTION_TIMEOUT',
        );
      case DioExceptionType.receiveTimeout:
        return const ApiException(
          message: 'Sunucu yanıt vermedi',
          errorCode: 'RECEIVE_TIMEOUT',
        );
      case DioExceptionType.sendTimeout:
        return const ApiException(
          message: 'İstek gönderilemedi, zaman aşımı',
          errorCode: 'SEND_TIMEOUT',
        );
      case DioExceptionType.badResponse:
        return _handleBadResponse(error);
      case DioExceptionType.connectionError:
        return const ApiException(
          message: 'İnternet bağlantınızı kontrol edin',
          errorCode: 'CONNECTION_ERROR',
        );
      case DioExceptionType.cancel:
        return const ApiException(
          message: 'İstek iptal edildi',
          errorCode: 'CANCELLED',
        );
      default:
        return const ApiException(
          message: 'Beklenmedik bir hata oluştu',
          errorCode: 'UNKNOWN',
        );
    }
  }

  static ApiException _handleBadResponse(DioException error) {
    final statusCode = error.response?.statusCode;
    final data = error.response?.data;

    String message;
    switch (statusCode) {
      case 400:
        message = _extractMessage(data) ?? 'Geçersiz istek';
        break;
      case 401:
        message = 'Oturum süreniz doldu, tekrar giriş yapın';
        break;
      case 403:
        message = 'Bu işlem için yetkiniz yok';
        break;
      case 404:
        message = 'İstenen kaynak bulunamadı';
        break;
      case 422:
        message = _extractValidationMessage(data) ?? 'Girilen bilgiler geçersiz';
        break;
      case 500:
        message = 'Sunucu hatası, lütfen daha sonra tekrar deneyin';
        break;
      default:
        message = _extractMessage(data) ?? 'Bir hata oluştu';
    }

    return ApiException(
      message: message,
      statusCode: statusCode,
      errorCode: 'HTTP_$statusCode',
    );
  }

  static String? _extractMessage(dynamic data) {
    if (data is Map<String, dynamic>) {
      return data['detail']?.toString() ?? data['message']?.toString();
    }
    return null;
  }

  static String? _extractValidationMessage(dynamic data) {
    if (data is Map<String, dynamic>) {
      final detail = data['detail'];
      if (detail is List && detail.isNotEmpty) {
        final first = detail.first;
        if (first is Map<String, dynamic>) {
          return first['msg']?.toString();
        }
      }
      return detail?.toString();
    }
    return null;
  }

  @override
  String toString() => message;
}
