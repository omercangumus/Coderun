import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../data/models/lesson_result_model.dart';
import '../../../providers/gamification_provider.dart';
import '../../../providers/lesson_provider.dart';
import '../../../providers/module_provider.dart';
import '../../widgets/badge_chip.dart';

class LessonResultScreen extends ConsumerStatefulWidget {
  final LessonResultModel result;
  final String moduleSlug;

  const LessonResultScreen({
    super.key,
    required this.result,
    required this.moduleSlug,
  });

  @override
  ConsumerState<LessonResultScreen> createState() =>
      _LessonResultScreenState();
}

class _LessonResultScreenState extends ConsumerState<LessonResultScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;
  late Animation<Offset> _slideAnim;
  final List<bool> _visibleBadges = [];

  @override
  void initState() {
    super.initState();

    // Provider'ları invalidate et
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.invalidate(lessonDetailProvider(widget.result.lessonId));
      ref.invalidate(moduleProgressProvider(widget.moduleSlug));
      ref.invalidate(userStatsProvider);
      ref.invalidate(streakProvider);
      ref.invalidate(leaderboardProvider);
    });

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _scaleAnim = CurvedAnimation(parent: _controller, curve: Curves.elasticOut);
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));

    _controller.forward();

    // Rozetleri birer birer göster
    final badges = widget.result.badgesEarned;
    for (var i = 0; i < badges.length; i++) {
      _visibleBadges.add(false);
      Future.delayed(Duration(milliseconds: 600 + i * 300), () {
        if (mounted) setState(() => _visibleBadges[i] = true);
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final result = widget.result;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: result.isCompleted
                      ? _buildSuccess(context, result)
                      : _buildFailure(context, result),
                ),
              ),
              _buildButtons(context, result),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSuccess(BuildContext context, LessonResultModel result) {
    return Column(
      children: [
        const SizedBox(height: 24),
        // Tik animasyonu
        ScaleTransition(
          scale: _scaleAnim,
          child: Container(
            width: 80,
            height: 80,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.success,
            ),
            child: const Icon(Icons.check, color: Colors.white, size: 48),
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Tebrikler!',
          style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AppColors.primary),
        ),
        const SizedBox(height: 8),
        Text(
          '%${result.score}',
          style: const TextStyle(
              fontSize: 48,
              fontWeight: FontWeight.bold,
              color: AppColors.success),
        ),
        const SizedBox(height: 16),
        // XP animasyonu
        SlideTransition(
          position: _slideAnim,
          child: Text(
            '+${result.xpEarned} XP',
            style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.xpGold),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          '🔥 ${result.newStreak} günlük seri!',
          style: const TextStyle(fontSize: 16),
        ),
        if (result.levelUp) ...[
          const SizedBox(height: 16),
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.xpGold.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.xpGold),
            ),
            child: Column(
              children: [
                const Text('Seviye Atladın! 🎉',
                    style: TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold)),
                Text('Yeni Seviye: ${result.newLevel}',
                    style: const TextStyle(fontSize: 16)),
              ],
            ),
          ),
        ],
        // Rozetler
        if (result.badgesEarned.isNotEmpty) ...[
          const SizedBox(height: 24),
          const Text(
            'Yeni Rozet Kazandın! 🏆',
            style: TextStyle(
                fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: List.generate(result.badgesEarned.length, (i) {
              final visible =
                  i < _visibleBadges.length && _visibleBadges[i];
              return AnimatedOpacity(
                opacity: visible ? 1.0 : 0.0,
                duration: const Duration(milliseconds: 300),
                child: BadgeChip(badge: result.badgesEarned[i]),
              );
            }),
          ),
        ],
      ],
    );
  }

  Widget _buildFailure(BuildContext context, LessonResultModel result) {
    return Column(
      children: [
        const SizedBox(height: 24),
        ScaleTransition(
          scale: _scaleAnim,
          child: Container(
            width: 80,
            height: 80,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.error,
            ),
            child: const Icon(Icons.close, color: Colors.white, size: 48),
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Tekrar Dene',
          style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AppColors.primary),
        ),
        const SizedBox(height: 8),
        Text(
          '%${result.score}',
          style: const TextStyle(
              fontSize: 48,
              fontWeight: FontWeight.bold,
              color: AppColors.error),
        ),
        const SizedBox(height: 8),
        const Text(
          'En az %70 doğru yapman gerekiyor',
          style: TextStyle(color: AppColors.grey),
        ),
        const SizedBox(height: 16),
        Text(
          '${result.correctCount} doğru, ${result.wrongCount} yanlış',
          style: const TextStyle(fontSize: 16),
        ),
      ],
    );
  }

  Widget _buildButtons(BuildContext context, LessonResultModel result) {
    if (result.isCompleted) {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: () => context.go('/home'),
          child: const Text('Öğrenme Yoluna Dön'),
        ),
      );
    }

    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () {
              ref
                  .read(lessonNotifierProvider(result.lessonId).notifier)
                  .reset();
              context.pop();
            },
            child: const Text('Tekrar Dene'),
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: () => context.go('/home'),
            child: const Text('Öğrenme Yoluna Dön'),
          ),
        ),
      ],
    );
  }
}
