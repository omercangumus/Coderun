import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../providers/module_provider.dart';
import '../../widgets/app_error_widget.dart';
import '../../widgets/lesson_tile.dart';
import '../../widgets/loading_widget.dart';

class LearningPathScreen extends ConsumerWidget {
  final String moduleSlug;

  const LearningPathScreen({super.key, required this.moduleSlug});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final moduleAsync = ref.watch(moduleProgressProvider(moduleSlug));

    return moduleAsync.when(
      data: (progress) {
        // API 0-100 döndürüyor, LinearProgressIndicator 0.0-1.0 bekliyor
        final progressValue =
            (progress.completionRate / 100).clamp(0.0, 1.0);
        final allCompleted = progress.completionRate >= 100;
        final lessonsAsync = ref.watch(lessonsProvider(progress.module.id));

        return Scaffold(
          appBar: AppBar(
            title: Text(progress.module.title),
          ),
          body: RefreshIndicator(
            onRefresh: () async =>
                ref.invalidate(moduleProgressProvider(moduleSlug)),
            child: CustomScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              slivers: [
                // İlerleme özeti
                SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverToBoxAdapter(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${progress.completedLessons} / ${progress.totalLessons} ders',
                              style: const TextStyle(
                                  fontSize: 14, color: AppColors.grey),
                            ),
                            Text(
                              '%${progress.completionRate.toStringAsFixed(0)}',
                              style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.primary),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: LinearProgressIndicator(
                            value: progressValue,
                            minHeight: 12,
                            backgroundColor: AppColors.greyLight,
                            valueColor: const AlwaysStoppedAnimation<Color>(
                                AppColors.success),
                          ),
                        ),
                        if (allCompleted) ...[
                          const SizedBox(height: 20),
                          const Center(
                            child: Text(
                              'Tebrikler! Bu modülü tamamladın 🎉',
                              style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.success),
                              textAlign: TextAlign.center,
                            ),
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () =>
                                  ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Yakında!')),
                              ),
                              child: const Text('Sonraki Modüle Geç'),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),

                // Ders listesi
                lessonsAsync.when(
                  data: (lessons) {
                    if (lessons.isEmpty) {
                      return const SliverFillRemaining(
                        child: Center(
                          child: Text(
                            'Bu modülde henüz ders yok.',
                            style: TextStyle(color: AppColors.grey),
                          ),
                        ),
                      );
                    }
                    return SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) => LessonTile(
                          lesson: lessons[index],
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Yakında!')),
                            );
                          },
                        ),
                        childCount: lessons.length,
                      ),
                    );
                  },
                  loading: () => const SliverFillRemaining(
                    child: LoadingWidget(message: 'Dersler yükleniyor...'),
                  ),
                  error: (e, _) => SliverFillRemaining(
                    child: AppErrorWidget(
                      message: e.toString(),
                      onRetry: () =>
                          ref.invalidate(lessonsProvider(progress.module.id)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
      loading: () => Scaffold(
        appBar: AppBar(title: const Text('Yükleniyor...')),
        body: const LoadingWidget(),
      ),
      error: (e, _) => Scaffold(
        appBar: AppBar(title: const Text('Hata')),
        body: AppErrorWidget(
          message: e.toString(),
          onRetry: () => ref.invalidate(moduleProgressProvider(moduleSlug)),
        ),
      ),
    );
  }
}
