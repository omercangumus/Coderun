import 'package:flutter/material.dart';

class SkeletonLoader extends StatefulWidget {
  final double width;
  final double height;
  final double borderRadius;

  const SkeletonLoader({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius = 4,
  });

  @override
  State<SkeletonLoader> createState() => _SkeletonLoaderState();
}

class _SkeletonLoaderState extends State<SkeletonLoader>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacityAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    _opacityAnim = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.3, end: 0.7), weight: 1),
      TweenSequenceItem(tween: Tween(begin: 0.7, end: 0.3), weight: 1),
    ]).animate(_controller);

    _controller.repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _opacityAnim,
      builder: (context, child) {
        return Opacity(
          opacity: _opacityAnim.value,
          child: child,
        );
      },
      child: Container(
        width: widget.width,
        height: widget.height,
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: BorderRadius.circular(widget.borderRadius),
        ),
      ),
    );
  }
}

// ─── ModuleCard Skeleton ──────────────────────────────────────────────────────

class ModuleCardSkeleton extends StatelessWidget {
  const ModuleCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: const Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Başlık
            SkeletonLoader(width: 160, height: 18, borderRadius: 4),
            SizedBox(height: 8),
            // Açıklama satırı 1
            SkeletonLoader(width: double.infinity, height: 14, borderRadius: 4),
            SizedBox(height: 4),
            // Açıklama satırı 2
            SkeletonLoader(width: 200, height: 14, borderRadius: 4),
            SizedBox(height: 12),
            // Progress bar
            SkeletonLoader(width: double.infinity, height: 8, borderRadius: 4),
            SizedBox(height: 8),
            // Alt bilgi
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                SkeletonLoader(width: 80, height: 12, borderRadius: 4),
                SkeletonLoader(width: 60, height: 12, borderRadius: 4),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ─── LessonTile Skeleton ──────────────────────────────────────────────────────

class LessonTileSkeleton extends StatelessWidget {
  const LessonTileSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: const Row(
        children: [
          // İkon alanı
          SkeletonLoader(width: 40, height: 40, borderRadius: 20),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SkeletonLoader(width: 140, height: 14, borderRadius: 4),
                SizedBox(height: 6),
                SkeletonLoader(width: 100, height: 12, borderRadius: 4),
              ],
            ),
          ),
          SkeletonLoader(width: 50, height: 12, borderRadius: 4),
        ],
      ),
    );
  }
}
