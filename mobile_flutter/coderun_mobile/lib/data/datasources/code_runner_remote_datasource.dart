// Coderun mobile — code runner uzak veri kaynağı.
// POST /api/v1/code/run ve POST /api/v1/code/submit için Dio tabanlı implementasyon.

import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../core/network/api_exception.dart';
import '../models/code_run_result_model.dart';

abstract class CodeRunnerRemoteDataSource {
  Future<CodeRunResultModel> runCode({
    required String language,
    required String code,
    String stdin,
    int timeoutMs,
    int memoryLimitMb,
  });

  Future<CodeSubmitResultModel> submitCode({
    required String questionId,
    required String code,
    required String language,
  });
}

class CodeRunnerRemoteDataSourceImpl implements CodeRunnerRemoteDataSource {
  final Dio _dio;

  const CodeRunnerRemoteDataSourceImpl({required Dio dio}) : _dio = dio;

  @override
  Future<CodeRunResultModel> runCode({
    required String language,
    required String code,
    String stdin = '',
    int timeoutMs = 5000,
    int memoryLimitMb = 128,
  }) async {
    try {
      final response = await _dio.post(
        ApiConstants.codeRun,
        data: {
          'language': language,
          'code': code,
          'stdin': stdin,
          'timeout_ms': timeoutMs,
          'memory_limit_mb': memoryLimitMb,
        },
      );
      final data = response.data;
      if (data is! Map<String, dynamic>) {
        throw const ApiException(message: 'Geçersiz yanıt formatı');
      }
      return CodeRunResultModel.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<CodeSubmitResultModel> submitCode({
    required String questionId,
    required String code,
    required String language,
  }) async {
    try {
      final response = await _dio.post(
        ApiConstants.codeSubmit,
        data: {
          'question_id': questionId,
          'code': code,
          'language': language,
        },
      );
      final data = response.data;
      if (data is! Map<String, dynamic>) {
        throw const ApiException(message: 'Geçersiz yanıt formatı');
      }
      return CodeSubmitResultModel.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }
}
