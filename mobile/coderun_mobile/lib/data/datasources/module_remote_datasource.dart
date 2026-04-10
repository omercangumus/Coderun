import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../core/network/api_exception.dart';
import '../models/lesson_model.dart';
import '../models/module_model.dart';
import '../models/module_progress_model.dart';

abstract class ModuleRemoteDataSource {
  Future<List<ModuleModel>> getAllModules();
  Future<ModuleModel> getModuleBySlug(String slug);
  Future<ModuleProgressModel> getModuleProgress(String slug);
  Future<List<LessonModel>> getLessonsByModule(String moduleId);
  Future<LessonModel> getLessonDetail(String lessonId);
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
      return ModuleProgressModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<List<LessonModel>> getLessonsByModule(String moduleId) async {
    try {
      final response = await _dio.get(ApiConstants.getLessonsByModule(moduleId));
      return (response.data as List)
          .map((json) => LessonModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<LessonModel> getLessonDetail(String lessonId) async {
    try {
      final response = await _dio.get(ApiConstants.getLessonDetail(lessonId));
      return LessonModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }
}
