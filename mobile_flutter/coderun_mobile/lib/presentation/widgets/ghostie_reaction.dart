import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import '../../../core/assets/ghostie_assets.dart';
import '../../../core/theme/app_spacing.dart';

/// Küçük boyutlarda ve düşük performanslı cihazlarda video yerine PNG kullan.
const double _kVideoMinSize = 96.0;

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
  GhostieState? _loadedState;

  bool get _useVideo =>
      widget.preferAnimation && widget.size >= _kVideoMinSize;

  @override
  void initState() {
    super.initState();
    if (_useVideo) _initVideo();
  }

  @override
  void didUpdateWidget(GhostieReaction oldWidget) {
    super.didUpdateWidget(oldWidget);
    final shouldUseVideo = _useVideo;
    final oldShouldUseVideo =
        oldWidget.preferAnimation && oldWidget.size >= _kVideoMinSize;

    if (!shouldUseVideo) {
      _disposeVideo();
      return;
    }

    if (!oldShouldUseVideo || oldWidget.state != widget.state) {
      _initVideo();
    }
  }

  Future<void> _initVideo() async {
    if (!_useVideo) return;
    if (_loadedState == widget.state && _isVideoInitialized) return;

    await _disposeVideo();

    final assetPath = GhostieAssets.animationForState(widget.state);
    final controller = VideoPlayerController.asset(assetPath);

    try {
      await controller.initialize();
      await controller.setLooping(true);
      await controller.setVolume(0.0);
      if (!mounted || !_useVideo) {
        await controller.dispose();
        return;
      }
      _videoController = controller;
      _loadedState = widget.state;
      setState(() => _isVideoInitialized = true);
      controller.play();
    } catch (e) {
      debugPrint('Ghostie video init failed for $assetPath: $e');
      await controller.dispose();
      if (mounted) {
        setState(() {
          _isVideoInitialized = false;
          _loadedState = null;
        });
      }
    }
  }

  Future<void> _disposeVideo() async {
    final controller = _videoController;
    _videoController = null;
    _isVideoInitialized = false;
    _loadedState = null;
    if (controller != null) {
      await controller.dispose();
    }
  }

  @override
  void dispose() {
    _videoController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final imageFallbackPath = GhostieAssets.imageFallbackForState(widget.state);

    Widget visualWidget;

    if (_useVideo && _isVideoInitialized && _videoController != null) {
      visualWidget = RepaintBoundary(
        child: SizedBox(
          width: widget.size,
          height: widget.size,
          child: FittedBox(
            fit: BoxFit.contain,
            child: SizedBox(
              width: _videoController!.value.size.width,
              height: _videoController!.value.size.height,
              child: VideoPlayer(_videoController!),
            ),
          ),
        ),
      );
    } else {
      visualWidget = Image.asset(
        imageFallbackPath,
        width: widget.size,
        height: widget.size,
        fit: BoxFit.contain,
        gaplessPlayback: true,
        errorBuilder: (_, __, ___) => SizedBox(
          width: widget.size,
          height: widget.size,
          child: Icon(
            Icons.emoji_emotions_outlined,
            size: widget.size * 0.5,
            color: colorScheme.onSurfaceVariant,
          ),
        ),
      );
    }

    final showGlow = widget.size >= 64;
    final glowingVisual = showGlow
        ? Container(
            decoration: BoxDecoration(
              color: Colors.transparent,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: colorScheme.primary.withValues(alpha: 0.12),
                  blurRadius: 16,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: visualWidget,
          )
        : visualWidget;

    if (widget.message == null || widget.message!.isEmpty) {
      return glowingVisual;
    }

    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
        border: Border.all(color: colorScheme.primary.withValues(alpha: 0.15)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          glowingVisual,
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Ghostie AI',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: colorScheme.primary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  widget.message!,
                  maxLines: 4,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 13,
                    color: colorScheme.onSurfaceVariant,
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
