import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/models/question_model.dart';

class MiniProjectWidget extends ConsumerStatefulWidget {
  final QuestionModel question;
  final String? currentAnswer;
  final void Function(String) onAnswerChanged;

  const MiniProjectWidget({
    super.key,
    required this.question,
    required this.currentAnswer,
    required this.onAnswerChanged,
  });

  @override
  ConsumerState<MiniProjectWidget> createState() => _MiniProjectWidgetState();
}

class _MiniProjectWidgetState extends ConsumerState<MiniProjectWidget> {
  bool _hintExpanded = false;
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.currentAnswer);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String? _getHint() {
    final opts = widget.question.options;
    if (opts == null) return null;
    return opts['hint'] as String?;
  }

  @override
  Widget build(BuildContext context) {
    final hint = _getHint();
    final charCount = _controller.text.length;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.question.questionText,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          Stack(
            children: [
              TextField(
                controller: _controller,
                onChanged: (val) {
                  setState(() {});
                  widget.onAnswerChanged(val);
                },
                maxLines: 8,
                maxLength: 500,
                style: const TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 14,
                ),
                decoration: InputDecoration(
                  hintText: 'Çözümünü buraya yaz...',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide:
                        BorderSide(color: Colors.grey[300]!),
                  ),
                  counterText: '$charCount / 500',
                ),
              ),
            ],
          ),
          if (hint != null) ...[
            const SizedBox(height: 12),
            InkWell(
              onTap: () => setState(() => _hintExpanded = !_hintExpanded),
              child: Row(
                children: [
                  Icon(
                    _hintExpanded
                        ? Icons.expand_less
                        : Icons.expand_more,
                    color: AppColors.primary,
                    size: 20,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'İpucu',
                    style: TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            if (_hintExpanded) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                      color: AppColors.primary.withOpacity(0.2)),
                ),
                child: Text(
                  hint,
                  style: const TextStyle(fontSize: 14),
                ),
              ),
            ],
          ],
        ],
      ),
    );
  }
}
