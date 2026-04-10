import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:coderun_mobile/data/models/api_response_model.dart';
import 'package:coderun_mobile/data/models/module_model.dart';
import 'package:coderun_mobile/data/models/module_progress_model.dart';
import 'package:coderun_mobile/data/models/lesson_model.dart';
import 'package:coderun_mobile/data/repositories/module_repository.dart';
import 'package:coderun_mobile/providers/module_provider.dart';
import 'package:coderun_mobile/providers/providers.dart';

class MockModuleRepository extends Mock implements ModuleRepository {}

final _testModule = const ModuleModel(
  id: '1',
  title: 'Python',
  slug: 'python',
  description: 'Python öğren',
  order: 1,
  isActive: true,
);

void main() {
  late MockModuleRepository mockRepo;

  setUp(() {
    mockRepo = MockModuleRepository();
  });

  ProviderContainer makeContainer() {
    return ProviderContainer(
      overrides: [
        moduleRepositoryProvider.overrideWithValue(mockRepo),
      ],
    );
  }

  test('test_modules_loading', () {
    when(() => mockRepo.getAllModules()).thenAnswer(
      (_) async => ApiResponse.success([_testModule]),
    );
    final container = makeContainer();
    final state = container.read(modulesProvider);
    expect(state, isA<AsyncLoading>());
    container.dispose();
  });

  test('test_modules_success', () async {
    when(() => mockRepo.getAllModules()).thenAnswer(
      (_) async => ApiResponse.success([_testModule]),
    );
    final container = makeContainer();
    await container.read(modulesProvider.future);
    final state = container.read(modulesProvider);
    expect(state.value, isNotNull);
    expect(state.value!.length, 1);
    expect(state.value!.first.title, 'Python');
    container.dispose();
  });

  test('test_modules_error', () async {
    when(() => mockRepo.getAllModules()).thenAnswer(
      (_) async => const ApiResponse.error('Sunucu hatası'),
    );
    final container = makeContainer();
    await expectLater(
      container.read(modulesProvider.future),
      throwsA(isA<Exception>()),
    );
    container.dispose();
  });

  test('test_module_progress_family', () async {
    final progress = ModuleProgressModel(
      module: _testModule,
      completionRate: 50.0,
      completedLessons: 2,
      totalLessons: 4,
    );
    when(() => mockRepo.getModuleProgress('python')).thenAnswer(
      (_) async => ApiResponse.success(progress),
    );
    final container = makeContainer();
    final result = await container.read(moduleProgressProvider('python').future);
    expect(result.completionRate, 50.0);
    container.dispose();
  });

  test('test_lessons_family', () async {
    const lesson = LessonModel(
      id: '1',
      moduleId: '1',
      title: 'Değişkenler',
      lessonType: 'quiz',
      order: 1,
      xpReward: 20,
      isActive: true,
    );
    when(() => mockRepo.getLessonsByModule('1')).thenAnswer(
      (_) async => ApiResponse.success([lesson]),
    );
    final container = makeContainer();
    final result = await container.read(lessonsProvider('1').future);
    expect(result.length, 1);
    expect(result.first.title, 'Değişkenler');
    container.dispose();
  });
}
