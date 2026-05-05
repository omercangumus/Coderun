// Ghostie — Coderun's mascot widget
// Used across welcome, learning path, mentor, and feedback screens

import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

enum GhostieSize { small, medium, large, xlarge }

enum GhostieMood { happy, thinking, celebrating, helping, neutral }

class GhostieAvatar extends StatelessWidget {
  final GhostieSize size;
  final GhostieMood mood;
  final bool showGlow;

  const GhostieAvatar({
    super.key,
    this.size = GhostieSize.medium,
    this.mood = GhostieMood.happy,
    this.showGlow = false,
  });

  double get _dimension {
    switch (size) {
      case GhostieSize.small:
        return 40;
      case GhostieSize.medium:
        return 64;
      case GhostieSize.large:
        return 96;
      case GhostieSize.xlarge:
        return 140;
    }
  }

  String get _emoji {
    switch (mood) {
      case GhostieMood.happy:
        return '👻';
      case GhostieMood.thinking:
        return '🤔';
      case GhostieMood.celebrating:
        return '🎉';
      case GhostieMood.helping:
        return '💡';
      case GhostieMood.neutral:
        return '👻';
    }
  }

  @override
  Widget build(BuildContext context) {
    final dim = _dimension;
    final fontSize = dim * 0.55;

    Widget ghost = Container(
      width: dim,
      height: dim,
      decoration: BoxDecoration(
        color: AppColors.primaryFixed,
        shape: BoxShape.circle,
        boxShadow: showGlow
            ? [
                BoxShadow(
                  color: AppColors.primary.withOpacity(0.3),
                  blurRadius: 20,
                  spreadRadius: 4,
                ),
              ]
            : null,
      ),
      child: Center(
        child: Text(
          _emoji,
          style: TextStyle(fontSize: fontSize),
          textAlign: TextAlign.center,
        ),
      ),
    );

    return ghost;
  }
}

/// Ghostie speech bubble — used in learning path and feedback screens
class GhostieSpeechBubble extends StatelessWidget {
  final String message;
  final GhostieSize ghostSize;
  final GhostieMood mood;

  const GhostieSpeechBubble({
    super.key,
    required this.message,
    this.ghostSize = GhostieSize.small,
    this.mood = GhostieMood.helping,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GhostieAvatar(size: ghostSize, mood: mood),
        const SizedBox(width: 8),
        Flexible(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.primaryFixed,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(4),
                topRight: Radius.circular(16),
                bottomLeft: Radius.circular(16),
                bottomRight: Radius.circular(16),
              ),
            ),
            child: Text(
              message,
              style: const TextStyle(
                fontFamily: 'Lexend',
                fontSize: 13,
                fontWeight: FontWeight.w400,
                color: AppColors.onSurface,
                height: 1.4,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
