// Coderun mobile — pekiştirme sorusu kartı.
// Yanlış cevap sonrası gösterilen basit takip sorusu.

import 'package:flutter/material.dart';
import '../../../../core/assets/ghostie_assets.dart';
import '../../../widgets/ghostie_reaction.dart';

class ReinforcementCardWidget extends StatefulWidget {
  final String questionText;
  final String questionType;
  final Map<String, dynamic>? options;
  final String? hint;
  final ValueChanged<String> onAnswer;

  const ReinforcementCardWidget({
    super.key,
    required this.questionText,
    required this.questionType,
    this.options,
    this.hint,
    required this.onAnswer,
  });

  @override
  State<ReinforcementCardWidget> createState() =>
      _ReinforcementCardWidgetState();
}

class _ReinforcementCardWidgetState extends State<ReinforcementCardWidget> {
  String _answer = '';
  bool _submitted = false;
  bool _showHint = false;

  void _submit() {
    if (_answer.trim().isEmpty) return;
    setState(() => _submitted = true);
    widget.onAnswer(_answer);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final choices = widget.questionType == 'multiple_choice' && widget.options != null
        ? List<String>.from(widget.options!['choices'] ?? [])
        : <String>[];

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.secondaryContainer.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: theme.colorScheme.secondary.withValues(alpha: 0.3),
          width: 2,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with Ghostie
          const GhostieReaction(
            state: GhostieState.reinforcement,
            message: 'Endişelenme! Bu kavramı birlikte pekiştirelim.',
            size: 72,
            preferAnimation: false,
          ),
          const SizedBox(height: 16),

          // Question
          Text(widget.questionText, style: theme.textTheme.titleSmall),
          const SizedBox(height: 12),

          // Answer input
          if (choices.isNotEmpty)
            ...choices.map((choice) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: GestureDetector(
                  onTap: _submitted ? null : () => setState(() => _answer = choice),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: _answer == choice
                          ? theme.colorScheme.secondaryContainer
                          : theme.colorScheme.surface,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: _answer == choice
                            ? theme.colorScheme.secondary
                            : theme.colorScheme.outlineVariant,
                      ),
                    ),
                    child: Text(choice, style: theme.textTheme.bodyMedium),
                  ),
                ),
              );
            })
          else
            TextField(
              onChanged: (v) => setState(() => _answer = v),
              enabled: !_submitted,
              decoration: InputDecoration(
                hintText: 'Cevabınızı yazın...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          const SizedBox(height: 12),

          if (!_submitted)
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: _answer.trim().isNotEmpty ? _submit : null,
                style: FilledButton.styleFrom(
                  backgroundColor: theme.colorScheme.secondary,
                ),
                child: const Text('Cevapla'),
              ),
            ),

          if (widget.hint != null) ...[
            const SizedBox(height: 8),
            GestureDetector(
              onTap: () => setState(() => _showHint = !_showHint),
              child: Text(
                _showHint ? '💡 ${widget.hint}' : '💡 İpucu göster',
                style: TextStyle(
                    color: theme.colorScheme.secondary, fontSize: 13),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
