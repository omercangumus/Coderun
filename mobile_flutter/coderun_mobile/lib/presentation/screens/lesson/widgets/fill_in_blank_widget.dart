// Coderun mobile — boşluk doldurma widget'ı.
// Word bank chip'lerine dokunarak boşlukları doldurur.

import 'package:flutter/material.dart';

class FillInBlankWidget extends StatefulWidget {
  final String questionText;
  final String codeBlock;
  final List<String> wordBank;
  final String? hint;
  final ValueChanged<String> onAnswer;

  const FillInBlankWidget({
    super.key,
    required this.questionText,
    required this.codeBlock,
    required this.wordBank,
    this.hint,
    required this.onAnswer,
  });

  @override
  State<FillInBlankWidget> createState() => _FillInBlankWidgetState();
}

class _FillInBlankWidgetState extends State<FillInBlankWidget> {
  late List<String> _filledBlanks;
  late Set<int> _usedWords;
  bool _showHint = false;

  @override
  void initState() {
    super.initState();
    final blankCount = '___'.allMatches(widget.codeBlock).length;
    _filledBlanks = List.filled(blankCount, '');
    _usedWords = {};
  }

  void _handleWordTap(int wordIndex) {
    final firstEmpty = _filledBlanks.indexOf('');
    if (firstEmpty == -1 || _usedWords.contains(wordIndex)) return;

    setState(() {
      _filledBlanks[firstEmpty] = widget.wordBank[wordIndex];
      _usedWords.add(wordIndex);
    });

    if (_filledBlanks.every((b) => b.isNotEmpty)) {
      widget.onAnswer(_filledBlanks.join(','));
    }
  }

  void _handleBlankTap(int blankIndex) {
    if (_filledBlanks[blankIndex].isEmpty) return;
    final word = _filledBlanks[blankIndex];
    final wordIndex = widget.wordBank.indexOf(word);

    setState(() {
      _filledBlanks[blankIndex] = '';
      if (wordIndex != -1) _usedWords.remove(wordIndex);
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final parts = widget.codeBlock.split('___');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.questionText, style: theme.textTheme.titleMedium),
        const SizedBox(height: 16),

        // Code block with blanks
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: theme.colorScheme.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Wrap(
            children: _buildCodeParts(parts, theme),
          ),
        ),
        const SizedBox(height: 20),

        // Word bank
        Text('Kelime Bankası',
            style: theme.textTheme.labelSmall?.copyWith(
              letterSpacing: 1.2,
              fontWeight: FontWeight.w600,
            )),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: List.generate(widget.wordBank.length, (i) {
            final isUsed = _usedWords.contains(i);
            return GestureDetector(
              onTap: isUsed ? null : () => _handleWordTap(i),
              child: Chip(
                label: Text(widget.wordBank[i]),
                backgroundColor: isUsed
                    ? theme.colorScheme.surfaceContainerHighest
                    : theme.colorScheme.primaryContainer,
                labelStyle: TextStyle(
                  color: isUsed
                      ? theme.colorScheme.onSurfaceVariant.withValues(alpha: 0.4)
                      : theme.colorScheme.primary,
                  decoration: isUsed ? TextDecoration.lineThrough : null,
                  fontWeight: FontWeight.w600,
                ),
              ),
            );
          }),
        ),
        const SizedBox(height: 12),

        // Hint
        if (widget.hint != null)
          GestureDetector(
            onTap: () => setState(() => _showHint = !_showHint),
            child: Text(
              _showHint ? '💡 ${widget.hint}' : '💡 İpucu göster',
              style: TextStyle(
                color: theme.colorScheme.primary,
                fontSize: 13,
              ),
            ),
          ),
      ],
    );
  }

  List<Widget> _buildCodeParts(List<String> parts, ThemeData theme) {
    final widgets = <Widget>[];
    int blankIdx = 0;
    for (int i = 0; i < parts.length; i++) {
      widgets.add(Text(parts[i],
          style: TextStyle(
            fontFamily: 'monospace',
            fontSize: 14,
            color: theme.colorScheme.onSurface,
          )));
      if (i < parts.length - 1) {
        final idx = blankIdx++;
        final filled = _filledBlanks[idx];
        widgets.add(
          GestureDetector(
            onTap: () => _handleBlankTap(idx),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: filled.isNotEmpty
                    ? theme.colorScheme.primaryContainer
                    : theme.colorScheme.surfaceContainerHigh,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(
                  color: filled.isNotEmpty
                      ? theme.colorScheme.primary
                      : theme.colorScheme.outlineVariant,
                  style: filled.isNotEmpty ? BorderStyle.solid : BorderStyle.none,
                ),
              ),
              child: Text(
                filled.isNotEmpty ? filled : '___',
                style: TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: filled.isNotEmpty
                      ? theme.colorScheme.primary
                      : theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ),
        );
      }
    }
    return widgets;
  }
}
