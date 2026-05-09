// Learning Path Screen — Coderun Stitch Design
// Stitch reference: docs/design/stitch/mobile/mobilestich/coderun_learning_path_refined/
// Most important mobile screen — vertical journey path with node states

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../data/models/lesson_model.dart';
import '../../../providers/module_provider.dart';
import '../../widgets/app_error_widget.dart';
import '../../widgets/ghostie_avatar.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/progress_node.dart';

class LearningPathScreen extends ConsumerWidget {
  final String moduleSlug;

  const LearningPathScreen({super.key, required this.moduleSlug});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final moduleAsync = ref.watch(moduleProgressProvider(moduleSlug));

    return moduleAsync.when(
      data: (progress) {
        final progressValue = (progress.completionRate / 100).clamp(0.0, 1.0);
        final lessonsAsync = ref.watch(lessonsProvider(moduleSlug));

        return Scaffold(
          backgroundColor: AppColors.background,
          body: RefreshIndicator(
            onRefresh: () async =>
                ref.invalidate(moduleProgressProvider(moduleSlug)),
            child: CustomScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              slivers: [
                // App bar with module info
                SliverAppBar(
                  pinned: true,
                  backgroundColor: AppColors.surfaceContainerLowest,
                  foregroundColor: AppColors.onSurface,
                  elevation: 0,
                  scrolledUnderElevation: 1,
                  title: Text(
                    progress.module.title,
                    style: const TextStyle(
                      fontFamily: 'PlusJakartaSans',
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.onSurface,
                    ),
                  ),
                  centerTitle: true,
                  bottom: PreferredSize(
                    preferredSize: const Size.fromHeight(56),
                    child: _ProgressHeader(
                      completed: progress.completedLessons,
                      total: progress.totalLessons,
                      progressValue: progressValue,
                    ),
                  ),
                ),

                // Unit header card
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(
                    AppSpacing.xl, AppSpacing.xl, AppSpacing.xl, 0,
                  ),
                  sliver: SliverToBoxAdapter(
                    child: _UnitCard(
                      title: progress.module.title,
                      description: progress.module.description,
                      completedCount: progress.completedLessons,
                      totalCount: progress.totalLessons,
                    ),
                  ),
                ),

                // Lesson nodes
                lessonsAsync.when(
                  data: (lessons) {
                    if (lessons.isEmpty) {
                      return const SliverFillRemaining(
                        child: Center(
                          child: Text(
                            'Bu modülde henüz ders yok.',
                            style: TextStyle(
                              fontFamily: 'Lexend',
                              color: AppColors.onSurfaceVariant,
                            ),
                          ),
                        ),
                      );
                    }

                    // Find first incomplete lesson index
                    final activeIndex = lessons.indexWhere(
                      (l) => !l.isCompleted,
                    );

                    return SliverPadding(
                      padding: const EdgeInsets.symmetric(
                        vertical: AppSpacing.xl,
                      ),
                      sliver: SliverToBoxAdapter(
                        child: _LearningPathJourney(
                          lessons: lessons,
                          activeIndex: activeIndex,
                          moduleSlug: moduleSlug,
                          onLessonTap: (lesson) {
                            context.push(
                              '/home/learn/$moduleSlug/lesson/${lesson.id}',
                            );
                          },
                        ),
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
                          ref.invalidate(lessonsProvider(moduleSlug)),
                    ),
                  ),
                ),

                // Bottom padding for nav bar
                const SliverPadding(
                  padding: EdgeInsets.only(bottom: AppSpacing.bottomNavPadding),
                ),
              ],
            ),
          ),
        );
      },
      loading: () => Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          backgroundColor: AppColors.surfaceContainerLowest,
          title: const Text('Yükleniyor...'),
        ),
        body: const LoadingWidget(),
      ),
      error: (e, _) => Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          backgroundColor: AppColors.surfaceContainerLowest,
          title: const Text('Hata'),
        ),
        body: AppErrorWidget(
          message: e.toString(),
          onRetry: () => ref.invalidate(moduleProgressProvider(moduleSlug)),
        ),
      ),
    );
  }
}

