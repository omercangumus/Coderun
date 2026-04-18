import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:coderun_mobile/data/models/badge_model.dart';
import 'package:coderun_mobile/presentation/screens/badges/widgets/badge_card.dart';

void main() {
  group('BadgeCard', () {
    final earnedBadge = BadgeModel(
      id: '1',
      badgeType: 'first_lesson',
      earnedAt: '2024-01-15T10:00:00',
      title: 'İlk Ders',
      description: 'İlk dersini tamamladın!',
    );

    testWidgets('kazanılmış rozet altın border gösteriyor', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BadgeCard(
              badge: earnedBadge,
              badgeType: 'first_lesson',
              isEarned: true,
            ),
          ),
        ),
      );

      // Altın border için amber renk içeren Container bul
      final containers = tester.widgetList<Container>(find.byType(Container));
      final hasAmberBorder = containers.any((c) {
        final decoration = c.decoration;
        if (decoration is BoxDecoration) {
          final border = decoration.border;
          if (border is Border) {
            return border.top.color == Colors.amber;
          }
        }
        return false;
      });
      expect(hasAmberBorder, isTrue);
    });

    testWidgets('kazanılmamış rozet kilit ikonu gösteriyor', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BadgeCard(
              badge: null,
              badgeType: 'first_lesson',
              isEarned: false,
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.lock), findsOneWidget);
    });

    testWidgets('first_lesson rozeti doğru emoji gösteriyor', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BadgeCard(
              badge: earnedBadge,
              badgeType: 'first_lesson',
              isEarned: true,
            ),
          ),
        ),
      );

      expect(find.text('🎯'), findsOneWidget);
    });

    testWidgets('streak_7 rozeti ateş emojisi gösteriyor', (tester) async {
      final badge = BadgeModel(
        id: '2',
        badgeType: 'streak_7',
        earnedAt: '2024-01-20T10:00:00',
        title: '7 Günlük Seri',
        description: '7 gün üst üste çalıştın!',
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BadgeCard(
              badge: badge,
              badgeType: 'streak_7',
              isEarned: true,
            ),
          ),
        ),
      );

      expect(find.text('🔥'), findsOneWidget);
    });

    testWidgets('kazanılmamış rozet opacity 0.4 ile gösteriliyor',
        (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BadgeCard(
              badge: null,
              badgeType: 'module_complete',
              isEarned: false,
            ),
          ),
        ),
      );

      final opacity = tester.widget<Opacity>(find.byType(Opacity));
      expect(opacity.opacity, 0.4);
    });
  });
}
