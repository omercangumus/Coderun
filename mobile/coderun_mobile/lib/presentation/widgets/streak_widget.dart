import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/streak_model.dart';

class StreakWidget extends StatelessWidget {
  final StreakModel streak;

  const StreakWidget({super.key, required this.streak});

  Color get _streakColor {
    if (!streak.isAlive) return AppColors.grey;
    if (streak.daysToNextMilestone <= 3) return AppColors.xpGold;
    return AppColors.streakOrange;
  }

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: streak.isAlive ? 1.0 : 0.4,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '🔥',
            style: TextStyle(
              fontSize: 28,
              color: _streakColor,
            ),
          ),
          Text(
            '${streak.currentStreak}',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: _streakColor,
            ),
          ),
          const Text(
            'Günlük seri',
            style: TextStyle(fontSize: 11, color: AppColors.grey),
          ),
        ],
      ),
    );
  }
}
