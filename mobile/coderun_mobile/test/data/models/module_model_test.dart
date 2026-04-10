import 'package:flutter_test/flutter_test.dart';
import 'package:coderun_mobile/data/models/module_model.dart';
import 'package:coderun_mobile/data/models/lesson_model.dart';
import 'package:coderun_mobile/data/models/leaderboard_model.dart';

void main() {
  group('ModuleModel', () {
    test('test_module_from_json', () {
      final json = {
        'id': '1',
        'title': 'Python Temelleri',
        'slug': 'python-basics',
        'description': 'Python öğren',
        'order': 1,
        'is_active': true,
      };
      final model = ModuleModel.fromJson(json);
      expect(model.id, '1');
      expect(model.title, 'Python Temelleri');
      expect(model.slug, 'python-basics');
      expect(model.isActive, true);
    });
  });

  group('LessonModel', () {
    test('test_lesson_from_json', () {
      final json = {
        'id': '10',
        'module_id': '1',
        'title': 'Değişkenler',
        'lesson_type': 'quiz',
        'order': 1,
        'xp_reward': 20,
        'is_active': true,
      };
      final model = LessonModel.fromJson(json);
      expect(model.id, '10');
      expect(model.moduleId, '1');
      expect(model.xpReward, 20);
    });

    test('test_lesson_locked_default', () {
      final json = {
        'id': '10',
        'module_id': '1',
        'title': 'Değişkenler',
        'lesson_type': 'quiz',
        'order': 1,
        'xp_reward': 20,
        'is_active': true,
      };
      final model = LessonModel.fromJson(json);
      expect(model.isLocked, false);
    });

    test('test_lesson_completed_default', () {
      final json = {
        'id': '10',
        'module_id': '1',
        'title': 'Değişkenler',
        'lesson_type': 'quiz',
        'order': 1,
        'xp_reward': 20,
        'is_active': true,
      };
      final model = LessonModel.fromJson(json);
      expect(model.isCompleted, false);
    });
  });

  group('LeaderboardModel', () {
    test('test_leaderboard_from_json', () {
      final json = {
        'entries': [
          {
            'rank': 1,
            'user_id': 'u1',
            'username': 'ali',
            'weekly_xp': 500,
            'level': 5,
            'streak': 7,
          }
        ],
        'total_count': 1,
        'user_rank': 1,
        'week_start': '2026-04-07',
        'week_end': '2026-04-13',
      };
      final model = LeaderboardModel.fromJson(json);
      expect(model.entries.length, 1);
      expect(model.entries.first.username, 'ali');
      expect(model.userRank, 1);
      expect(model.weekStart, '2026-04-07');
    });
  });
}
