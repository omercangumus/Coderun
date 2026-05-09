// Coderun mobile — Ghostie reaction widget.
// Basit, yeniden kullanılabilir, statik emoji/durum gösterimi.

import 'package:flutter/material.dart';

enum GhostieState {
  happy,
  sad,
  thinking,
  celebrating,
  encouraging,
  neutral,
}

class GhostieReactionWidget extends StatelessWidget {
  final GhostieState state;
  final String? message;
  final double size;

  const GhostieReactionWidget({
    super.key,
    required this.state,
    this.message,
    this.size = 48,
  });

  String get _emoji {
    switch (state) {
      case GhostieState.happy:
        return '😊';
      case GhostieState.sad:
        return '😔';
      case GhostieState.thinking:
        return '🤔';
      case GhostieState.celebrating:
        return '🎉';
      case GhostieState.encouraging:
        return '💪';
      case GhostieState.neutral:
        return '👻';
    }
  }

  Color _bgColor(ThemeData theme) {
    switch (state) {
      case GhostieState.happy:
      case GhostieState.celebrating:
        return theme.colorScheme.secondaryContainer;
      case GhostieState.sad:
        return theme.colorScheme.errorContainer;
      case GhostieState.thinking:
        return theme.colorScheme.tertiaryContainer;
      case GhostieState.encouraging:
        return theme.colorScheme.primaryContainer;
      case GhostieState.neutral:
        return theme.colorScheme.surfaceContainerHighest;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: _bgColor(theme),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              _emoji,
              style: TextStyle(fontSize: size * 0.5),
            ),
          ),
        ),
        if (message != null) ...[
          const SizedBox(width: 12),
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: _bgColor(theme).withValues(alpha: 0.5),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                message!,
                style: theme.textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
        ],
      ],
    );
  }
}
