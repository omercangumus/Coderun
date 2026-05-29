import 'package:flutter/material.dart';
import '../../../../data/models/badge_model.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

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

const _badgeDescriptions = {
  'first_lesson': 'İlk dersini tamamla',
  'streak_7': '7 günlük öğrenme serisi yakala',
  'streak_30': '30 günlük dev öğrenme serisi yakala',
  'module_complete': 'Herhangi bir modülü bitir',
  'level_5': '5. Seviyeye ulaş',
  'level_10': '10. Seviyeye ulaş',
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
    final description = _badgeDescriptions[badgeType] ?? 'Gizemli başarı ödülü';

    return Container(
      decoration: BoxDecoration(
        color: isEarned 
            ? AppColors.surfaceContainerLowest 
            : AppColors.surfaceContainerLow.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
        border: Border.all(
          color: isEarned 
              ? AppColors.xpGold 
              : AppColors.outlineVariant.withValues(alpha: 0.6),
          width: isEarned ? 2 : 1.5,
        ),
        boxShadow: isEarned
            ? [
                BoxShadow(
                  color: AppColors.xpGold.withValues(alpha: 0.15),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ]
            : null,
      ),
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Emoji with status
          Stack(
            alignment: Alignment.center,
            children: [
              Text(
                emoji, 
                style: const TextStyle(
                  fontSize: 44,
                )
              ),
              if (!isEarned)
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerHighest.withValues(alpha: 0.9),
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.outlineVariant, width: 1.5),
                  ),
                  child: const Icon(
                    Icons.lock, 
                    size: 14, 
                    color: AppColors.onSurfaceVariant
                  ),
                ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            name,
            style: TextStyle(
              fontFamily: 'PlusJakartaSans',
              fontWeight: FontWeight.w700, 
              fontSize: 13,
              color: isEarned ? AppColors.onSurface : AppColors.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 2),
          Text(
            description,
            style: TextStyle(
              fontFamily: 'Lexend',
              fontSize: 10.0,
              color: isEarned ? AppColors.onSurfaceVariant : AppColors.outline,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: AppSpacing.xs),
          if (isEarned && badge != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.primaryFixedDim.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
              ),
              child: Text(
                _formatDate(badge!.earnedAt),
                style: const TextStyle(
                  fontFamily: 'SpaceGrotesk',
                  fontSize: 9, 
                  color: AppColors.primary,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            )
          else
            const Text(
              'Kilitli',
              style: TextStyle(
                fontFamily: 'SpaceGrotesk',
                fontSize: 9,
                color: AppColors.outline,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.5,
              ),
            ),
        ],
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
