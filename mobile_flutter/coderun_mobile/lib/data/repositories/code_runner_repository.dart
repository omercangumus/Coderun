// Coderun mobile — code runner repository katmanı.
// DataSource ile UI arasında köprü kurar, hataları ApiResponse'a dönüştürür.

import '../../core/network/api_exception.dart';
import '../datasources/code_runner_remote_datasource.dart';
import '../models/api_response_model.dart';
import '../models/code_run_result_model.dart';

abstract class CodeRunnerRepository {
  Future<ApiResponse<CodeRunResultModel>> runCode({
    required String language,
    required String code,
    String stdin,
    int timeoutMs,
    int memoryLimitMb,
  });

  Future<ApiResponse<CodeSubmitResultModel>> submitCode({
    required String questionId,
    required String code,
    required String language,
  });
}

class CodeRunnerRepositoryImpl implements CodeRunnerRepository {
  final CodeRunnerRemoteDataSource _remoteDataSource;

  const CodeRunnerRepositoryImpl({
    required CodeRunnerRemoteDataSource remoteDataSource,
  }) : _remoteDataSource = remoteDataSource;

  @override
  Future<ApiResponse<CodeRunResultModel>> runCode({
    required String language,
    required String code,
    String stdin = '',
    int timeoutMs = 5000,
    int memoryLimitMb = 128,
  }) async {
    try {
      final result = await _remoteDataSource.runCode(
        language: language,
        code: code,
        stdin: stdin,
        timeoutMs: timeoutMs,
        memoryLimitMb: memoryLimitMb,
      );
      return ApiResponse.success(result);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<ApiResponse<CodeSubmitResultModel>> submitCode({
    required String questionId,
    required String code,
    required String language,
  }) async {
    try {
      final result = await _remoteDataSource.submitCode(
        questionId: questionId,
        code: code,
        language: language,
      );
      return ApiResponse.success(result);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }
}
