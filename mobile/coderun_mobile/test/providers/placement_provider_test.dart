import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:coderun_mobile/data/datasources/placement_remote_datasource.dart';
import 'package:coderun_mobile/data/models/placement_model.dart';
import 'package:coderun_mobile/data/models/question_model.dart';
import 'package:coderun_mobile/providers/placement_provider.dart';

class MockPlacementDataSource extends Mock
    implements PlacementRemoteDataSource {}

void main() {
  late MockPlacementDataSource mockDataSource;
  late PlacementNotifier notifier;

  setUp(() {
    mockDataSource = MockPlacementDataSource();
    notifier = PlacementNotifier(mockDataSource, 'python-basics');
  });

  group('PlacementNotifier', () {
    test('başlangıç state doğru', () {
      expect(notifier.state.currentQuestionIndex, 0);
      expect(notifier.state.answers, isEmpty);
      expect(notifier.state.isSubmitting, false);
      expect(notifier.state.result, isNull);
      expect(notifier.state.errorMessage, isNull);
    });

    test('answerQuestion cevabı kaydeder', () {
      notifier.answerQuestion('q1', 'A');
      expect(notifier.state.answers['q1'], 'A');
    });

    test('answerQuestion birden fazla cevap kaydeder', () {
      notifier.answerQuestion('q1', 'A');
      notifier.answerQuestion('q2', 'B');
      expect(notifier.state.answers['q1'], 'A');
      expect(notifier.state.answers['q2'], 'B');
    });

    test('answerQuestion mevcut cevabı günceller', () {
      notifier.answerQuestion('q1', 'A');
      notifier.answerQuestion('q1', 'C');
      expect(notifier.state.answers['q1'], 'C');
    });

    test('skipQuestion boş string kaydeder', () {
      notifier.skipQuestion('q1');
      expect(notifier.state.answers['q1'], '');
    });

    test('nextQuestion index artırır', () {
      notifier.nextQuestion();
      expect(notifier.state.currentQuestionIndex, 1);
    });

    test('previousQuestion index azaltır', () {
      notifier.nextQuestion();
      notifier.nextQuestion();
      notifier.previousQuestion();
      expect(notifier.state.currentQuestionIndex, 1);
    });

    test('previousQuestion 0\'dan aşağı inmez', () {
      notifier.previousQuestion();
      expect(notifier.state.currentQuestionIndex, 0);
    });

    test('reset state sıfırlar', () {
      notifier.answerQuestion('q1', 'A');
      notifier.nextQuestion();
      notifier.reset();

      expect(notifier.state.currentQuestionIndex, 0);
      expect(notifier.state.answers, isEmpty);
      expect(notifier.state.isSubmitting, false);
      expect(notifier.state.result, isNull);
      expect(notifier.state.errorMessage, isNull);
    });

    test('submitTest başarılı sonuç döndürür', () async {
      final mockResult = PlacementResultModel(
        correctCount: 10,
        totalCount: 15,
        percentage: 66.7,
        startingLessonOrder: 5,
        skippedLessons: 4,
        message: 'Harika! 4 ders atlandı.',
      );

      final mockQuestion = QuestionModel(
        id: 'q1',
        lessonId: 'l1',
        questionType: 'multiple_choice',
        questionText: 'Test sorusu?',
        order: 1,
      );

      when(() => mockDataSource.submitPlacementTest(
            'python-basics',
            any(),
          )).thenAnswer((_) async => mockResult);

      notifier.answerQuestion('q1', 'A');
      await notifier.submitTest('python-basics', [mockQuestion]);

      expect(notifier.state.result, mockResult);
      expect(notifier.state.isSubmitting, false);
      expect(notifier.state.errorMessage, isNull);
    });

    test('submitTest hata durumunda errorMessage set eder', () async {
      when(() => mockDataSource.submitPlacementTest(any(), any()))
          .thenThrow(Exception('Sunucu hatası'));

      await notifier.submitTest('python-basics', []);

      expect(notifier.state.errorMessage, isNotNull);
      expect(notifier.state.isSubmitting, false);
    });
  });
}
