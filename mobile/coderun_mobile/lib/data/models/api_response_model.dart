// Generic API yanıt modeli.
// Success, Error ve Loading durumlarını temsil eder.

import 'package:freezed_annotation/freezed_annotation.dart';

part 'api_response_model.freezed.dart';

@freezed
class ApiResponse<T> with _$ApiResponse<T> {
  const factory ApiResponse.success(T data) = Success<T>;
  const factory ApiResponse.error(
    String message, {
    int? statusCode,
  }) = Error<T>;
  const factory ApiResponse.loading() = Loading<T>;
}
