import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class QuestionProgressIndicator extends StatelessWidget {
  final int current;
  final int total;
  final List<bool> answeredStatus;

  const QuestionProgressIndicator({
    super.key,
    required this.current,
    required this.total,
    required this.answeredStatus,
  });

  @override
  Widget build(BuildContext context) {
    final progress = total > 0 ? current / total : 0.0;

    return Column(
      children: [
        LinearProgressIndicator(
          value: progress,
          minHeight: 4,
          backgroundColor: AppColors.greyLight,
          valueColor:
              const AlwaysStoppedAnimation<Color>(AppColors.primary),
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(total, (index) {
            final isActive = index == current - 1;
            final isAnswered =
                index < answeredStatus.length && answeredStatus[index];

            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: isActive ? 12 : 8,
              height: isActive ? 12 : 8,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isActive
                    ? AppColors.primary
                    : isAnswered
                        ? AppColors.success
                        : AppColors.greyLight,
                border: isActive
                    ? Border.all(color: AppColors.primary, width: 2)
                    : null,
              ),
            );
          }),
        ),
      ],
    );
  }
}
