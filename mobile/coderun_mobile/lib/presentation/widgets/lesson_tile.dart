import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/lesson_model.dart';

class LessonTile extends StatelessWidget {
  final LessonModel lesson;
  final VoidCallback? onTap;

  const LessonTile({super.key, required this.lesson, this.onTap});

  @override
  Widget build(BuildContext context) {
    final isLocked = lesson.isLocked;
    final isCompleted = lesson.isCompleted;

    return Opacity(
      opacity: isLocked ? 0.5 : 1.0,
      child: ListTile(
        leading: CircleAvatar(
          radius: 16,
          backgroundColor: isCompleted
              ? AppColors.success
              : isLocked
                  ? AppColors.grey
                  : AppColors.primary,
          child: Text(
            '${lesson.order}',
            style: const TextStyle(
              color: AppColors.white,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        title: Text(
          lesson.title,
          style: TextStyle(
            color: isLocked ? AppColors.grey : null,
            fontWeight: FontWeight.w500,
          ),
        ),
        subtitle: lesson.score != null
            ? Text(
                'Skor: ${lesson.score}',
                style: const TextStyle(fontSize: 12, color: AppColors.grey),
              )
            : null,
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              '+${lesson.xpReward} XP',
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.xpGold,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(width: 8),
            if (isCompleted)
              const Icon(Icons.check_circle, color: AppColors.success, size: 20)
            else if (isLocked)
              const Icon(Icons.lock, color: AppColors.grey, size: 20),
          ],
        ),
        onTap: isLocked ? null : onTap,
      ),
    );
  }
}
