// Coderun Stitch Design System — Color Palette
// Based on Material Design 3 color scheme from approved Stitch designs

import 'package:flutter/material.dart';

abstract class AppColors {
  // === PRIMARY (Blue) ===
  static const Color primary = Color(0xFF3D4AD8);
  static const Color primaryContainer = Color(0xFF5865F2);
  static const Color primaryFixed = Color(0xFFE0E0FF);
  static const Color primaryFixedDim = Color(0xFFBEC2FF);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color onPrimaryContainer = Color(0xFFFFFFFF);
  static const Color inversePrimary = Color(0xFFBEC2FF);

  // === SECONDARY (Green — success/progress) ===
  static const Color secondary = Color(0xFF006D37);
  static const Color secondaryContainer = Color(0xFF6BFE9C);
  static const Color secondaryFixed = Color(0xFF6BFE9C);
  static const Color secondaryFixedDim = Color(0xFF4AE183);
  static const Color onSecondary = Color(0xFFFFFFFF);
  static const Color onSecondaryContainer = Color(0xFF00743A);

  // === TERTIARY (Purple — badges/achievements) ===
  static const Color tertiary = Color(0xFF81419C);
  static const Color tertiaryContainer = Color(0xFF9C5AB7);
  static const Color tertiaryFixed = Color(0xFFF8D8FF);
  static const Color tertiaryFixedDim = Color(0xFFEBB2FF);
  static const Color onTertiary = Color(0xFFFFFFFF);
  static const Color onTertiaryContainer = Color(0xFFFFFFFF);

  // === SURFACE ===
  static const Color background = Color(0xFFF7FAFD);
  static const Color surface = Color(0xFFF7FAFD);
  static const Color surfaceBright = Color(0xFFF7FAFD);
  static const Color surfaceDim = Color(0xFFD7DADE);
  static const Color surfaceContainerLowest = Color(0xFFFFFFFF);
  static const Color surfaceContainerLow = Color(0xFFF1F4F8);
  static const Color surfaceContainer = Color(0xFFEBEEF2);
  static const Color surfaceContainerHigh = Color(0xFFE5E8EC);
  static const Color surfaceContainerHighest = Color(0xFFE0E3E7);
  static const Color surfaceVariant = Color(0xFFE0E3E7);
  static const Color surfaceTint = Color(0xFF3F4CDA);

  // === ON SURFACE ===
  static const Color onSurface = Color(0xFF181C1F);
  static const Color onSurfaceVariant = Color(0xFF454655);
  static const Color onBackground = Color(0xFF181C1F);
  static const Color outline = Color(0xFF767686);
  static const Color outlineVariant = Color(0xFFC6C5D7);

  // === INVERSE ===
  static const Color inverseSurface = Color(0xFF2D3134);
  static const Color inverseOnSurface = Color(0xFFEEF1F5);

  // === ERROR ===
  static const Color error = Color(0xFFBA1A1A);
  static const Color errorContainer = Color(0xFFFFDAD6);
  static const Color onError = Color(0xFFFFFFFF);
  static const Color onErrorContainer = Color(0xFF93000A);

  // === GAMIFICATION ===
  static const Color xpGold = Color(0xFFFFD700);
  static const Color streakOrange = Color(0xFFFF6B35);
  static const Color streakFire = Color(0xFFFF4500);
  static const Color badgePurple = Color(0xFF9C27B0);
  static const Color diamondBlue = Color(0xFF00B4D8);
  static const Color goldLeague = Color(0xFFFFB300);
  static const Color silverLeague = Color(0xFF9E9E9E);

  // === NODE STATES (Learning Path) ===
  static const Color nodeCompleted = Color(0xFF4AE183);
  static const Color nodeActive = Color(0xFF5865F2);
  static const Color nodeLocked = Color(0xFFE0E3E7);
  static const Color nodeReviewDue = Color(0xFFFF9800);
  static const Color nodeCheckpoint = Color(0xFFFFD700);
  static const Color nodeMiniProject = Color(0xFF9C5AB7);

  // === LEGACY ALIASES (for backward compat) ===
  static const Color white = surfaceContainerLowest;
  static const Color black = onSurface;
  static const Color grey = outline;
  static const Color greyLight = surfaceContainerLow;
  static const Color greyDark = onSurfaceVariant;
  static const Color success = secondary;
  static const Color warning = Color(0xFFFF9800);
  static const Color info = primary;
  static const Color textPrimary = onSurface;
  static const Color textSecondary = onSurfaceVariant;
  static const Color highlight = primaryContainer;
  static const Color accent = tertiary;
}
