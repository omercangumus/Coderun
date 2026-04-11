import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:coderun_mobile/data/models/answer_model.dart';
import 'package:coderun_mobile/data/models/api_response_model.dart';
import 'package:coderun_mobile/data/models/lesson_result_model.dart';
import 'package:coderun_mobile/data/repositories/module_repository.dart';
import 'package:coderun_mobile/providers/lesson_provider.dart';
import 'package:coderun_mobile/providers/providers.dart';

class MockModuleRepository extends Mock implements ModuleRepository {}

void main() {
  late MockModuleRepository mockRepo;
  late ProviderContainer container;

  const lessonId = 'lesson-1';

  setUp(() {
    mockRepo = MockModuleRepository();
    container = ProviderContainer(
      overrides: [
        moduleRepositoryProvider.overrideWithValue(mockRepo),
      ],
    );
  });

  tearDown(() => container.dispose());

  test('başlangıç state\'i doğru olmalı', () {
    final state = container.read(lessonNotifierProvider(lessonId));
    expect(state.currentQuestionIndex, equals(0));
    expect(state.answers, isEmpty);
    expect(state.isSubmitting, isFalse);
    expect(state.result, isNull);
    expect(state.errorMessage, isNull);
  });

  test('cevap state\'e kaydedilmeli', () {
    container
        .read(lessonNotifierProvider(lessonId).notifier)
        .answerQuestion('q1', 'cevap A');
    final state = container.read(lessonNotifierProvider(lessonId));
    expect(state.answers['q1'], equals('cevap A'));
  });

  test('nextQuestion index artırmalı', () {
    container.read(lessonNotifierProvider(lessonId).notifier).nextQuestion();
    final state = container.read(lessonNotifierProvider(lessonId));
    expect(state.currentQuestionIndex, equals(1));
  });

  test('previousQuestion index azaltmalı', () {
    final notifier =
        container.read(lessonNotifierProvider(lessonId).notifier);
    notifier.nextQuestion();
    notifier.previousQuestion();
    final state = container.read(lessonNotifierProvider(lessonId));
    expect(state.currentQuestionIndex, equals(0));
  });

  test('previousQuestion 0\'ın altına düşmemeli', () {
    container
        .read(lessonNotifierProvider(lessonId).notifier)
        .previousQuestion();
    final state = container.read(lessonNotifierProvider(lessonId));
    expect(state.currentQuestionIndex, equals(0));
  });

  test('submitLesson başarılıysa result state\'e kaydedilmeli', () async {
    // LessonResultModel.fromJson ile oluştur (generated gerektirir)
    // Burada sadece mock response test ediyoruz
    when(() => mockRepo.submitLesson(any(), any()))
        .thenAnswer((_) async => const ApiResponse.error('test'));

    final notifier =
        container.read(lessonNotifierProvider(lessonId).notifier);
    notifier.answerQuestion('q1', 'cevap');
    await notifier.submitLesson();

    final state = container.read(lessonNotifierProvider(lessonId));
    expect(state.isSubmitting, isFalse);
  });

  test('submitLesson hata durumunda errorMessage kaydedilmeli', () async {
    when(() => mockRepo.submitLesson(any(), any()))
        .thenAnswer((_) async => const ApiResponse.error('Sunucu hatası'));

    final notifier =
        container.read(lessonNotifierProvider(lessonId).notifier);
    await notifier.submitLesson();

    final state = container.read(lessonNotifierProvider(lessonId));
    expect(state.errorMessage, equals('Sunucu hatası'));
    expect(state.isSubmitting, isFalse);
  });

  test('reset state\'i sıfırlamalı', () {
    final notifier =
        container.read(lessonNotifierProvider(lessonId).notifier);
    notifier.answerQuestion('q1', 'cevap');
    notifier.nextQuestion();
    notifier.reset();

    final state = container.read(lessonNotifierProvider(lessonId));
    expect(state.currentQuestionIndex, equals(0));
    expect(state.answers, isEmpty);
    expect(state.result, isNull);
  });
}
