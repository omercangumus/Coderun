import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../providers/auth_provider.dart';
import '../../../../providers/gamification_provider.dart';
import '../../../../providers/module_provider.dart';
import '../../../widgets/app_error_widget.dart';
import '../../../widgets/loading_widget.dart';
import '../../../widgets/module_card.dart';
import '../../../widgets/stat_card.dart';
import '../../../widgets/streak_widget.dart';
import '../../../widgets/xp_progress_bar.dart';

class HomeTab extends ConsumerWidget {
  final void Function(int index) onTabChange;

  const HomeTab({super.key, required this.onTabChange});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(userStatsProvider);
    final streakAsync = ref.watch(streakProvider);
    final leaderboardAsync = ref.watch(leaderboardProvider);
    final modulesAsync = ref.watch(modulesProvider);
    final authState = ref.watch(authProvider);
    final username =
        authState.whenOrNull(authenticated: (u) => u.username) ?? 'Kullanıcı';

    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(userStatsProvider);
        ref.invalidate(streakProvider);
        ref.invalidate(leaderboardProvider);
        ref.invalidate(modulesProvider);
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hoş geldin + streak
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'Merhaba, $username!',
                      style: AppTextStyles.heading2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  streakAsync.when(
                    data: (streak) => StreakWidget(streak: streak),
                    loading: () =>
                        const SizedBox(width: 60, child: LoadingWidget()),
                    error: (_, __) => const SizedBox.shrink(),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // XP ilerleme kartı
              statsAsync.when(
                data: (stats) => Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: XpProgressBar(levelProgress: stats.levelProgress),
                  ),
                ),
                loading: () => const LoadingWidget(),
                error: (e, _) => AppErrorWidget(
                  message: e.toString(),
                  onRetry: () => ref.invalidate(userStatsProvider),
                ),
              ),
              const SizedBox(height: 20),

              // Devam Et bölümü
              const Text('Devam Et',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              modulesAsync.when(
                data: (modules) {
                  if (modules.isEmpty) {
                    return const Text('Henüz modül yok.',
                        style: TextStyle(color: AppColors.grey));
                  }
                  // Tamamlanmamış ilk modülü göster
                  final first = modules.first;
                  return ModuleCard(
                    module: first,
                    onTap: () => onTabChange(1),
                  );
                },
                loading: () => const LoadingWidget(),
                error: (e, _) => AppErrorWidget(
                  message: e.toString(),
                  onRetry: () => ref.invalidate(modulesProvider),
                ),
              ),
              const SizedBox(height: 20),

              // Hızlı istatistikler
              const Text('İstatistikler',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              statsAsync.when(
                data: (stats) => Row(
                  children: [
                    Expanded(
                      child: StatCard(
                        title: 'Tamamlanan Ders',
                        value: '${stats.totalLessonsCompleted}',
                        icon: Icons.menu_book,
                        color: AppColors.info,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: StatCard(
                        title: 'Toplam XP',
                        value: '${stats.totalXp}',
                        icon: Icons.star,
                        color: AppColors.xpGold,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: StatCard(
                        title: 'Aktif Gün',
                        value: '${stats.streak}',
                        icon: Icons.local_fire_department,
                        color: AppColors.streakOrange,
                      ),
                    ),
                  ],
                ),
                loading: () => const LoadingWidget(),
                error: (e, _) => AppErrorWidget(
                  message: e.toString(),
                  onRetry: () => ref.invalidate(userStatsProvider),
                ),
              ),
              const SizedBox(height: 20),

              // Haftalık liderboard özeti
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Haftalık Sıralama',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  TextButton(
                    onPressed: () => onTabChange(2),
                    child: const Text('Tümünü Gör'),
                  ),
                ],
              ),
              leaderboardAsync.when(
                data: (lb) {
                  final top3 = lb.entries.take(3).toList();
                  if (top3.isEmpty) {
                    return const Text('Henüz sıralama yok.',
                        style: TextStyle(color: AppColors.grey));
                  }
                  return Column(
                    children: top3
                        .map(
                          (e) => ListTile(
                            leading: CircleAvatar(
                              backgroundColor: AppColors.primary,
                              child: Text(
                                '#${e.rank}',
                                style: const TextStyle(
                                    color: AppColors.white, fontSize: 12),
                              ),
                            ),
                            title: Text(e.username),
                            trailing: Text(
                              '${e.weeklyXp} XP',
                              style: const TextStyle(
                                  color: AppColors.xpGold,
                                  fontWeight: FontWeight.bold),
                            ),
                          ),
                        )
                        .toList(),
                  );
                },
                loading: () => const LoadingWidget(),
                error: (e, _) => AppErrorWidget(
                  message: e.toString(),
                  onRetry: () => ref.invalidate(leaderboardProvider),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
