import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../providers/module_provider.dart';
import '../../../widgets/app_error_widget.dart';
import '../../../widgets/loading_widget.dart';
import '../../../widgets/module_card.dart';

class LearnTab extends ConsumerWidget {
  const LearnTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final modulesAsync = ref.watch(modulesProvider);

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(modulesProvider),
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
          const SliverPadding(
            padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
            sliver: SliverToBoxAdapter(
              child: Text(
                'Öğrenme Yolları',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          modulesAsync.when(
            data: (modules) => SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final module = modules[index];
                    final progressAsync =
                        ref.watch(moduleProgressProvider(module.slug));
                    final completionRate = progressAsync.whenOrNull(
                      data: (p) => p.completionRate / 100,
                    );
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: ModuleCard(
                        module: module,
                        completionRate: completionRate,
                        onTap: () =>
                            context.push('/home/learn/${module.slug}'),
                      ),
                    );
                  },
                  childCount: modules.length,
                ),
              ),
            ),
            loading: () => const SliverFillRemaining(
              child: LoadingWidget(message: 'Modüller yükleniyor...'),
            ),
            error: (e, _) => SliverFillRemaining(
              child: AppErrorWidget(
                message: e.toString(),
                onRetry: () => ref.invalidate(modulesProvider),
              ),
            ),
          ),
          // Coming Soon bölümü
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Yakında',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.grey),
                  ),
                  const SizedBox(height: 8),
                  ...[
                    'IaC (Terraform)',
                    'Diğer Diller',
                    'Kütüphaneler',
                  ].map(
                    (title) => Opacity(
                      opacity: 0.4,
                      child: Card(
                        elevation: 1,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        child: ListTile(
                          leading: const Icon(Icons.lock_outline,
                              color: AppColors.grey),
                          title: Text(title),
                          subtitle: const Text('Yakında eklenecek'),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
