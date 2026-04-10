import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/level_progress_model.dart';

class XpProgressBar extends StatelessWidget {
  final LevelProgressModel levelProgress;

  const XpProgressBar({super.key, required this.levelProgress});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Seviye ${levelProgress.currentLevel}',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
            Text(
              levelProgress.isMaxLevel
                  ? 'Maks Seviye'
                  : '${levelProgress.xpRemaining} XP kaldı',
              style: const TextStyle(fontSize: 12, color: AppColors.grey),
            ),
          ],
        ),
        const SizedBox(height: 6),
        AnimatedContainer(
          duration: const Duration(milliseconds: 600),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: levelProgress.progressPercentage / 100,
              minHeight: 10,
              backgroundColor: AppColors.greyLight,
              valueColor:
                  const AlwaysStoppedAnimation<Color>(AppColors.xpGold),
            ),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          '${levelProgress.currentXp} / ${levelProgress.xpNeededForNext} XP',
          style: const TextStyle(fontSize: 11, color: AppColors.grey),
        ),
      ],
    );
  }
}
