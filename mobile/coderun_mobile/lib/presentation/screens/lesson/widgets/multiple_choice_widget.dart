import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/models/question_model.dart';

class MultipleChoiceWidget extends StatelessWidget {
  final QuestionModel question;
  final String? selectedAnswer;
  final void Function(String) onAnswerSelected;
  // correctAnswer: null ise henüz cevap verilmedi, dolu ise sonuç gösteriliyor
  final String? correctAnswer;

  const MultipleChoiceWidget({
    super.key,
    required this.question,
    required this.selectedAnswer,
    required this.onAnswerSelected,
    this.correctAnswer,
  });

  List<String> _getChoices() {
    final opts = question.options;
    if (opts == null) return [];
    final choices = opts['choices'];
    if (choices is List) return choices.cast<String>();
    return [];
  }

  void _handleTap(String choice) {
    if (correctAnswer != null) {
      // Sonuç gösteriliyorsa haptic feedback
      if (choice == correctAnswer) {
        try {
          HapticFeedback.lightImpact();
        } catch (_) {}
      } else {
        try {
          HapticFeedback.heavyImpact();
        } catch (_) {}
      }
    } else {
      try {
        HapticFeedback.selectionClick();
      } catch (_) {}
    }
    onAnswerSelected(choice);
  }

  @override
  Widget build(BuildContext context) {
    final choices = _getChoices();
    const labels = ['A', 'B', 'C', 'D'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          question.questionText,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 24),
        ...List.generate(choices.length, (index) {
          final choice = choices[index];
          final label = index < labels.length ? labels[index] : '${index + 1}';
          final isSelected = selectedAnswer == choice;
          final isCorrect = correctAnswer != null && choice == correctAnswer;
          final isWrong = correctAnswer != null &&
              isSelected &&
              choice != correctAnswer;

          Color borderColor = AppColors.greyLight;
          Color bgColor = Colors.white;
          if (isCorrect) {
            borderColor = AppColors.success;
            bgColor = AppColors.success.withValues(alpha: 0.1);
          } else if (isWrong) {
            borderColor = AppColors.error;
            bgColor = AppColors.error.withValues(alpha: 0.1);
          } else if (isSelected) {
            borderColor = AppColors.primary;
            bgColor = AppColors.primary.withValues(alpha: 0.1);
          }

          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: InkWell(
              onTap: () => _handleTap(choice),
              borderRadius: BorderRadius.circular(12),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: bgColor,
                  border: Border.all(
                    color: borderColor,
                    width: isSelected || isCorrect ? 2 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 14,
                      backgroundColor: isCorrect
                          ? AppColors.success
                          : isWrong
                              ? AppColors.error
                              : isSelected
                                  ? AppColors.primary
                                  : AppColors.greyLight,
                      child: Text(
                        label,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: (isSelected || isCorrect || isWrong)
                              ? Colors.white
                              : AppColors.grey,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        choice,
                        style: TextStyle(
                          fontSize: 15,
                          color: isCorrect
                              ? AppColors.success
                              : isWrong
                                  ? AppColors.error
                                  : isSelected
                                      ? AppColors.primary
                                      : AppColors.textPrimary,
                          fontWeight: isSelected || isCorrect
                              ? FontWeight.w600
                              : FontWeight.normal,
                        ),
                      ),
                    ),
                    if (isCorrect)
                      const Icon(Icons.check_circle,
                          color: AppColors.success, size: 20),
                    if (isWrong)
                      const Icon(Icons.cancel,
                          color: AppColors.error, size: 20),
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }
}
