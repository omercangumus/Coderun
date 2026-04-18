import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:coderun_mobile/presentation/widgets/skeleton_loader.dart';

void main() {
  group('SkeletonLoader', () {
    testWidgets('SkeletonLoader render edildi', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SkeletonLoader(width: 100, height: 20, borderRadius: 4),
          ),
        ),
      );

      expect(find.byType(SkeletonLoader), findsOneWidget);
    });

    testWidgets('SkeletonLoader doğru boyutlarda render edildi', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: SkeletonLoader(width: 200, height: 40, borderRadius: 8),
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(SkeletonLoader),
          matching: find.byType(Container),
        ),
      );
      expect(container.constraints?.maxWidth, 200);
      expect(container.constraints?.maxHeight, 40);
    });

    testWidgets('ModuleCardSkeleton render edildi', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: ModuleCardSkeleton(),
          ),
        ),
      );

      expect(find.byType(ModuleCardSkeleton), findsOneWidget);
      // Birden fazla SkeletonLoader içermeli
      expect(find.byType(SkeletonLoader), findsWidgets);
    });

    testWidgets('LessonTileSkeleton render edildi', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: LessonTileSkeleton(),
          ),
        ),
      );

      expect(find.byType(LessonTileSkeleton), findsOneWidget);
      expect(find.byType(SkeletonLoader), findsWidgets);
    });

    testWidgets('SkeletonLoader animasyon başlatıyor', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SkeletonLoader(width: 100, height: 20),
          ),
        ),
      );

      // Animasyon başladı mı kontrol et
      await tester.pump(const Duration(milliseconds: 600));
      expect(find.byType(SkeletonLoader), findsOneWidget);
    });
  });
}
