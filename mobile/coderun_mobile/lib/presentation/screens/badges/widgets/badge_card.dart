import 'package:flutter/material.dart';
import '../../../../data/models/badge_model.dart';

const _badgeIcons = {
  'first_lesson': '🎯',
  'streak_7': '🔥',
  'streak_30': '⚡',
  'module_complete': '🏆',
  'level_5': '⭐',
  'level_10': '💎',
};

const _badgeNames = {
  'first_lesson': 'İlk Ders',
  'streak_7': '7 Günlük Seri',
  'streak_30': '30 Günlük Seri',
  'module_complete': 'Modül Tamamlandı',
  'level_5': 'Seviye 5',
  'level_10': 'Seviye 10',
};

class BadgeCard extends StatelessWidget {
  final BadgeModel? badge;
  final String badgeType;
  final bool isEarned;

  const BadgeCard({
    super.key,
    required this.badge,
    required this.badgeType,
    required this.isEarned,
  });

  @override
  Widget build(BuildContext context) {
    final emoji = _badgeIcons[badgeType] ?? '🏅';
    final name = badge?.title ?? _badgeNames[badgeType] ?? badgeType;

    return Opacity(
      opacity: isEarned ? 1.0 : 0.4,
      child: Container(
        decoration: BoxDecoration(
          color: isEarned ? Colors.white : Colors.grey[200],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isEarned ? Colors.amber : Colors.grey[400]!,
            width: isEarned ? 2 : 1,
          ),
          boxShadow: isEarned
              ? [
                  BoxShadow(
                    color: Colors.amber.withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  )
                ]
              : null,
        ),
        padding: const EdgeInsets.all(12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 48)),
            const SizedBox(height: 8),
            Text(
              name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            if (isEarned && badge != null)
              Text(
                _formatDate(badge!.earnedAt),
                style: const TextStyle(fontSize: 11, color: Colors.grey),
                textAlign: TextAlign.center,
              )
            else
              const Icon(Icons.lock, size: 16, color: Colors.grey),
          ],
        ),
      ),
    );
  }

  String _formatDate(String dateStr) {
    try {
      final dt = DateTime.parse(dateStr);
      return '${dt.day}.${dt.month}.${dt.year}';
    } catch (_) {
      return dateStr;
    }
  }
}
