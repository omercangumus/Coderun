import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:coderun_mobile/data/models/question_model.dart';
import 'package:coderun_mobile/presentation/screens/lesson/widgets/code_assignment_widget.dart';

QuestionModel _codeEditorQuestion() {
  return QuestionModel(
    id: 'q-code-1',
    lessonId: 'lesson-1',
    questionType: 'code_editor',
    questionText: 'Hello Coderun yazdırın.',
    order: 0,
    assignmentInstructions: 'print ile merhaba yazın.',
    starterCode: 'print("Hello")\n',
    language: 'python',
    maxRuntimeMs: 5000,
    memoryLimitMb: 128,
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('CodeAssignmentWidget — kod lab sekmeleri', () {
    testWidgets('Soru, Kod, Çıktı ve Mentor sekmeleri görünür', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: CodeAssignmentWidget(
                question: _codeEditorQuestion(),
                currentAnswer: null,
                onAnswerChanged: (_) {},
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Soru'), findsOneWidget);
      expect(find.text('Kod'), findsOneWidget);
      expect(find.text('Çıktı'), findsOneWidget);
      expect(find.text('Mentor'), findsOneWidget);
    });

    testWidgets('Sekme geçişleri hata fırlatmaz', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: CodeAssignmentWidget(
                question: _codeEditorQuestion(),
                currentAnswer: null,
                onAnswerChanged: (_) {},
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.text('Kod'));
      await tester.pumpAndSettle();
      expect(find.text('Çalıştır'), findsOneWidget);

      await tester.tap(find.text('Çıktı'));
      await tester.pumpAndSettle();
      expect(find.textContaining('Henüz çıktı yok'), findsOneWidget);

      await tester.tap(find.text('Mentor'));
      await tester.pumpAndSettle();
      expect(find.textContaining('Kodunu yaz'), findsWidgets);

      await tester.tap(find.text('Soru'));
      await tester.pumpAndSettle();
      expect(find.textContaining('Hello Coderun'), findsOneWidget);
    });

    testWidgets('Kod sekmesinde düzenleyici ve Çalıştır düğmesi var', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: SizedBox(
                height: 600,
                child: CodeAssignmentWidget(
                  question: _codeEditorQuestion(),
                  currentAnswer: null,
                  onAnswerChanged: (_) {},
                ),
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.text('Kod'));
      await tester.pumpAndSettle();

      expect(find.byType(TextField), findsOneWidget);
      expect(find.text('Çalıştır'), findsOneWidget);
      expect(find.text('Gönder'), findsOneWidget);
    });
  });
}
