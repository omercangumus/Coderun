// Dashboard / Home Tab — Coderun Stitch Design
// Stitch reference: docs/design/stitch/mobile/mobilestich/coderun_dashboard/

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../providers/auth_provider.dart';
import '../../../../providers/gamification_provider.dart';
import '../../../../providers/module_provider.dart';
import '../../../widgets/app_error_widget.dart';
import '../../../widgets/ghostie_avatar.dart';
import '../../../widgets/loading_widget.dart';
import '../../../widgets/xp_streak_header.dart';

class HomeTab extends ConsumerWidget {
  final void Function(int index) onTabChange;

  const HomeTab({super.key, required this.onTabChange});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(userStatsProvider);
    final leaderboardAsync = ref.watch(leaderboardProvider);
    final modulesAsync = ref.watch(modulesProvider);
    final authState = ref.watch(authProvider);
    final username =
        authState.whenOrNull(authenticated: (u) => u.username) ?? 'Kullanıcı';

    return Scaffold(
      backgroundColor: AppColors.background,
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(userStatsProvider);
          ref.invalidate(leaderboardProvider);
          ref.invalidate(modulesProvider);
        },
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            // App bar
            SliverAppBar(
              pinned: true,
              backgroundColor: AppColors.surfaceContainerLowest,
              elevation: 0,
              scrolledUnderElevation: 1,
              title: Row(
                children: [
                  Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                    ),
                    child: const Center(
                      child: Text('👻', style: TextStyle(fontSize: 14)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'Coderun',
                    style: TextStyle(
                      fontFamily: 'PlusJakartaSans',
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.onSurface,
                    ),
                  ),
                ],
              ),
              actions: [
                statsAsync.when(
                  data: (stats) => Padding(
                    padding: const EdgeInsets.only(right: AppSpacing.md),
                    child: Row(
                      children: [
                        _StatPill(
                          icon: '⚡',
                          value: '${stats.totalXp}',
                          color: AppColors.primary,
                          bg: AppColors.primaryFixed,
                        ),
                        const SizedBox(width: 6),
                        _StatPill(
                          icon: '🔥',
                          value: '${stats.streak}',
                          color: AppColors.streakOrange,
                          bg: AppColors.streakOrange.withOpacity(0.1),
                        ),
                      ],
                    ),
                  ),
                  loading: () => const SizedBox.shrink(),
                  error: (_, __) => const SizedBox.shrink(),
                ),
              ],
            ),

