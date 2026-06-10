import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:coderun_mobile/data/models/leaderboard_model.dart';
import 'package:coderun_mobile/presentation/widgets/leaderboard_card.dart';

void main() {
  final testEntry = LeaderboardEntryModel(
    rank: 4,
    userId: 'user-1',
    username: 'testuser',
    weeklyXp: 350,
    level: 5,
    streak: 7,
  );

  group('LeaderboardCard', () {
    testWidgets('giriş yapan kullanıcı vurgulanmış', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LeaderboardCard(
              entry: testEntry,
              isCurrentUser: true,
            ),
          ),
        ),
      );

      // Vurgulu container bul
      final containers = tester.widgetList<Container>(find.byType(Container));
      final hasHighlight = containers.any((c) {
        final decoration = c.decoration;
        if (decoration is BoxDecoration) {
          return decoration.color != null &&
              decoration.color != Colors.white;
        }
        return false;
      });
      expect(hasHighlight, isTrue);
    });

    testWidgets('diğer kullanıcı normal görünüm', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LeaderboardCard(
              entry: testEntry,
              isCurrentUser: false,
            ),
          ),
        ),
      );

      expect(find.byType(LeaderboardCard), findsOneWidget);
      expect(find.text('testuser'), findsOneWidget);
    });

    testWidgets('kullanıcı adı gösteriliyor', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LeaderboardCard(
              entry: testEntry,
              isCurrentUser: false,
            ),
          ),
        ),
      );

      expect(find.text('testuser'), findsOneWidget);
    });

    testWidgets('haftalık XP gösteriliyor', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LeaderboardCard(
              entry: testEntry,
              isCurrentUser: false,
            ),
          ),
        ),
      );

      expect(find.text('350 XP'), findsOneWidget);
    });

    testWidgets('sıra numarası gösteriliyor', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LeaderboardCard(
              entry: testEntry,
              isCurrentUser: false,
            ),
          ),
        ),
      );

      expect(find.text('#4'), findsOneWidget);
    });

    testWidgets('streak gösteriliyor', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LeaderboardCard(
              entry: testEntry,
              isCurrentUser: false,
            ),
          ),
        ),
      );

      expect(find.text('🔥 7'), findsOneWidget);
    });

    testWidgets('avatar baş harf gösteriyor', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LeaderboardCard(
              entry: testEntry,
              isCurrentUser: false,
            ),
          ),
        ),
      );

      expect(find.text('T'), findsOneWidget);
    });

    testWidgets('mevcut kullanıcı bold yazı tipi kullanıyor', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LeaderboardCard(
              entry: testEntry,
              isCurrentUser: true,
            ),
          ),
        ),
      );

      final textWidgets = tester.widgetList<Text>(
        find.text('testuser'),
      );
      final hasBold = textWidgets.any((t) =>
          t.style?.fontWeight == FontWeight.bold);
      expect(hasBold, isTrue);
    });
  });
}
