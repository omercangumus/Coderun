import 'package:flutter/material.dart';
import '../../../../core/assets/ghostie_assets.dart' as assets;
import '../../../widgets/ghostie_reaction.dart';

// Aliasing the state for backward compatibility if needed, 
// but it's better to use the new GhostieReaction directly.
// We'll wrap the new GhostieReaction here.

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
    this.size = 120,
  });

  assets.GhostieState _mapState() {
    switch (state) {
      case GhostieState.happy:
      case GhostieState.encouraging:
        return assets.GhostieState.success;
      case GhostieState.sad:
        return assets.GhostieState.wrong;
      case GhostieState.thinking:
        return assets.GhostieState.thinking;
      case GhostieState.celebrating:
        return assets.GhostieState.veryHappy;
      case GhostieState.neutral:
        return assets.GhostieState.idle;
    }
  }

  @override
  Widget build(BuildContext context) {
    return GhostieReaction(
      state: _mapState(),
      message: message,
      size: size,
      preferAnimation: true,
    );
  }
}

