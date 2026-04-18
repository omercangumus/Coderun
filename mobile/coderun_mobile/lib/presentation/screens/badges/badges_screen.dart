import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/models/badge_model.dart';
import '../../../providers/gamification_provider.dart';
import '../../widgets/app_error_widget.dart';
import '../../widgets/loading_widget.dart';
import 'widgets/badge_card.dart';

const _allBadgeTypes = [
  'first_lesson',
  'streak_7',
  'streak_30',
  'module_complete',
  'level_5',
  'level_10',
];

class BadgesScreen extends ConsumerWidget {
  const BadgesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(userStatsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Rozetlerim'),
        centerTitle: true,
      ),
      body: statsAsync.when(
        data: (stats) {
          final earned = stats.badges;
          final earnedTypes = earned.map((b) => b.badgeType).toSet();
          final unearnedTypes =
              _allBadgeTypes.where((t) => !earnedTypes.contains(t)).toList();

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _SummaryRow(earned: earned.length, total: _allBadgeTypes.length),
                const SizedBox(height: 24),
                if (earned.isNotEmpty) ...[
                  const Text(
                    'Kazanılan Rozetler',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  _BadgeGrid(
                    items: earned
                        .map((b) => _BadgeItem(badge: b, badgeType: b.badgeType, isEarned: true))
                        .toList(),
                  ),
                  const SizedBox(height: 24),
                ],
                if (unearnedTypes.isNotEmpty) ...[
                  const Text(
                    'Henüz Kazanılmadı',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  _BadgeGrid(
                    items: unearnedTypes
                        .map((t) => _BadgeItem(badge: null, badgeType: t, isEarned: false))
                        .toList(),
                  ),
                ],
              ],
            ),
          );
        },
        loading: () => const LoadingWidget(message: 'Rozetler yükleniyor...'),
        error: (e, _) => AppErrorWidget(
          message: e.toString(),
          onRetry: () => ref.invalidate(userStatsProvider),
        ),
      ),
    );
  }
}

class _BadgeItem {
  final BadgeModel? badge;
  final String badgeType;
  final bool isEarned;
  const _BadgeItem({required this.badge, required this.badgeType, required this.isEarned});
}

class _SummaryRow extends StatelessWidget {
  final int earned;
  final int total;

  const _SummaryRow({required this.earned, required this.total});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '$earned / $total Rozet Kazanıldı',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            Text(
              '%${(earned / total * 100).round()}',
              style: const TextStyle(fontSize: 14, color: Colors.amber, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 8),
        LinearProgressIndicator(
          value: total > 0 ? earned / total : 0,
          backgroundColor: Colors.grey[200],
          valueColor: const AlwaysStoppedAnimation<Color>(Colors.amber),
          minHeight: 8,
          borderRadius: BorderRadius.circular(4),
        ),
      ],
    );
  }
}

class _BadgeGrid extends StatelessWidget {
  final List<_BadgeItem> items;

  const _BadgeGrid({required this.items});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.85,
      ),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return BadgeCard(
          badge: item.badge,
          badgeType: item.badgeType,
          isEarned: item.isEarned,
        );
      },
    );
  }
}
