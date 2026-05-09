// Coderun Stitch Design System — Card Components

import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

/// Base card with Stitch styling — white bg, rounded corners, subtle border
class CoderunCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final Color? backgroundColor;
  final Color? borderColor;
  final double? borderRadius;
  final VoidCallback? onTap;
  final List<BoxShadow>? shadows;

  const CoderunCard({
    super.key,
    required this.child,
    this.padding,
    this.backgroundColor,
    this.borderColor,
    this.borderRadius,
    this.onTap,
    this.shadows,
  });

  @override
  Widget build(BuildContext context) {
    final card = Container(
      padding: padding ?? const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(
          borderRadius ?? AppSpacing.radiusXl,
        ),
        border: Border.all(
          color: borderColor ?? AppColors.outlineVariant,
          width: 1,
        ),
        boxShadow: shadows ??
            [
              BoxShadow(
                color: AppColors.onSurface.withValues(alpha: 0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
      ),
      child: child,
    );

    if (onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: card,
      );
    }
    return card;
  }
}

/// Highlighted card — primary color background (for active/featured items)
class CoderunHighlightCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;

  const CoderunHighlightCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return CoderunCard(
      padding: padding,
      backgroundColor: AppColors.primaryContainer,
      borderColor: AppColors.primaryContainer,
      onTap: onTap,
      shadows: [
        BoxShadow(
          color: AppColors.primary.withValues(alpha: 0.2),
          blurRadius: 12,
          offset: const Offset(0, 4),
        ),
      ],
      child: child,
    );
  }
}

/// Success card — green background (for completed/success states)
class CoderunSuccessCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;

  const CoderunSuccessCard({
    super.key,
    required this.child,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return CoderunCard(
      padding: padding,
      backgroundColor: AppColors.secondaryContainer.withValues(alpha: 0.3),
      borderColor: AppColors.secondaryFixedDim,
      child: child,
    );
  }
}

/// XP/Streak stat chip — compact inline stat display
class StatChip extends StatelessWidget {
  final IconData icon;
  final String value;
  final String? label;
  final Color? color;
  final Color? backgroundColor;

  const StatChip({
    super.key,
    required this.icon,
    required this.value,
    this.label,
    this.color,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    final chipColor = color ?? AppColors.primary;
    final bgColor = backgroundColor ?? chipColor.withValues(alpha: 0.1);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: chipColor),
          const SizedBox(width: 4),
          Text(
            value,
            style: TextStyle(
              fontFamily: 'Lexend',
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: chipColor,
            ),
          ),
          if (label != null) ...[
            const SizedBox(width: 2),
            Text(
              label!,
              style: TextStyle(
                fontFamily: 'Lexend',
                fontSize: 11,
                fontWeight: FontWeight.w400,
                color: chipColor.withValues(alpha: 0.8),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
