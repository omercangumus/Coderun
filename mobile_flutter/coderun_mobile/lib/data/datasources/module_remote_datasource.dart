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
      final data = response.data;
      if (data is! List) throw const ApiException(message: 'Geçersiz yanıt formatı');
      return data
          .whereType<Map<String, dynamic>>()
          .map(ModuleModel.fromJson)
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<ModuleModel> getModuleBySlug(String slug) async {
    try {
      final response = await _dio.get(ApiConstants.getModuleBySlug(slug));
      final data = response.data;
      if (data is! Map<String, dynamic>) {
        throw const ApiException(message: 'Geçersiz yanıt formatı');
      }
      return ModuleModel.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<ModuleProgressModel> getModuleProgress(String slug) async {
    try {
      final response = await _dio.get(ApiConstants.getModuleProgress(slug));
      final data = response.data;
      if (data is! Map<String, dynamic>) {
        throw const ApiException(message: 'Geçersiz yanıt formatı');
      }
      return ModuleProgressModel.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<List<LessonModel>> getLessonsByModule(String moduleId) async {
    try {
      final response =
          await _dio.get(ApiConstants.getLessonsByModule(moduleId));
      final data = response.data;
      if (data is! List) throw const ApiException(message: 'Geçersiz yanıt formatı');
      return data
          .whereType<Map<String, dynamic>>()
          .map(LessonModel.fromJson)
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
      final data = response.data;
      if (data is! Map<String, dynamic>) {
        throw const ApiException(message: 'Geçersiz yanıt formatı');
      }
      return LessonDetailModel.fromJson(data);
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
      final data = response.data;
      if (data is! Map<String, dynamic>) {
        throw const ApiException(message: 'Geçersiz yanıt formatı');
      }
      return LessonResultModel.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }
}
