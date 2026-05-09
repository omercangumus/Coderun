import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/assets/ghostie_assets.dart';
import 'ghostie_reaction.dart';

class CoderunLoadingView extends StatelessWidget {
  final String message;
  final double? progress;

  const CoderunLoadingView({
    super.key,
    this.message = 'Hazırlanıyor...',
    this.progress,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Ghostie Idle Animation
          const GhostieReaction(
            state: GhostieState.idle,
            preferAnimation: true,
            size: 150.0,
          ),
          const SizedBox(height: AppSpacing.xl),
          // Message
          Text(
            message,
            style: const TextStyle(
              fontFamily: 'PlusJakartaSans',
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.onSurface,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.lg),
          // Progress Bar
          SizedBox(
            width: 200,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
              child: LinearProgressIndicator(
                value: progress,
                minHeight: 6,
                backgroundColor: AppColors.surfaceContainerHighest,
                valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