            SliverPadding(
              padding: const EdgeInsets.all(AppSpacing.xl),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  // Welcome
                  _WelcomeSection(username: username),
                  const SizedBox(height: AppSpacing.xl),

                  // XP Progress
                  statsAsync.when(
                    data: (stats) => _XpCard(
                      xp: stats.totalXp,
                      level: stats.level,
                      xpProgress: stats.levelProgress.progressPercentage / 100,
                      streak: stats.streak,
                    ),
                    loading: () => const _CardSkeleton(height: 80),
                    error: (e, _) => AppErrorWidget(
                      message: e.toString(),
                      onRetry: () => ref.invalidate(userStatsProvider),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),

                  // Continue Learning
                  _SectionTitle(
                    title: 'Devam Et',
                    action: TextButton(
                      onPressed: () => onTabChange(1),
                      child: const Text(
                        'Tümünü Gör',
                        style: TextStyle(
                          fontFamily: 'Lexend',
                          fontSize: 13,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  modulesAsync.when(
                    data: (modules) {
                      if (modules.isEmpty) {
                        return const _EmptyCard(
                          message: 'Henüz modül yok.',
                        );
                      }
                      return _ContinueLearningCard(
                        module: modules.first,
                        onTap: () => context.push(
                          '/home/learn/${modules.first.slug}',
                        ),
                      );
                    },
                    loading: () => const _CardSkeleton(height: 100),
                    error: (e, _) => AppErrorWidget(
                      message: e.toString(),
                      onRetry: () => ref.invalidate(modulesProvider),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),

                  // Stats row
                  statsAsync.when(
                    data: (stats) => _StatsRow(
                      lessonsCompleted: stats.totalLessonsCompleted,
                      totalXp: stats.totalXp,
                      streak: stats.streak,
                    ),
                    loading: () => const _CardSkeleton(height: 80),
                    error: (_, __) => const SizedBox.shrink(),
                  ),
                  const SizedBox(height: AppSpacing.xl),

                  // Ghostie motivational card
                  _GhostieCard(username: username),
                  const SizedBox(height: AppSpacing.xl),

                  // Leaderboard preview
                  _SectionTitle(
                    title: 'Haftalık Sıralama',
                    action: TextButton(
                      onPressed: () => onTabChange(2),
                      child: const Text(
                        'Tümünü Gör',
                        style: TextStyle(
                          fontFamily: 'Lexend',
                          fontSize: 13,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  leaderboardAsync.when(
                    data: (lb) {
                      final top3 = lb.entries.take(3).toList();
                      if (top3.isEmpty) {
                        return const _EmptyCard(message: 'Henüz sıralama yok.');
                      }
                      return _LeaderboardPreview(entries: top3);
                    },
                    loading: () => const _CardSkeleton(height: 120),
                    error: (e, _) => AppErrorWidget(
                      message: e.toString(),
                      onRetry: () => ref.invalidate(leaderboardProvider),
                    ),
                  ),

                  // Bottom padding for nav bar
                  const SizedBox(height: AppSpacing.bottomNavPadding),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Sub-widgets ────────────────────────────────────────────────────────────

class _WelcomeSection extends StatelessWidget {
  final String username;
  const _WelcomeSection({required this.username});

  @override
  Widget build(BuildContext context) {
    final hour = DateTime.now().hour;
    final greeting = hour < 12
        ? 'Günaydın'
        : hour < 18
            ? 'İyi günler'
            : 'İyi akşamlar';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '$greeting, $username! 👋',
          style: const TextStyle(
            fontFamily: 'PlusJakartaSans',
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: AppColors.onSurface,
          ),
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 4),
        const Text(
          'Bugün ne öğrenmek istiyorsun?',
          style: TextStyle(
            fontFamily: 'Lexend',
            fontSize: 14,
            color: AppColors.onSurfaceVariant,
          ),
        ),
      ],
    );
  }
}

class _XpCard extends StatelessWidget {
  final int xp;
  final int level;
  final double xpProgress;
  final int streak;

  const _XpCard({
    required this.xp,
    required this.level,
    required this.xpProgress,
    required this.streak,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
        border: Border.all(color: AppColors.outlineVariant),
        boxShadow: [
          BoxShadow(
            color: AppColors.onSurface.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: XpStreakHeader(
        xp: xp,
        streak: streak,
        level: level,
        xpProgress: xpProgress,
      ),
    );
  }
}

class _ContinueLearningCard extends StatelessWidget {
  final dynamic module;
  final VoidCallback onTap;

  const _ContinueLearningCard({required this.module, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.cardPadding),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [AppColors.primaryContainer, AppColors.primary],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.25),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'DEVAM ET',
                    style: TextStyle(
                      fontFamily: 'SpaceGrotesk',
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: Colors.white70,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    module.title ?? 'Modül',
                    style: const TextStyle(
                      fontFamily: 'PlusJakartaSans',
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                    ),
                    child: const Text(
                      'Devam Et →',
                      style: TextStyle(
                        fontFamily: 'Lexend',
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const Text('📚', style: TextStyle(fontSize: 48)),
          ],
        ),
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  final int lessonsCompleted;
  final int totalXp;
  final int streak;

  const _StatsRow({
    required this.lessonsCompleted,
    required this.totalXp,
    required this.streak,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _MiniStatCard(
            icon: '📖',
            value: '$lessonsCompleted',
            label: 'Ders',
            color: AppColors.primary,
          ),
        ),
        const SizedBox(width: AppSpacing.md),
        Expanded(
          child: _MiniStatCard(
            icon: '⚡',
            value: '$totalXp',
            label: 'XP',
            color: AppColors.xpGold,
          ),
        ),
        const SizedBox(width: AppSpacing.md),
        Expanded(
          child: _MiniStatCard(
            icon: '🔥',
            value: '$streak',
            label: 'Gün',
            color: AppColors.streakOrange,
          ),
        ),
      ],
    );
  }
}

class _MiniStatCard extends StatelessWidget {
  final String icon;
  final String value;
  final String label;
  final Color color;

  const _MiniStatCard({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.md,
      ),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Column(
        children: [
          Text(icon, style: const TextStyle(fontSize: 22)),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontFamily: 'PlusJakartaSans',
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: color,
            ),
          ),
          Text(
            label,
            style: const TextStyle(
              fontFamily: 'Lexend',
              fontSize: 11,
              color: AppColors.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}

class _GhostieCard extends StatelessWidget {
  final String username;
  const _GhostieCard({required this.username});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primaryFixed,
            AppColors.surfaceContainerLowest,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
        border: Border.all(color: AppColors.primary.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          GhostieAvatar(size: GhostieSize.medium, mood: GhostieMood.happy),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Ghostie AI',
                  style: TextStyle(
                    fontFamily: 'PlusJakartaSans',
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 2),
                const Text(
                  'Takıldığın bir yer mi var? Sana yardım etmekten mutluluk duyarım!',
                  style: TextStyle(
                    fontFamily: 'Lexend',
                    fontSize: 13,
                    color: AppColors.onSurfaceVariant,
                    height: 1.4,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _LeaderboardPreview extends StatelessWidget {
  final List<dynamic> entries;
  const _LeaderboardPreview({required this.entries});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Column(
        children: entries.asMap().entries.map((e) {
          final entry = e.value;
          final isLast = e.key == entries.length - 1;
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.cardPadding,
                  vertical: AppSpacing.md,
                ),
                child: Row(
                  children: [
                    // Rank
                    SizedBox(
                      width: 28,
                      child: Text(
                        _rankEmoji(entry.rank),
                        style: const TextStyle(fontSize: 18),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    // Avatar
                    CircleAvatar(
                      radius: 16,
                      backgroundColor: AppColors.primaryFixed,
                      child: Text(
                        (entry.username as String).isNotEmpty
                            ? (entry.username as String)[0].toUpperCase()
                            : '?',
                        style: const TextStyle(
                          fontFamily: 'Lexend',
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    // Name
                    Expanded(
                      child: Text(
                        entry.username as String,
                        style: const TextStyle(
                          fontFamily: 'Lexend',
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.onSurface,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    // XP
                    Text(
                      '${entry.weeklyXp} XP',
                      style: const TextStyle(
                        fontFamily: 'PlusJakartaSans',
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),
              if (!isLast)
                const Divider(height: 1, color: AppColors.outlineVariant),
            ],
          );
        }).toList(),
      ),
    );
  }

  String _rankEmoji(int rank) {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '#$rank';
    }
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  final Widget? action;

  const _SectionTitle({required this.title, this.action});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontFamily: 'PlusJakartaSans',
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.onSurface,
          ),
        ),
        if (action != null) action!,
      ],
    );
  }
}

class _EmptyCard extends StatelessWidget {
  final String message;
  const _EmptyCard({required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Center(
        child: Text(
          message,
          style: const TextStyle(
            fontFamily: 'Lexend',
            fontSize: 14,
            color: AppColors.onSurfaceVariant,
          ),
        ),
      ),
    );
  }
}

class _CardSkeleton extends StatelessWidget {
  final double height;
  const _CardSkeleton({required this.height});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
      ),
    );
  }
}

class _StatPill extends StatelessWidget {
  final String icon;
  final String value;
  final Color color;
  final Color bg;

  const _StatPill({
    required this.icon,
    required this.value,
    required this.color,
    required this.bg,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(icon, style: const TextStyle(fontSize: 12)),
          const SizedBox(width: 3),
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
