import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../providers/auth_provider.dart';
import '../../../../providers/gamification_provider.dart';
import '../../../widgets/app_error_widget.dart';
import '../../../widgets/loading_widget.dart';

class LeaderboardTab extends ConsumerWidget {
  const LeaderboardTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final leaderboardAsync = ref.watch(leaderboardProvider);
    final authState = ref.watch(authProvider);
    final currentUsername =
        authState.whenOrNull(authenticated: (u) => u.username);

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(leaderboardProvider),
      child: leaderboardAsync.when(
        data: (lb) {
          final top3 = lb.entries.take(3).toList();
          final rest = lb.entries.skip(3).toList();

          return CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Haftalık Sıralama',
                        style: TextStyle(
                            fontSize: 22, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Bu hafta: ${lb.weekStart} – ${lb.weekEnd}',
                        style: const TextStyle(
                            fontSize: 13, color: AppColors.grey),
                      ),
                      const SizedBox(height: 20),

                      // Podium
                      if (top3.length >= 3)
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            // 2. sıra
                            Expanded(
                              child: _PodiumItem(
                                entry: top3[1],
                                height: 80,
                                color: AppColors.grey,
                              ),
                            ),
                            // 1. sıra
                            Expanded(
                              child: _PodiumItem(
                                entry: top3[0],
                                height: 110,
                                color: AppColors.xpGold,
                              ),
                            ),
                            // 3. sıra
                            Expanded(
                              child: _PodiumItem(
                                entry: top3[2],
                                height: 60,
                                color: AppColors.streakOrange,
                              ),
                            ),
                          ],
                        ),
                    ],
                  ),
                ),
              ),

              // 4. sıra ve sonrası
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final entry = rest[index];
                    final isCurrentUser = entry.username == currentUsername;
                    return Container(
                      color: isCurrentUser
                          ? AppColors.primary.withValues(alpha: 0.08)
                          : null,
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: AppColors.greyLight,
                          child: Text(
                            '#${entry.rank}',
                            style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary),
                          ),
                        ),
                        title: Text(
                          entry.username,
                          style: TextStyle(
                            fontWeight: isCurrentUser
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                        subtitle: Text('🔥 ${entry.streak} gün'),
                        trailing: Text(
                          '${entry.weeklyXp} XP',
                          style: const TextStyle(
                              color: AppColors.xpGold,
                              fontWeight: FontWeight.bold),
                        ),
                      ),
                    );
                  },
                  childCount: rest.length,
                ),
              ),

              // Kullanıcının kendi sırası
              if (lb.userRank != null)
                SliverToBoxAdapter(
                  child: Container(
                    color: AppColors.primary,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 12),
                    child: Text(
                      'Senin sıran: #${lb.userRank}',
                      style: const TextStyle(
                          color: AppColors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 15),
                    ),
                  ),
                ),
            ],
          );
        },
        loading: () => const LoadingWidget(message: 'Sıralama yükleniyor...'),
        error: (e, _) => AppErrorWidget(
          message: e.toString(),
          onRetry: () => ref.invalidate(leaderboardProvider),
        ),
      ),
    );
  }
}

class _PodiumItem extends StatelessWidget {
  final dynamic entry;
  final double height;
  final Color color;

  const _PodiumItem({
    required this.entry,
    required this.height,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(entry.username,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            overflow: TextOverflow.ellipsis),
        const SizedBox(height: 4),
        Text('${entry.weeklyXp} XP',
            style: TextStyle(fontSize: 11, color: color)),
        const SizedBox(height: 4),
        Container(
          height: height,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.2),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
            border: Border.all(color: color, width: 2),
          ),
          child: Center(
            child: Text(
              '#${entry.rank}',
              style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.bold,
                  fontSize: 18),
            ),
          ),
        ),
      ],
    );
  }
}
