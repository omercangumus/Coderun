// Coderun mobile — doğru/yanlış + neden widget'ı.
// İki adımlı akış: T/F seçimi, sonra neden seçimi.

import 'package:flutter/material.dart';

class TrueFalseReasonWidget extends StatefulWidget {
  final String questionText;
  final List<String> reasons;
  final String? hint;
  final ValueChanged<String> onAnswer;

  const TrueFalseReasonWidget({
    super.key,
    required this.questionText,
    required this.reasons,
    this.hint,
    required this.onAnswer,
  });

  @override
  State<TrueFalseReasonWidget> createState() => _TrueFalseReasonWidgetState();
}

class _TrueFalseReasonWidgetState extends State<TrueFalseReasonWidget> {
  String? _tfAnswer;
  int? _selectedReason;
  bool _showHint = false;

  void _selectTf(String answer) {
    setState(() => _tfAnswer = answer);
  }

  void _selectReason(int index) {
    setState(() => _selectedReason = index);
    if (_tfAnswer != null) {
      widget.onAnswer('$_tfAnswer|$index');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Statement card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: theme.colorScheme.surfaceContainerLow,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: theme.colorScheme.outlineVariant),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('İFADE',
                  style: theme.textTheme.labelSmall?.copyWith(
                    letterSpacing: 1.2,
                    fontWeight: FontWeight.w600,
                    color: theme.colorScheme.onSurfaceVariant,
                  )),
              const SizedBox(height: 8),
              Text(widget.questionText,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  )),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Step 1: True/False
        if (_tfAnswer == null) ...[
          Text('Bu ifade doğru mu, yanlış mı?',
              style: theme.textTheme.labelSmall?.copyWith(
                letterSpacing: 1.2,
                fontWeight: FontWeight.w600,
                color: theme.colorScheme.onSurfaceVariant,
              )),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _TfButton(
                  label: '✓ Doğru',
                  isSelected: _tfAnswer == 'true',
                  color: Colors.green,
                  onTap: () => _selectTf('true'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _TfButton(
                  label: '✗ Yanlış',
                  isSelected: _tfAnswer == 'false',
                  color: Colors.red,
                  onTap: () => _selectTf('false'),
                ),
              ),
            ],
          ),
        ],

        // Step 2: Reason
        if (_tfAnswer != null) ...[
          Text('Nedenini seçin:',
              style: theme.textTheme.labelSmall?.copyWith(
                letterSpacing: 1.2,
                fontWeight: FontWeight.w600,
                color: theme.colorScheme.onSurfaceVariant,
              )),
          const SizedBox(height: 12),
          ...widget.reasons.asMap().entries.map((entry) {
            final isSelected = _selectedReason == entry.key;
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: GestureDetector(
                onTap: _selectedReason == null
                    ? () => _selectReason(entry.key)
                    : null,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? theme.colorScheme.primaryContainer
                        : theme.colorScheme.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isSelected
                          ? theme.colorScheme.primary
                          : theme.colorScheme.outlineVariant,
                      width: isSelected ? 2 : 1,
                    ),
                  ),
                  child: Text(entry.value,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        fontWeight: isSelected ? FontWeight.w600 : null,
                      )),
                ),
              ),
            );
          }),
        ],

        // Hint
        if (widget.hint != null) ...[
          const SizedBox(height: 12),
          GestureDetector(
            onTap: () => setState(() => _showHint = !_showHint),
            child: Text(
              _showHint ? '💡 ${widget.hint}' : '💡 İpucu göster',
              style: TextStyle(color: theme.colorScheme.primary, fontSize: 13),
            ),
          ),
        ],
      ],
    );
  }
}

class _TfButton extends StatelessWidget {
  final String label;
  final bool isSelected;
  final Color color;
  final VoidCallback onTap;

  const _TfButton({
    required this.label,
    required this.isSelected,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: isSelected ? color.withValues(alpha: 0.1) : null,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? color : Theme.of(context).colorScheme.outlineVariant,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: isSelected ? color : Theme.of(context).colorScheme.onSurface,
            ),
          ),
        ),
      ),
    );
  }
}
