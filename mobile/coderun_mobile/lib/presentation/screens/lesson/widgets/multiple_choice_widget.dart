import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/models/question_model.dart';

class MultipleChoiceWidget extends StatelessWidget {
  final QuestionModel question;
  final String? selectedAnswer;
  final void Function(String) onAnswerSelected;

  const MultipleChoiceWidget({
    super.key,
    required this.question,
    required this.selectedAnswer,
    required this.onAnswerSelected,
  });

  List<String> _getChoices() {
    final opts = question.options;
    if (opts == null) return [];
    final choices = opts['choices'];
    if (choices is List) return choices.cast<String>();
    return [];
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

          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: InkWell(
              onTap: () => onAnswerSelected(choice),
              borderRadius: BorderRadius.circular(12),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: isSelected
                      ? AppColors.primary.withOpacity(0.1)
                      : Colors.white,
                  border: Border.all(
                    color: isSelected ? AppColors.primary : AppColors.greyLight,
                    width: isSelected ? 2 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 14,
                      backgroundColor: isSelected
                          ? AppColors.primary
                          : AppColors.greyLight,
                      child: Text(
                        label,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: isSelected ? Colors.white : AppColors.grey,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        choice,
                        style: TextStyle(
                          fontSize: 15,
                          color: isSelected
                              ? AppColors.primary
                              : AppColors.textPrimary,
                          fontWeight: isSelected
                              ? FontWeight.w600
                              : FontWeight.normal,
                        ),
                      ),
                    ),
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
