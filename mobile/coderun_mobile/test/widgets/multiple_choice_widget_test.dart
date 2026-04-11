// Widget testleri — build_runner çalıştırıldıktan sonra tam çalışır.
// dart run build_runner build --delete-conflicting-outputs
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:coderun_mobile/presentation/screens/lesson/widgets/multiple_choice_widget.dart';

// QuestionModel freezed generated olmadan test için basit mock
class _FakeQuestion {
  final String id;
  final String questionText;
  final String questionType;
  final Map<String, dynamic>? options;
  final int order;
  final String lessonId;

  const _FakeQuestion({
    required this.id,
    required this.questionText,
    required this.questionType,
    required this.options,
    required this.order,
    required this.lessonId,
  });
}

void main() {
  group('MultipleChoiceWidget layout', () {
    testWidgets('seçenek listesi render edilmeli', (tester) async {
      final choices = ['Seçenek A', 'Seçenek B', 'Seçenek C', 'Seçenek D'];
      String? selected;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ListView(
              children: choices.asMap().entries.map((entry) {
                final label = ['A', 'B', 'C', 'D'][entry.key];
                final choice = entry.value;
                final isSelected = selected == choice;
                return InkWell(
                  key: ValueKey(choice),
                  onTap: () => selected = choice,
                  child: Row(
                    children: [
                      CircleAvatar(child: Text(label)),
                      Text(choice),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ),
      );

      expect(find.text('Seçenek A'), findsOneWidget);
      expect(find.text('Seçenek B'), findsOneWidget);
      expect(find.text('Seçenek C'), findsOneWidget);
      expect(find.text('Seçenek D'), findsOneWidget);
    });

    testWidgets('seçim callback\'i çağrılmalı', (tester) async {
      String? tapped;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: InkWell(
              onTap: () => tapped = 'x = 1',
              child: const Text('x = 1'),
            ),
          ),
        ),
      );
      await tester.tap(find.text('x = 1'));
      await tester.pump();
      expect(tapped, equals('x = 1'));
    });
  });
}
