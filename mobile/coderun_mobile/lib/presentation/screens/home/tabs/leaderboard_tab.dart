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
    final colorScheme = Theme.of(context).colorScheme;
    final currentUsername =
        authState.whenOrNull(authenticated: (u) => u.username);

    return leaderboardAsync.when(
      data: (lb) {
        final top3 = List<LeaderboardEntryModel>.from(lb.entries.take(3));
        final mockNames = ['GhostieBot 🤖', 'Gizemli Kodcu 👤', 'Sıradaki Sen 🫵'];
        final mockXps = [500, 250, 0];
        final mockLevels = [10, 5, 1];
        final mockStreaks = [7, 3, 0];
        
        while (top3.length < 3) {
          final nextRank = top3.length + 1;
          top3.add(LeaderboardEntryModel(
            rank: nextRank,
            userId: 'mock_$nextRank',
            username: mockNames[nextRank - 1],
            weeklyXp: mockXps[nextRank - 1],
            level: mockLevels[nextRank - 1],
            streak: mockStreaks[nextRank - 1],
          ));
        }

        final rest = lb.entries.length > 3 ? lb.entries.sublist(3) : <LeaderboardEntryModel>[];

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
                            style: TextStyle(
                                fontSize: 13, color: colorScheme.onSurfaceVariant),
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

                      if (lb.entries.isEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            'Podiumdaki demo kullanıcılar yer tutucudur.',
                            style: TextStyle(
                              fontSize: 11,
                              fontStyle: FontStyle.italic,
                              color: colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ),

                      const SizedBox(height: 20),

                      // Podium animasyonu
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
                                  color: colorScheme.onSurfaceVariant,
                                  isDemo: top3[1].userId.startsWith('mock_'),
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
                                  isDemo: top3[0].userId.startsWith('mock_'),
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
                                  isDemo: top3[2].userId.startsWith('mock_'),
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

              // 4. sıra ve sonrası / boş durum
              if (lb.entries.isEmpty)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainerLow.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.outlineVariant.withValues(alpha: 0.4)),
                      ),
                      child: const Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            '🚀',
                            style: TextStyle(fontSize: 32),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Henüz sıralamada kimse yok.',
                            style: TextStyle(
                              fontFamily: 'PlusJakartaSans',
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppColors.onSurface,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'İlk dersini tamamla ve zirveye yerleş!',
                            style: TextStyle(
                              fontFamily: 'Lexend',
                              fontSize: 12,
                              color: AppColors.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                )
              else
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
                    color: colorScheme.primary,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 12),
                    child: Text(
                      'Senin sıran: #${lb.userRank}',
                      style: TextStyle(
                          color: colorScheme.onPrimary,
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
  final bool isDemo;

  const _PodiumItem({
    required this.entry,
    required this.height,
    required this.color,
    this.isDemo = false,
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
          textAlign: TextAlign.center,
        ),
        if (isDemo)
          Container(
            margin: const EdgeInsets.only(top: 2),
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surfaceContainerHighest,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              'Demo',
              style: TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.w600,
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
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
