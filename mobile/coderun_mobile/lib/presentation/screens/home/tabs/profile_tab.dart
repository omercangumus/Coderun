import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../providers/auth_provider.dart';
import '../../../../providers/gamification_provider.dart';
import '../../../widgets/app_error_widget.dart';
import '../../../widgets/badge_chip.dart';
import '../../../widgets/loading_widget.dart';
import '../../../widgets/stat_card.dart';
import '../../../widgets/streak_widget.dart';
import '../../../widgets/xp_progress_bar.dart';

class ProfileTab extends ConsumerWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final statsAsync = ref.watch(userStatsProvider);
    final streakAsync = ref.watch(streakProvider);

    final username =
        authState.whenOrNull(authenticated: (u) => u.username) ?? '';
    final email =
        authState.whenOrNull(authenticated: (u) => u.email) ?? '';

    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(userStatsProvider);
        ref.invalidate(streakProvider);
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Avatar + kullanıcı bilgisi
              Center(
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: AppColors.primary,
                      child: Text(
                        username.isNotEmpty
                            ? username[0].toUpperCase()
                            : '?',
                        style: const TextStyle(
                            fontSize: 32,
                            color: AppColors.white,
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(username,
                        style: const TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold)),
                    Text(email,
                        style: const TextStyle(
                            fontSize: 13, color: AppColors.grey)),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // İstatistik kartları 2x2
              statsAsync.when(
                data: (stats) => GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                  childAspectRatio: 1.4,
                  children: [
                    StatCard(
                        title: 'Toplam XP',
                        value: '${stats.totalXp}',
                        icon: Icons.star,
                        color: AppColors.xpGold),
                    StatCard(
                        title: 'Mevcut Seviye',
                        value: '${stats.level}',
                        icon: Icons.trending_up,
                        color: AppColors.info),
                    StatCard(
                        title: 'Tamamlanan Ders',
                        value: '${stats.totalLessonsCompleted}',
                        icon: Icons.menu_book,
                        color: AppColors.success),
                    StatCard(
                        title: 'Tamamlanan Modül',
                        value: '${stats.totalModulesCompleted}',
                        icon: Icons.layers,
                        color: AppColors.accent),
                  ],
                ),
                loading: () => const LoadingWidget(),
                error: (e, _) => AppErrorWidget(message: e.toString()),
              ),
              const SizedBox(height: 20),

              // XP ilerleme çubuğu
              statsAsync.whenOrNull(
                    data: (stats) => Card(
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: XpProgressBar(
                            levelProgress: stats.levelProgress),
                      ),
                    ),
                  ) ??
                  const SizedBox.shrink(),
              const SizedBox(height: 20),

              // Streak kartı
              streakAsync.when(
                data: (streak) => Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        StreakWidget(streak: streak),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            streak.daysToNextMilestone > 0
                                ? 'Sonraki milestone\'a ${streak.daysToNextMilestone} gün kaldı (${streak.nextMilestone} gün)'
                                : 'Milestone\'a ulaştın! 🎉',
                            style: const TextStyle(
                                fontSize: 13, color: AppColors.grey),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                loading: () => const LoadingWidget(),
                error: (e, _) => AppErrorWidget(message: e.toString()),
              ),
              const SizedBox(height: 20),

              // Rozetler
              statsAsync.whenOrNull(
                    data: (stats) => Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Kazanılan Rozetler (${stats.badges.length})',
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: stats.badges
                                .map((b) => Padding(
                                      padding:
                                          const EdgeInsets.only(right: 8),
                                      child: BadgeChip(badge: b),
                                    ))
                                .toList(),
                          ),
                        ),
                      ],
                    ),
                  ) ??
                  const SizedBox.shrink(),
              const SizedBox(height: 32),

              // Çıkış butonu
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.error,
                    foregroundColor: AppColors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  icon: const Icon(Icons.logout),
                  label: const Text('Çıkış Yap'),
                  onPressed: () => _confirmLogout(context, ref),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _confirmLogout(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Çıkış Yap'),
        content:
            const Text('Çıkış yapmak istediğinizden emin misiniz?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('İptal'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.error,
                foregroundColor: AppColors.white),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Çıkış Yap'),
          ),
        ],
      ),
    );
    if (confirmed == true) {
      ref.read(authProvider.notifier).logout();
    }
  }
}