class _ProgressHeader extends StatelessWidget {
  final int completed;
  final int total;
  final double progressValue;

  const _ProgressHeader({
    required this.completed,
    required this.total,
    required this.progressValue,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.xl, 0, AppSpacing.xl, AppSpacing.md,
      ),
      color: AppColors.surfaceContainerLowest,
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$completed / $total ders',
                style: const TextStyle(
                  fontFamily: 'Lexend',
                  fontSize: 13,
                  color: AppColors.onSurfaceVariant,
                ),
              ),
              Text(
                '${(progressValue * 100).toStringAsFixed(0)}%',
                style: const TextStyle(
                  fontFamily: 'PlusJakartaSans',
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
            child: LinearProgressIndicator(
              value: progressValue,
              minHeight: 6,
              backgroundColor: AppColors.primaryFixed,
              valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
            ),
          ),
        ],
      ),
    );
  }
}

class _UnitCard extends StatelessWidget {
  final String title;
  final String description;
  final int completedCount;
  final int totalCount;

  const _UnitCard({
    required this.title,
    required this.description,
    required this.completedCount,
    required this.totalCount,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPaddingLg),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primaryFixed, AppColors.surfaceContainerLowest],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'ÜNİTE',
                  style: TextStyle(
                    fontFamily: 'SpaceGrotesk',
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                    letterSpacing: 0.8,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  title,
                  style: const TextStyle(
                    fontFamily: 'PlusJakartaSans',
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: AppColors.onSurface,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
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
          const SizedBox(width: AppSpacing.md),
          Column(
            children: [
              Text(
                '$completedCount',
                style: const TextStyle(
                  fontFamily: 'PlusJakartaSans',
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                  height: 1.0,
                ),
              ),
              Text(
                '/ $totalCount',
                style: const TextStyle(
                  fontFamily: 'Lexend',
                  fontSize: 13,
                  color: AppColors.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _LearningPathJourney extends StatelessWidget {
  final List<LessonModel> lessons;
  final int activeIndex;
  final String moduleSlug;
  final void Function(LessonModel) onLessonTap;

  const _LearningPathJourney({
    required this.lessons,
    required this.activeIndex,
    required this.moduleSlug,
    required this.onLessonTap,
  });

  NodeState _getNodeState(LessonModel lesson, int index) {
    if (lesson.isCompleted) return NodeState.completed;
    if (index == activeIndex) return NodeState.active;
    if (index > activeIndex) return NodeState.locked;
    return NodeState.locked;
  }

  NodeType _getNodeType(LessonModel lesson, int index) {
    final title = lesson.title.toLowerCase();
    if (title.contains('quiz') || title.contains('test')) return NodeType.quiz;
    if (title.contains('review') || title.contains('tekrar')) return NodeType.review;
    if (title.contains('proje') || title.contains('project')) return NodeType.miniProject;
    // Every 5th lesson is a checkpoint
    if ((index + 1) % 5 == 0) return NodeType.checkpoint;
    return NodeType.lesson;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (int i = 0; i < lessons.length; i++) ...[
          // Ghostie helper near active node
          if (i == activeIndex) ...[
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xxl),
              child: GhostieSpeechBubble(
                message: 'Devam et! Bir sonraki ders seni bekliyor 🚀',
                mood: GhostieMood.helping,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
          ],

          // Node
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
            child: ProgressNode(
              state: _getNodeState(lessons[i], i),
              type: _getNodeType(lessons[i], i),
              label: lessons[i].title,
              isLeft: i.isEven,
              onTap: () => onLessonTap(lessons[i]),
            ),
          ),

          // Connector (not after last)
          if (i < lessons.length - 1)
            NodeConnector(
              isCompleted: lessons[i].isCompleted,
              height: 36,
            ),
        ],
        const SizedBox(height: AppSpacing.xl),
      ],
    );
  }
}
