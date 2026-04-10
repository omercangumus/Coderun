import '../../core/network/api_exception.dart';
import '../datasources/module_remote_datasource.dart';
import '../models/api_response_model.dart';
import '../models/lesson_model.dart';
import '../models/module_model.dart';
import '../models/module_progress_model.dart';

abstract class ModuleRepository {
  Future<ApiResponse<List<ModuleModel>>> getAllModules();
  Future<ApiResponse<ModuleModel>> getModuleBySlug(String slug);
  Future<ApiResponse<ModuleProgressModel>> getModuleProgress(String slug);
  Future<ApiResponse<List<LessonModel>>> getLessonsByModule(String moduleId);
  Future<ApiResponse<LessonModel>> getLessonDetail(String lessonId);
}

class ModuleRepositoryImpl implements ModuleRepository {
  final ModuleRemoteDataSource _remoteDataSource;

  const ModuleRepositoryImpl({required ModuleRemoteDataSource remoteDataSource})
      : _remoteDataSource = remoteDataSource;

  @override
  Future<ApiResponse<List<ModuleModel>>> getAllModules() async {
    try {
      final data = await _remoteDataSource.getAllModules();
      return ApiResponse.success(data);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<ApiResponse<ModuleModel>> getModuleBySlug(String slug) async {
    try {
      final data = await _remoteDataSource.getModuleBySlug(slug);
      return ApiResponse.success(data);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<ApiResponse<ModuleProgressModel>> getModuleProgress(String slug) async {
    try {
      final data = await _remoteDataSource.getModuleProgress(slug);
      return ApiResponse.success(data);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<ApiResponse<List<LessonModel>>> getLessonsByModule(String moduleId) async {
    try {
      final data = await _remoteDataSource.getLessonsByModule(moduleId);
      return ApiResponse.success(data);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<ApiResponse<LessonModel>> getLessonDetail(String lessonId) async {
    try {
      final data = await _remoteDataSource.getLessonDetail(lessonId);
      return ApiResponse.success(data);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }
}
