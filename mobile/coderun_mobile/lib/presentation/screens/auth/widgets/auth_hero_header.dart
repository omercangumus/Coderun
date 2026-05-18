// Auth hero header widget — gradient top section with Coderun logo and Ghostie mascot.

import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/assets/ghostie_assets.dart';
import '../../../widgets/ghostie_reaction.dart';

class AuthHeroHeader extends StatelessWidget {
  final GhostieState ghostieState;
  final String title;
  final String subtitle;

  const AuthHeroHeader({
    super.key,
    this.ghostieState = GhostieState.idle,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 16),
        // Logo
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Center(
                child: Text('🚀', style: TextStyle(fontSize: 18)),
              ),
            ),
            const SizedBox(width: 8),
            Text(
              AppConstants.appName,
              style: AppTextStyles.h2.copyWith(
                color: AppColors.primary,
                letterSpacing: 1,
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        // Ghostie mascot in circular container
        Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.12),
                blurRadius: 32,
                spreadRadius: 8,
              ),
            ],
          ),
          child: GhostieReaction(
            state: ghostieState,
            size: 160,
            preferAnimation: true,
          ),
        ),
        const SizedBox(height: 20),
        // Title
        Text(
          title,
          style: AppTextStyles.h2.copyWith(
            fontWeight: FontWeight.w800,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        // Subtitle
        Text(
          subtitle,
          style: AppTextStyles.bodySmall.copyWith(
            color: AppColors.onSurfaceVariant,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
