import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../core/network/api_exception.dart';
import '../models/answer_model.dart';
import '../models/lesson_detail_model.dart';
import '../models/lesson_model.dart';
import '../models/lesson_result_model.dart';
import '../models/module_model.dart';
import '../models/module_progress_model.dart';

abstract class ModuleRemoteDataSource {
  Future<List<ModuleModel>> getAllModules();
  Future<ModuleModel> getModuleBySlug(String slug);
  Future<ModuleProgressModel> getModuleProgress(String slug);
  Future<List<LessonModel>> getLessonsByModule(String moduleId);
  Future<LessonDetailModel> getLessonDetail(String lessonId);
  Future<LessonResultModel> submitLesson(
    String lessonId,
    List<AnswerSubmitModel> answers,
  );
}

class ModuleRemoteDataSourceImpl implements ModuleRemoteDataSource {
  final Dio _dio;

  const ModuleRemoteDataSourceImpl({required Dio dio}) : _dio = dio;

  @override
  Future<List<ModuleModel>> getAllModules() async {
    try {
      final response = await _dio.get(ApiConstants.modules);
      return (response.data as List)
          .map((json) => ModuleModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<ModuleModel> getModuleBySlug(String slug) async {
    try {
      final response = await _dio.get(ApiConstants.getModuleBySlug(slug));
      return ModuleModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<ModuleProgressModel> getModuleProgress(String slug) async {
    try {
      final response = await _dio.get(ApiConstants.getModuleProgress(slug));
      return ModuleProgressModel.fromJson(
          response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<List<LessonModel>> getLessonsByModule(String moduleId) async {
    try {
      final response =
          await _dio.get(ApiConstants.getLessonsByModule(moduleId));
      return (response.data as List)
          .map((json) => LessonModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<LessonDetailModel> getLessonDetail(String lessonId) async {
    try {
      final response =
          await _dio.get(ApiConstants.getLessonDetail(lessonId));
      return LessonDetailModel.fromJson(
          response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<LessonResultModel> submitLesson(
    String lessonId,
    List<AnswerSubmitModel> answers,
  ) async {
    try {
      final response = await _dio.post(
        ApiConstants.submitLesson(lessonId),
        data: answers.map((a) => a.toJson()).toList(),
      );
      return LessonResultModel.fromJson(
          response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }
}
