// LessonState unit testleri — copyWith ve immutability doğrulaması.
import 'package:flutter_test/flutter_test.dart';
import 'package:coderun_mobile/providers/lesson_provider.dart';

void main() {
  group('LessonState', () {
    test('başlangıç değerleri doğru olmalı', () {
      const state = LessonState();
      expect(state.currentQuestionIndex, equals(0));
      expect(state.answers, isEmpty);
      expect(state.isSubmitting, isFalse);
      expect(state.result, isNull);
      expect(state.errorMessage, isNull);
    });

    test('copyWith currentQuestionIndex güncellenmeli', () {
      const state = LessonState();
      final updated = state.copyWith(currentQuestionIndex: 3);
      expect(updated.currentQuestionIndex, equals(3));
      expect(updated.answers, isEmpty); // diğer alanlar değişmemeli
    });

    test('copyWith answers güncellenmeli', () {
      const state = LessonState();
      final updated = state.copyWith(answers: {'q1': 'cevap'});
      expect(updated.answers['q1'], equals('cevap'));
    });

    test('copyWith clearError çalışmalı', () {
      const state = LessonState(errorMessage: 'hata');
      final updated = state.copyWith(clearError: true);
      expect(updated.errorMessage, isNull);
    });

    test('copyWith clearResult çalışmalı', () {
      const state = LessonState();
      final updated = state.copyWith(clearResult: true);
      expect(updated.result, isNull);
    });

    test('isSubmitting güncellenebilmeli', () {
      const state = LessonState();
      final updated = state.copyWith(isSubmitting: true);
      expect(updated.isSubmitting, isTrue);
    });
  });

  group('LessonState immutability', () {
    test('orijinal state değişmemeli', () {
      const state = LessonState(currentQuestionIndex: 0);
      state.copyWith(currentQuestionIndex: 5);
      expect(state.currentQuestionIndex, equals(0));
    });
  });
}
