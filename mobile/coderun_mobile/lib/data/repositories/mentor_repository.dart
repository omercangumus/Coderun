// AI Mentor repository.

import '../../core/network/api_exception.dart';
import '../datasources/mentor_remote_datasource.dart';
import '../models/api_response_model.dart';
import '../models/mentor_model.dart';

abstract class MentorRepository {
  Future<ApiResponse<MentorResponseModel>> sendMessage(
    MentorRequestModel request,
  );

  Future<ApiResponse<MentorAskResponseModel>> askMentor(
    MentorAskRequestModel request,
  );
}

class MentorRepositoryImpl implements MentorRepository {
  final MentorRemoteDataSource _dataSource;

  const MentorRepositoryImpl({
    required MentorRemoteDataSource remoteDataSource,
  }) : _dataSource = remoteDataSource;

  @override
  Future<ApiResponse<MentorResponseModel>> sendMessage(
    MentorRequestModel request,
  ) async {
    try {
      final response = await _dataSource.sendMessage(request);
      return ApiResponse.success(response);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<ApiResponse<MentorAskResponseModel>> askMentor(
    MentorAskRequestModel request,
  ) async {
    try {
      final response = await _dataSource.askMentor(request);
      return ApiResponse.success(response);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }
}
