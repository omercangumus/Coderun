import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/models/leaderboard_model.dart';
import '../../../../providers/auth_provider.dart';
import '../../../../providers/gamification_provider.dart';
import '../../../widgets/app_error_widget.dart';
import '../../../widgets/leaderboard_card.dart';
import '../../../widgets/loading_widget.dart';

class LeaderboardTab extends ConsumerStatefulWidget {
  const LeaderboardTab({super.key});

  @override
  ConsumerState<LeaderboardTab> createState() => _LeaderboardTabState();
}

class _LeaderboardTabState extends ConsumerState<LeaderboardTab>
    with SingleTickerProviderStateMixin {
  late AnimationController _podiumController;
  late List<Animation<Offset>> _podiumAnims;
  Timer? _countdownTimer;
  Duration _timeLeft = Duration.zero;

  @override
  void initState() {
    super.initState();

    _podiumController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    // 3 sütun için stagger animasyonları (100ms arayla)
    _podiumAnims = List.generate(3, (i) {
      final start = i * 0.1;
      final end = start + 0.7;
      return Tween<Offset>(
        begin: const Offset(0, 1),
        end: Offset.zero,
      ).animate(
        CurvedAnimation(
          parent: _podiumController,
          curve: Interval(start, end.clamp(0.0, 1.0), curve: Curves.easeOut),
        ),
      );
    });

    _podiumController.forward();
    _startCountdown();
  }

  void _startCountdown() {
    _updateTimeLeft();
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) _updateTimeLeft();
    });
  }

  void _updateTimeLeft() {
    final now = DateTime.now();
    // Bir sonraki pazartesi 00:00
    final daysUntilMonday = (DateTime.monday - now.weekday + 7) % 7;
    final nextMonday = DateTime(now.year, now.month, now.day + (daysUntilMonday == 0 ? 7 : daysUntilMonday));
    setState(() {
      _timeLeft = nextMonday.difference(now);
    });
  }

  @override
  void dispose() {
    _podiumController.dispose();
    _countdownTimer?.cancel();
    super.dispose();
  }

  String _formatCountdown(Duration d) {
    final h = d.inHours;
    final m = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final s = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '${h}s ${m}d ${s}sn';
  }

  @override
  Widget build(BuildContext context) {
    final leaderboardAsync = ref.watch(leaderboardProvider);
    final authState = ref.watch(authProvider);
    final currentUsername =
        authState.whenOrNull(authenticated: (u) => u.username);

    return leaderboardAsync.when(
      data: (lb) {
        final top3 = lb.entries.take(3).toList();
        final rest = lb.entries.skip(3).toList();

        return RefreshIndicator(
          onRefresh: () async => ref.invalidate(leaderboardProvider),
          child: CustomScrollView(
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
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Bu hafta: ${lb.weekStart} – ${lb.weekEnd}',
                            style: const TextStyle(
                                fontSize: 13, color: AppColors.grey),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '⏱ ${_formatCountdown(_timeLeft)}',
                              style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Podium animasyonu
                      if (top3.length >= 3)
                        SizedBox(
                          height: 180,
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Expanded(
                                child: SlideTransition(
                                  position: _podiumAnims[1],
                                  child: _PodiumItem(
                                    entry: top3[1],
                                    height: 80,
                                    color: AppColors.grey,
                                  ),
                                ),
                              ),
                              Expanded(
                                child: SlideTransition(
                                  position: _podiumAnims[0],
                                  child: _PodiumItem(
                                    entry: top3[0],
                                    height: 110,
                                    color: AppColors.xpGold,
                                  ),
                                ),
                              ),
                              Expanded(
                                child: SlideTransition(
                                  position: _podiumAnims[2],
                                  child: _PodiumItem(
                                    entry: top3[2],
                                    height: 60,
                                    color: AppColors.streakOrange,
                                  ),
                                ),
                              ),
                            ],
                          ),
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
                    return LeaderboardCard(
                      entry: entry,
                      isCurrentUser: isCurrentUser,
                    );
                  },
                  childCount: rest.length,
                ),
              ),

              const SliverPadding(padding: EdgeInsets.only(bottom: 8)),

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
          ),
        );
      },
      loading: () => const LoadingWidget(message: 'Sıralama yükleniyor...'),
      error: (e, _) => AppErrorWidget(
        message: e.toString(),
        onRetry: () => ref.invalidate(leaderboardProvider),
      ),
    );
  }
}

class _PodiumItem extends StatelessWidget {
  final LeaderboardEntryModel entry;
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
        Text(
          entry.username,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 4),
        Text(
          '${entry.weeklyXp} XP',
          style: TextStyle(fontSize: 11, color: color),
        ),
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
                  color: color, fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ),
        ),
      ],
    );
  }
}
