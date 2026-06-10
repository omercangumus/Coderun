// Ghostie — Coderun's mascot widget
// Used across welcome, learning path, mentor, and feedback screens

import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/assets/ghostie_assets.dart';
import 'ghostie_reaction.dart';

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

  @override
  Widget build(BuildContext context) {
    GhostieState state;
    switch (mood) {
      case GhostieMood.happy:
        state = GhostieState.idle;
        break;
      case GhostieMood.thinking:
        state = GhostieState.thinking;
        break;
      case GhostieMood.celebrating:
        state = GhostieState.celebrating;
        break;
      case GhostieMood.helping:
        state = GhostieState.hint;
        break;
      case GhostieMood.neutral:
        state = GhostieState.idle;
        break;
    }

    return GhostieReaction(
      state: state,
      size: _dimension,
      preferAnimation: showGlow,
    );
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
    GhostieState state;
    switch (mood) {
      case GhostieMood.happy:
        state = GhostieState.idle;
        break;
      case GhostieMood.thinking:
        state = GhostieState.thinking;
        break;
      case GhostieMood.celebrating:
        state = GhostieState.celebrating;
        break;
      case GhostieMood.helping:
        state = GhostieState.hint;
        break;
      case GhostieMood.neutral:
        state = GhostieState.idle;
        break;
    }

    double size;
    switch (ghostSize) {
      case GhostieSize.small:
        size = 40;
        break;
      case GhostieSize.medium:
        size = 64;
        break;
      case GhostieSize.large:
        size = 96;
        break;
      case GhostieSize.xlarge:
        size = 140;
        break;
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GhostieReaction(state: state, size: size, preferAnimation: false),
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
