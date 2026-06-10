// MultipleChoiceWidget layout ve etkileşim testleri.
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:coderun_mobile/data/models/question_model.dart';
import 'package:coderun_mobile/presentation/screens/lesson/widgets/multiple_choice_widget.dart';

void main() {
  const question = QuestionModel(
    id: 'q1',
    lessonId: 'l1',
    questionType: 'multiple_choice',
    questionText: 'Python\'da değişken nasıl tanımlanır?',
    options: {
      'choices': ['var x = 1', 'x = 1', 'int x = 1', 'let x = 1'],
    },
    order: 1,
  );

  Widget buildWidget({
    String? selectedAnswer,
    void Function(String)? onTap,
  }) {
    return MaterialApp(
      home: Scaffold(
        body: MultipleChoiceWidget(
          question: question,
          selectedAnswer: selectedAnswer,
          onAnswerSelected: onTap ?? (_) {},
        ),
      ),
    );
  }

  group('MultipleChoiceWidget', () {
    testWidgets('4 seçenek görünmeli', (tester) async {
      await tester.pumpWidget(buildWidget());
      expect(find.text('var x = 1'), findsOneWidget);
      expect(find.text('x = 1'), findsOneWidget);
      expect(find.text('int x = 1'), findsOneWidget);
      expect(find.text('let x = 1'), findsOneWidget);
    });

    testWidgets('soru metni görünmeli', (tester) async {
      await tester.pumpWidget(buildWidget());
      expect(
        find.text('Python\'da değişken nasıl tanımlanır?'),
        findsOneWidget,
      );
    });

    testWidgets('seçim yapılınca callback çağrılmalı', (tester) async {
      String? selected;
      await tester.pumpWidget(
        buildWidget(onTap: (v) => selected = v),
      );
      await tester.tap(find.text('x = 1'));
      await tester.pump();
      expect(selected, equals('x = 1'));
    });

    testWidgets('seçili seçenek widget ağacında bulunmalı', (tester) async {
      await tester.pumpWidget(buildWidget(selectedAnswer: 'x = 1'));
      await tester.pump();
      expect(find.text('x = 1'), findsOneWidget);
    });

    testWidgets('A/B/C/D etiketleri görünmeli', (tester) async {
      await tester.pumpWidget(buildWidget());
      expect(find.text('A'), findsOneWidget);
      expect(find.text('B'), findsOneWidget);
      expect(find.text('C'), findsOneWidget);
      expect(find.text('D'), findsOneWidget);
    });
  });
}
