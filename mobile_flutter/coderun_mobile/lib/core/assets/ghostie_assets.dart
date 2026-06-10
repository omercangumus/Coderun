// Ghostie Mascot Asset Definitions

enum GhostieState {
  idle,
  correct,
  wrong,
  hint,
  celebrating,
  thinking,
  reinforcement,
  angry,
  success,
  veryHappy,
}

class GhostieAssets {
  // Static Images
  static const String imageIdle = 'assets/images/ghostie/ghostie_idle.png';
  static const String imageSadWrong = 'assets/images/ghostie/ghostie_sad_wrong.png';
  static const String imageAngry = 'assets/images/ghostie/ghostie_angry.png';
  static const String imageSuccessCoder = 'assets/images/ghostie/ghostie_success_coder.png';
  static const String imageVeryHappy = 'assets/images/ghostie/ghostie_very_happy.png';

  // Animations (MP4)
  static const String animationIdle = 'assets/animations/ghostie/ghostie_idle.mp4';
  static const String animationSadWrong = 'assets/animations/ghostie/ghostie_sad_wrong.mp4';
  static const String animationAngry = 'assets/animations/ghostie/ghostie_angry.mp4';
  static const String animationSuccessCoder = 'assets/animations/ghostie/ghostie_success_coder.mp4';
  static const String animationVeryHappy = 'assets/animations/ghostie/ghostie_very_happy.mp4';

  /// Get the appropriate animation file for the given state
  static String animationForState(GhostieState state) {
    switch (state) {
      case GhostieState.idle:
      case GhostieState.thinking:
      case GhostieState.hint:
        return animationIdle;
      case GhostieState.wrong:
      case GhostieState.reinforcement:
        return animationSadWrong;
      case GhostieState.angry:
        return animationAngry;
      case GhostieState.correct:
      case GhostieState.success:
        return animationSuccessCoder;
      case GhostieState.celebrating:
      case GhostieState.veryHappy:
        return animationVeryHappy;
    }
  }

  /// Get the appropriate fallback image file for the given state
  static String imageFallbackForState(GhostieState state) {
    switch (state) {
      case GhostieState.idle:
      case GhostieState.thinking:
      case GhostieState.hint:
        return imageIdle;
      case GhostieState.wrong:
      case GhostieState.reinforcement:
        return imageSadWrong;
      case GhostieState.angry:
        return imageAngry;
      case GhostieState.correct:
      case GhostieState.success:
        return imageSuccessCoder;
      case GhostieState.celebrating:
      case GhostieState.veryHappy:
        return imageVeryHappy;
    }
  }
}
