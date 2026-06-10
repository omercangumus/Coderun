import 'package:dio/dio.dart';
import '../models/answer_model.dart';
import '../models/placement_model.dart';
import '../../core/network/api_exception.dart';
import '../../core/constants/api_constants.dart';

abstract class PlacementRemoteDataSource {
  Future<PlacementTestModel> getPlacementQuestions(String moduleSlug);
  Future<PlacementResultModel> submitPlacementTest(
    String moduleSlug,
    List<AnswerSubmitModel> answers,
  );
}

class PlacementRemoteDataSourceImpl implements PlacementRemoteDataSource {
  final Dio _dio;

  const PlacementRemoteDataSourceImpl({required Dio dio}) : _dio = dio;

  @override
  Future<PlacementTestModel> getPlacementQuestions(String moduleSlug) async {
    try {
      final response = await _dio.get(
        ApiConstants.getPlacementQuestions(moduleSlug),
      );
      return PlacementTestModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<PlacementResultModel> submitPlacementTest(
    String moduleSlug,
    List<AnswerSubmitModel> answers,
  ) async {
    try {
      final response = await _dio.post(
        ApiConstants.submitPlacement(moduleSlug),
        data: answers.map((a) => a.toJson()).toList(),
      );
      return PlacementResultModel.fromJson(
          response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }
}
