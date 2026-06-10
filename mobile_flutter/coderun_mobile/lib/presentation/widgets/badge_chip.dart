import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/badge_model.dart';

class BadgeChip extends StatelessWidget {
  final BadgeModel badge;

  const BadgeChip({super.key, required this.badge});

  Color get _badgeColor {
    switch (badge.badgeType) {
      case 'streak_7':
      case 'streak_30':
        return AppColors.streakOrange;
      case 'level_5':
      case 'level_10':
        return AppColors.xpGold;
      case 'module_complete':
        return AppColors.success;
      case 'first_lesson':
      default:
        return AppColors.badgePurple;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: badge.description,
      child: Chip(
        label: Text(
          badge.title,
          style: const TextStyle(color: AppColors.white, fontSize: 12),
        ),
        backgroundColor: _badgeColor,
        padding: const EdgeInsets.symmetric(horizontal: 4),
      ),
    );
  }
}
