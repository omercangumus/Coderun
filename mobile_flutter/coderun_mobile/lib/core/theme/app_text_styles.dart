// Coderun Stitch Design System — Typography
// Fonts: Plus Jakarta Sans (headings), Lexend (body/buttons), Space Grotesk (labels)

import 'package:flutter/material.dart';
import 'app_colors.dart';

abstract class AppTextStyles {
  // === HEADINGS (Plus Jakarta Sans) ===
  static const TextStyle h1 = TextStyle(
    fontFamily: 'PlusJakartaSans',
    fontSize: 40,
    fontWeight: FontWeight.w800,
    height: 1.2,
    color: AppColors.onSurface,
  );

  static const TextStyle h2 = TextStyle(
    fontFamily: 'PlusJakartaSans',
    fontSize: 32,
    fontWeight: FontWeight.w700,
    height: 1.3,
    color: AppColors.onSurface,
  );

  static const TextStyle h3 = TextStyle(
    fontFamily: 'PlusJakartaSans',
    fontSize: 24,
    fontWeight: FontWeight.w700,
    height: 1.3,
    color: AppColors.onSurface,
  );

  // === BODY (Lexend) ===
  static const TextStyle bodyLarge = TextStyle(
    fontFamily: 'Lexend',
    fontSize: 18,
    fontWeight: FontWeight.w400,
    height: 1.6,
    color: AppColors.onSurface,
  );

  static const TextStyle bodyMedium = TextStyle(
    fontFamily: 'Lexend',
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.onSurface,
  );

  static const TextStyle bodySmall = TextStyle(
    fontFamily: 'Lexend',
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.onSurfaceVariant,
  );

  // === BUTTON (Lexend) ===
  static const TextStyle button = TextStyle(
    fontFamily: 'Lexend',
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.0,
    color: AppColors.onPrimary,
  );

  static const TextStyle buttonSmall = TextStyle(
    fontFamily: 'Lexend',
    fontSize: 14,
    fontWeight: FontWeight.w600,
    height: 1.0,
    color: AppColors.onPrimary,
  );

  // === LABEL (Space Grotesk) ===
  static const TextStyle labelCaps = TextStyle(
    fontFamily: 'SpaceGrotesk',
    fontSize: 14,
    fontWeight: FontWeight.w600,
    height: 1.0,
    letterSpacing: 0.7,
    color: AppColors.onSurfaceVariant,
  );

  static const TextStyle labelSmall = TextStyle(
    fontFamily: 'SpaceGrotesk',
    fontSize: 12,
    fontWeight: FontWeight.w600,
    height: 1.0,
    letterSpacing: 0.5,
    color: AppColors.onSurfaceVariant,
  );

  // === LEGACY ALIASES ===
  static const TextStyle heading1 = h2;
  static const TextStyle heading2 = h3;
  static const TextStyle body = bodyMedium;
  static const TextStyle link = TextStyle(
    fontFamily: 'Lexend',
    fontSize: 14,
    fontWeight: FontWeight.w500,
    color: AppColors.primary,
    decoration: TextDecoration.underline,
  );
}
