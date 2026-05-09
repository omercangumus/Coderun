// Coderun mobile — çoklu seçim widget'ı.
// Selectable chip grid ile birden fazla seçenek işaretleme.

import 'package:flutter/material.dart';

class MultiSelectWidget extends StatefulWidget {
  final String questionText;
  final List<String> choices;
  final String? hint;
  final ValueChanged<String> onAnswer;

  const MultiSelectWidget({
    super.key,
    required this.questionText,
    required this.choices,
    this.hint,
    required this.onAnswer,
  });

  @override
  State<MultiSelectWidget> createState() => _MultiSelectWidgetState();
}

class _MultiSelectWidgetState extends State<MultiSelectWidget> {
  final Set<int> _selected = {};
  bool _submitted = false;
  bool _showHint = false;

  void _toggle(int index) {
    if (_submitted) return;
    setState(() {
      if (_selected.contains(index)) {
        _selected.remove(index);
      } else {
        _selected.add(index);
      }
    });
  }

  void _submit() {
    if (_selected.isEmpty) return;
    setState(() => _submitted = true);
    final answer = _selected.map((i) => widget.choices[i]).join(',');
    widget.onAnswer(answer);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.questionText, style: theme.textTheme.titleMedium),
        const SizedBox(height: 4),
        Text(
          'Birden fazla seçenek işaretleyebilirsiniz',
          style: theme.textTheme.bodySmall?.copyWith(
            color: theme.colorScheme.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 16),

        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: List.generate(widget.choices.length, (i) {
            final isSelected = _selected.contains(i);
            return GestureDetector(
              onTap: () => _toggle(i),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 22,
                      height: 22,
                      decoration: BoxDecoration(
                        color: isSelected
                            ? theme.colorScheme.primary
                            : theme.colorScheme.surfaceContainerHigh,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(
                          color: isSelected
                              ? theme.colorScheme.primary
                              : theme.colorScheme.outlineVariant,
                        ),
                      ),
                      child: isSelected
                          ? const Icon(Icons.check,
                              size: 16, color: Colors.white)
                          : null,
                    ),
                    const SizedBox(width: 10),
                    Text(
                      widget.choices[i],
                      style: theme.textTheme.bodyMedium?.copyWith(
                        fontWeight:
                            isSelected ? FontWeight.w600 : FontWeight.normal,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ),
        const SizedBox(height: 20),

        if (!_submitted)
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: _selected.isNotEmpty ? _submit : null,
              child: Text(
                _selected.isNotEmpty
                    ? '${_selected.length} seçim ile onayla'
                    : 'En az bir seçenek işaretleyin',
              ),
            ),
          ),

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
