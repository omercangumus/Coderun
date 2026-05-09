import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import '../../../core/assets/ghostie_assets.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';

class GhostieReaction extends StatefulWidget {
  final GhostieState state;
  final String? message;
  final double size;
  final bool preferAnimation;

  const GhostieReaction({
    super.key,
    required this.state,
    this.message,
    this.size = 120.0,
    this.preferAnimation = true,
  });

  @override
  State<GhostieReaction> createState() => _GhostieReactionState();
}

class _GhostieReactionState extends State<GhostieReaction> {
  VideoPlayerController? _videoController;
  bool _isVideoInitialized = false;

  @override
  void initState() {
    super.initState();
    _initVideo();
  }

  @override
  void didUpdateWidget(GhostieReaction oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.state != widget.state || oldWidget.preferAnimation != widget.preferAnimation) {
      _initVideo();
    }
  }

  Future<void> _initVideo() async {
    // Dispose previous controller
    if (_videoController != null) {
      await _videoController!.dispose();
      _videoController = null;
    }
    _isVideoInitialized = false;

    if (!widget.preferAnimation) {
      if (mounted) setState(() {});
      return;
    }

    final assetPath = GhostieAssets.animationForState(widget.state);
    
    _videoController = VideoPlayerController.asset(assetPath);
    
    try {
      await _videoController!.initialize();
      await _videoController!.setLooping(true);
      await _videoController!.setVolume(0.0);
      if (mounted) {
        setState(() {
          _isVideoInitialized = true;
        });
        _videoController!.play();
      }
    } catch (e) {
      debugPrint("Ghostie video initialization failed for $assetPath: $e");
      if (mounted) {
        setState(() {
          _isVideoInitialized = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _videoController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final imageFallbackPath = GhostieAssets.imageFallbackForState(widget.state);

    Widget visualWidget;

    if (widget.preferAnimation && _isVideoInitialized && _videoController != null) {
      visualWidget = SizedBox(
        width: widget.size,
        height: widget.size,
        child: AspectRatio(
          aspectRatio: _videoController!.value.aspectRatio,
          child: VideoPlayer(_videoController!),
        ),
      );
    } else {
      // Fallback to static image
      visualWidget = Image.asset(
        imageFallbackPath,
        width: widget.size,
        height: widget.size,
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) => SizedBox(
          width: widget.size,
          height: widget.size,
          child: Center(
            child: Icon(Icons.error_outline, size: widget.size * 0.5, color: Colors.grey),
          ),
        ),
      );
    }

    // Apply purple glow to the visual widget
    final glowingVisual = Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.15),
            blurRadius: 24,
            spreadRadius: 8,
          )
        ],
      ),
      child: visualWidget,
    );

    if (widget.message == null || widget.message!.isEmpty) {
      return glowingVisual;
    }

    // With message bubble
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: const [
            AppColors.primaryFixed,
            AppColors.surfaceContainerLowest,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          glowingVisual,
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Ghostie AI',
                  style: TextStyle(
                    fontFamily: 'PlusJakartaSans',
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  widget.message!,
                  style: const TextStyle(
                    fontFamily: 'Lexend',
                    fontSize: 13,
                    color: AppColors.onSurfaceVariant,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
