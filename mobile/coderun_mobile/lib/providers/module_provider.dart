import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/network/api_exception.dart';
import '../data/models/lesson_model.dart';
import '../data/models/module_model.dart';
import '../data/models/module_progress_model.dart';
import 'providers.dart';

/// Tüm modüller.
final modulesProvider = FutureProvider<List<ModuleModel>>((ref) async {
  final repository = ref.watch(moduleRepositoryProvider);
  final response = await repository.getAllModules();
  return response.when(
    success: (data) => data,
    error: (message, _) => throw ApiException(message: message),
    loading: () => [],
  );
});

/// Seçili modül slug'ı.
final selectedModuleSlugProvider = StateProvider<String?>((ref) => null);

/// Modül ilerlemesi (slug ile).
final moduleProgressProvider =
    FutureProvider.family<ModuleProgressModel, String>((ref, slug) async {
  final repository = ref.watch(moduleRepositoryProvider);
  final response = await repository.getModuleProgress(slug);
  return response.when(
    success: (data) => data,
    error: (message, _) => throw ApiException(message: message),
    loading: () => throw const ApiException(message: 'Yükleniyor'),
  );
});

/// Modüle ait dersler (moduleId ile).
final lessonsProvider =
    FutureProvider.family<List<LessonModel>, String>((ref, moduleId) async {
  final repository = ref.watch(moduleRepositoryProvider);
  final response = await repository.getLessonsByModule(moduleId);
  return response.when(
    success: (data) => data,
    error: (message, _) => throw ApiException(message: message),
    loading: () => [],
  );
});
