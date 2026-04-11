import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:coderun_mobile/data/models/lesson_model.dart';
import 'package:coderun_mobile/data/models/module_model.dart';
import 'package:coderun_mobile/presentation/widgets/lesson_tile.dart';
import 'package:coderun_mobile/presentation/widgets/module_card.dart';

const _module = ModuleModel(
  id: '1',
  title: 'Python Temelleri',
  slug: 'python-basics',
  description: 'Python öğrenmeye başla',
  order: 1,
  isActive: true,
);

void main() {
  group('ModuleCard', () {
    testWidgets('test_module_card_renders', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ModuleCard(module: _module, onTap: () {}),
        ),
      ));
      expect(find.byType(ModuleCard), findsOneWidget);
    });

    testWidgets('test_module_card_shows_title', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ModuleCard(module: _module, onTap: () {}),
        ),
      ));
      expect(find.text('Python Temelleri'), findsOneWidget);
    });

    testWidgets('test_module_card_tap', (tester) async {
      var tapped = false;
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ModuleCard(module: _module, onTap: () => tapped = true),
        ),
      ));
      await tester.tap(find.byType(InkWell));
      expect(tapped, true);
    });

    testWidgets('test_module_card_with_progress', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ModuleCard(
            module: _module,
            completionRate: 0.5,
            onTap: () {},
          ),
        ),
      ));
      expect(find.byType(LinearProgressIndicator), findsOneWidget);
      expect(find.text('%50'), findsOneWidget);
    });
  });

  group('LessonTile', () {
    testWidgets('test_lesson_tile_locked', (tester) async {
      var tapped = false;
      const lesson = LessonModel(
        id: '1',
        moduleId: '1',
        title: 'Kilitli Ders',
        lessonType: 'quiz',
        order: 1,
        xpReward: 10,
        isActive: true,
        isLocked: true,
      );
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: LessonTile(lesson: lesson, onTap: () => tapped = true),
        ),
      ));
      await tester.tap(find.byType(ListTile));
      expect(tapped, false);
    });

    testWidgets('test_lesson_tile_completed', (tester) async {
      const lesson = LessonModel(
        id: '2',
        moduleId: '1',
        title: 'Tamamlanan Ders',
        lessonType: 'quiz',
        order: 2,
        xpReward: 20,
        isActive: true,
        isCompleted: true,
      );
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: LessonTile(lesson: lesson),
        ),
      ));
      expect(find.byIcon(Icons.check_circle), findsOneWidget);
    });
  });
}
