// Coderun Stitch Design System — XP & Streak Header
// Unified top header showing XP, streak, and league info

import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

class XpStreakHeader extends StatelessWidget {
  final int xp;
  final int streak;
  final int level;
  final double xpProgress; // 0.0 to 1.0
  final String? leagueName;

  const XpStreakHeader({
    super.key,
    required this.xp,
    required this.streak,
    required this.level,
    required this.xpProgress,
    this.leagueName,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.xl,
        vertical: AppSpacing.md,
      ),
      decoration: const BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        border: Border(
          bottom: BorderSide(color: AppColors.outlineVariant, width: 1),
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              // Level badge
              _LevelBadge(level: level),
              const SizedBox(width: AppSpacing.md),
              // XP bar
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '$xp XP',
                          style: const TextStyle(
                            fontFamily: 'Lexend',
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                        Text(
                          'Lv. $level',
                          style: const TextStyle(
                            fontFamily: 'SpaceGrotesk',
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppColors.onSurfaceVariant,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                      child: LinearProgressIndicator(
                        value: xpProgress.clamp(0.0, 1.0),
                        minHeight: 6,
                        backgroundColor: AppColors.primaryFixed,
                        valueColor: const AlwaysStoppedAnimation<Color>(
                          AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              // Streak
              _StreakBadge(streak: streak),
            ],
          ),
        ],
      ),
    );
  }
}

class _LevelBadge extends StatelessWidget {
  final int level;

  const _LevelBadge({required this.level});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primary, AppColors.primaryContainer],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
      ),
      child: Center(
        child: Text(
          '$level',
          style: const TextStyle(
            fontFamily: 'PlusJakartaSans',
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}

class _StreakBadge extends StatelessWidget {
  final int streak;

  const _StreakBadge({required this.streak});

  @override
  Widget build(BuildContext context) {
    final isActive = streak > 0;
    return Column(
      children: [
        Text(
          '🔥',
          style: TextStyle(
            fontSize: 20,
            color: isActive ? null : AppColors.outline,
          ),
        ),
        Text(
          '$streak',
          style: TextStyle(
            fontFamily: 'Lexend',
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: isActive ? AppColors.streakOrange : AppColors.outline,
          ),
        ),
      ],
    );
  }
}

/// Compact inline XP/Streak row for cards
class XpStreakRow extends StatelessWidget {
  final int xp;
  final int streak;

  const XpStreakRow({
    super.key,
    required this.xp,
    required this.streak,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _StatPill(
          icon: '⚡',
          value: '$xp XP',
          color: AppColors.primary,
          bgColor: AppColors.primaryFixed,
        ),
        const SizedBox(width: 8),
        _StatPill(
          icon: '🔥',
          value: '$streak gün',
          color: AppColors.streakOrange,
          bgColor: AppColors.streakOrange.withValues(alpha: 0.1),
        ),
      ],
    );
  }
}

class _StatPill extends StatelessWidget {
  final String icon;
  final String value;
  final Color color;
  final Color bgColor;

  const _StatPill({
    required this.icon,
    required this.value,
    required this.color,
    required this.bgColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(icon, style: const TextStyle(fontSize: 13)),
          const SizedBox(width: 4),
          Text(
            value,
            style: TextStyle(
              fontFamily: 'Lexend',
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
