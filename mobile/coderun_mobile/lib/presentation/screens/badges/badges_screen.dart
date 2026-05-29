import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/assets/ghostie_assets.dart';
import '../../../data/models/badge_model.dart';
import '../../../providers/gamification_provider.dart';
import '../../widgets/app_error_widget.dart';
import '../../widgets/ghostie_reaction.dart';
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
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: colorScheme.surface,
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
                const SizedBox(height: 16),
                GhostieReaction(
                  state: earned.isNotEmpty ? GhostieState.celebrating : GhostieState.idle,
                  message: earned.isNotEmpty
                      ? 'Harika! Rozet koleksiyonun büyüyor. Devam et! 🚀'
                      : 'İlk dersini tamamla ve İlk Adım rozetini aç! 🎯',
                  size: 72,
                ),
                const SizedBox(height: 24),
                if (earned.isNotEmpty) ...[
                  Text(
                    'Kazanılan Rozetler',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 12),
                  _BadgeGrid(
                    items: earned
                        .map((b) => _BadgeItem(badge: b, badgeType: b.badgeType, isEarned: true))
                        .toList(),
                  ),
                  const SizedBox(height: 24),
                ] else ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
                    decoration: BoxDecoration(
                      color: colorScheme.surfaceContainerHighest.withValues(alpha: 0.4),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: colorScheme.outlineVariant),
                    ),
                    child: Text(
                      'Henüz kazanılmış rozet yok. İlk dersini tamamlayarak başla!',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontFamily: 'Lexend',
                        fontSize: 13,
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
                if (unearnedTypes.isNotEmpty) ...[
                  Text(
                    'Kilitli Rozetler',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: colorScheme.onSurfaceVariant,
                        ),
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
    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '$earned / $total Rozet Kazanıldı',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: colorScheme.onSurface,
              ),
            ),
            Text(
              '%${(earned / total * 100).round()}',
              style: TextStyle(
                fontSize: 14,
                color: colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: total > 0 ? earned / total : 0,
            backgroundColor: colorScheme.primaryContainer.withValues(alpha: 0.2),
            valueColor: AlwaysStoppedAnimation<Color>(colorScheme.primary),
            minHeight: 8,
          ),
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
