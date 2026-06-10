// Coderun mobile — hata bulma widget'ı.
// Kod satırlarına dokunarak hatayı seç, sonra düzeltmeyi seç.

import 'package:flutter/material.dart';

class SpotTheBugWidget extends StatefulWidget {
  final String questionText;
  final String codeBlock;
  final List<String> fixOptions;
  final String? hint;
  final ValueChanged<String> onAnswer;

  const SpotTheBugWidget({
    super.key,
    required this.questionText,
    required this.codeBlock,
    required this.fixOptions,
    this.hint,
    required this.onAnswer,
  });

  @override
  State<SpotTheBugWidget> createState() => _SpotTheBugWidgetState();
}

class _SpotTheBugWidgetState extends State<SpotTheBugWidget> {
  int? _selectedLine;
  int? _selectedFix;
  bool _showHint = false;

  void _handleLineTap(int lineIndex) {
    if (_selectedLine != null) return;
    setState(() => _selectedLine = lineIndex);
  }

  void _handleFixTap(int fixIndex) {
    setState(() => _selectedFix = fixIndex);
    if (_selectedLine != null) {
      widget.onAnswer('$_selectedLine|${widget.fixOptions[fixIndex]}');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final lines = widget.codeBlock.split('\n');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.questionText, style: theme.textTheme.titleMedium),
        const SizedBox(height: 16),

        // Code block header
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: theme.colorScheme.outlineVariant),
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            children: [
              Container(
                width: double.infinity,
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                color: theme.colorScheme.inverseSurface,
                child: Text(
                  '🐛 Hatalı satırı tıklayın',
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: theme.colorScheme.onInverseSurface,
                  ),
                ),
              ),
              // Code lines
              ...lines.asMap().entries.map((entry) {
                final isSelected = _selectedLine == entry.key;
                return GestureDetector(
                  onTap: _selectedLine == null
                      ? () => _handleLineTap(entry.key)
                      : null,
                  child: Container(
                    width: double.infinity,
                    color: isSelected
                        ? theme.colorScheme.errorContainer
                        : theme.colorScheme.surfaceContainerHighest,
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 40,
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: theme.colorScheme.surfaceContainerLow,
                            border: Border(
                              right: BorderSide(
                                  color: theme.colorScheme.outlineVariant),
                            ),
                          ),
                          child: Text(
                            '${entry.key + 1}',
                            style: TextStyle(
                              fontSize: 12,
                              color: theme.colorScheme.onSurfaceVariant,
                              fontFamily: 'monospace',
                            ),
                          ),
                        ),
                        Expanded(
                          child: Container(
                            decoration: isSelected
                                ? BoxDecoration(
                                    border: Border(
                                      left: BorderSide(
                                          color: theme.colorScheme.error,
                                          width: 4),
                                    ),
                                  )
                                : null,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 6),
                            child: Text(
                              entry.value.isEmpty ? ' ' : entry.value,
                              style: TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 13,
                                fontWeight: isSelected ? FontWeight.bold : null,
                                color: isSelected
                                    ? theme.colorScheme.error
                                    : theme.colorScheme.onSurface,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Fix options
        if (_selectedLine != null && _selectedFix == null) ...[
          Text(
            'Satır ${_selectedLine! + 1} için doğru düzeltmeyi seçin:',
            style: theme.textTheme.labelSmall?.copyWith(
              letterSpacing: 1.2,
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 12),
          ...widget.fixOptions.asMap().entries.map((entry) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: GestureDetector(
                onTap: () => _handleFixTap(entry.key),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: theme.colorScheme.outlineVariant),
                  ),
                  child: Text(
                    entry.value,
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 14,
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
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
