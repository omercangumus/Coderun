import 'package:flutter/material.dart';

enum GhostMood { idle, happy, sad, thinking }

class GhostieImage extends StatelessWidget {
  final double size;
  final GhostMood mood;

  const GhostieImage({
    super.key,
    this.size = 100,
    this.mood = GhostMood.idle,
  });

  String get _assetPath {
    switch (mood) {
      case GhostMood.happy:
        return 'assets/images/ghostie/ghostie_very_happy.png';
      case GhostMood.sad:
        return 'assets/images/ghostie/ghostie_sad_wrong.png';
      case GhostMood.thinking:
        return 'assets/images/ghostie/ghostie_idle.png';
      case GhostMood.idle:
        return 'assets/images/ghostie/ghostie_idle.png';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      _assetPath,
      width: size,
      height: size,
      fit: BoxFit.contain,
    );
  }
}
