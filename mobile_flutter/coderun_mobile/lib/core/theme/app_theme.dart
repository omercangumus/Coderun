// Coderun Stitch Design System — Theme
// Light theme matching approved Stitch designs

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';
import 'app_spacing.dart';

abstract class AppTheme {
  static ThemeData _buildTheme(ColorScheme colorScheme, Color scaffoldBackgroundColor) {
    final base = ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: scaffoldBackgroundColor,
      fontFamily: 'Lexend',
      appBarTheme: AppBarTheme(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: colorScheme.brightness == Brightness.dark 
            ? colorScheme.surface 
            : AppColors.surfaceContainerLowest,
        foregroundColor: colorScheme.onSurface,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontFamily: 'PlusJakartaSans',
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: colorScheme.onSurface,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: colorScheme.primary,
          foregroundColor: colorScheme.onPrimary,
          minimumSize: const Size(double.infinity, AppSpacing.buttonHeight),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
          ),
          elevation: 0,
          textStyle: const TextStyle(
            fontFamily: 'Lexend',
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: colorScheme.primary,
          minimumSize: const Size(double.infinity, AppSpacing.buttonHeight),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
          ),
          side: BorderSide(color: colorScheme.primary, width: 1.5),
          textStyle: const TextStyle(
            fontFamily: 'Lexend',
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: colorScheme.primary,
          textStyle: const TextStyle(
            fontFamily: 'Lexend',
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: colorScheme.brightness == Brightness.dark 
            ? colorScheme.surface 
            : AppColors.surfaceContainerLowest,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
          borderSide: BorderSide(color: colorScheme.outlineVariant),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
          borderSide: BorderSide(color: colorScheme.outlineVariant),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
          borderSide: BorderSide(color: colorScheme.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
          borderSide: BorderSide(color: colorScheme.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
          borderSide: BorderSide(color: colorScheme.error, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.md,
        ),
        hintStyle: TextStyle(
          fontFamily: 'Lexend',
          color: colorScheme.outline,
          fontSize: 16,
        ),
        labelStyle: TextStyle(
          fontFamily: 'Lexend',
          color: colorScheme.onSurfaceVariant,
          fontSize: 16,
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: colorScheme.brightness == Brightness.dark 
            ? colorScheme.surface 
            : AppColors.surfaceContainerLowest,
        shape: RoundedRectangleBorder(
          borderRadius: const BorderRadius.all(Radius.circular(AppSpacing.radiusXl)),
          side: BorderSide(color: colorScheme.outlineVariant, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: colorScheme.brightness == Brightness.dark 
            ? colorScheme.surface 
            : AppColors.surfaceContainerLow,
        selectedColor: colorScheme.brightness == Brightness.dark 
            ? colorScheme.primary.withValues(alpha: 0.2) 
            : AppColors.primaryFixed,
        labelStyle: const TextStyle(
          fontFamily: 'Lexend',
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
        ),
        side: BorderSide.none,
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: colorScheme.brightness == Brightness.dark 
            ? colorScheme.surface 
            : AppColors.surfaceContainerLowest,
        selectedItemColor: colorScheme.primary,
        unselectedItemColor: colorScheme.outline,
        elevation: 0,
        type: BottomNavigationBarType.fixed,
        selectedLabelStyle: const TextStyle(
          fontFamily: 'Lexend',
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: const TextStyle(
          fontFamily: 'Lexend',
          fontSize: 12,
          fontWeight: FontWeight.w400,
        ),
      ),
      dividerTheme: DividerThemeData(
        color: colorScheme.outlineVariant,
        thickness: 1,
        space: 0,
      ),
      progressIndicatorTheme: ProgressIndicatorThemeData(
        color: colorScheme.primary,
        linearTrackColor: colorScheme.brightness == Brightness.dark 
            ? colorScheme.primary.withValues(alpha: 0.2) 
            : AppColors.primaryFixed,
        circularTrackColor: colorScheme.brightness == Brightness.dark 
            ? colorScheme.primary.withValues(alpha: 0.2) 
            : AppColors.primaryFixed,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: colorScheme.inverseSurface,
        contentTextStyle: TextStyle(
          fontFamily: 'Lexend',
          color: colorScheme.onInverseSurface,
          fontSize: 14,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        ),
        behavior: SnackBarBehavior.floating,
      ),
    );

    final textTheme = GoogleFonts.lexendTextTheme(base.textTheme).apply(
      bodyColor: colorScheme.onSurface,
      displayColor: colorScheme.onSurface,
    );

    return base.copyWith(
      textTheme: textTheme,
      primaryTextTheme: textTheme,
      appBarTheme: base.appBarTheme.copyWith(
        titleTextStyle: GoogleFonts.plusJakartaSans(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: colorScheme.onSurface,
        ),
      ),
    );
  }

  static ThemeData get lightTheme => _buildTheme(
        const ColorScheme(
          brightness: Brightness.light,
          primary: AppColors.primary,
          onPrimary: AppColors.onPrimary,
          primaryContainer: AppColors.primaryContainer,
          onPrimaryContainer: AppColors.onPrimaryContainer,
          secondary: AppColors.secondary,
          onSecondary: AppColors.onSecondary,
          secondaryContainer: AppColors.secondaryContainer,
          onSecondaryContainer: AppColors.onSecondaryContainer,
          tertiary: AppColors.tertiary,
          onTertiary: AppColors.onTertiary,
          tertiaryContainer: AppColors.tertiaryContainer,
          onTertiaryContainer: AppColors.onTertiaryContainer,
          error: AppColors.error,
          onError: AppColors.onError,
          errorContainer: AppColors.errorContainer,
          onErrorContainer: AppColors.onErrorContainer,
          surface: AppColors.surface,
          onSurface: AppColors.onSurface,
          surfaceContainerHighest: AppColors.surfaceContainerHighest,
          onSurfaceVariant: AppColors.onSurfaceVariant,
          outline: AppColors.outline,
          outlineVariant: AppColors.outlineVariant,
          inverseSurface: AppColors.inverseSurface,
          onInverseSurface: AppColors.inverseOnSurface,
          inversePrimary: AppColors.inversePrimary,
          surfaceTint: AppColors.surfaceTint,
        ),
        AppColors.background,
      );

  static ThemeData get darkTheme => _buildTheme(
        const ColorScheme(
          brightness: Brightness.dark,
          primary: Color(0xFF5865F2),
          onPrimary: Color(0xFFFFFFFF),
          primaryContainer: Color(0xFF3D4AD8),
          onPrimaryContainer: Color(0xFFBEC2FF),
          secondary: Color(0xFF4AE183),
          onSecondary: Color(0xFF000000),
          secondaryContainer: Color(0xFF004D23),
          onSecondaryContainer: Color(0xFF6BFE9C),
          tertiary: Color(0xFFEBB2FF),
          onTertiary: Color(0xFF000000),
          tertiaryContainer: Color(0xFF81419C),
          onTertiaryContainer: Color(0xFFF8D8FF),
          error: Color(0xFFBA1A1A),
          onError: Color(0xFFFFFFFF),
          errorContainer: Color(0xFF93000A),
          onErrorContainer: Color(0xFFFFDAD6),
          surface: Color(0xFF0F121D),
          onSurface: Color(0xFFF7FAFD),
          surfaceContainerHighest: Color(0xFF252C43),
          onSurfaceVariant: Color(0xFFA5A7BC),
          outline: Color(0xFF6B6D82),
          outlineVariant: Color(0xFF3E4154),
          inverseSurface: Color(0xFFEEF1F5),
          onInverseSurface: Color(0xFF2D3134),
          inversePrimary: Color(0xFFBEC2FF),
          surfaceTint: Color(0xFF5865F2),
        ),
        const Color(0xFF0B0E14),
      );

  static ThemeData get comfortTheme => _buildTheme(
        const ColorScheme(
          brightness: Brightness.light,
          primary: Color(0xFF3F4CDA),
          onPrimary: Color(0xFFFFFFFF),
          primaryContainer: Color(0xFF5A67F2),
          onPrimaryContainer: Color(0xFFFFFFFF),
          secondary: Color(0xFF006D37),
          onSecondary: Color(0xFFFFFFFF),
          secondaryContainer: Color(0xFF6BFE9C),
          onSecondaryContainer: Color(0xFF00743A),
          tertiary: Color(0xFF81419C),
          onTertiary: Color(0xFFFFFFFF),
          tertiaryContainer: Color(0xFF9C5AB7),
          onTertiaryContainer: Color(0xFFFFFFFF),
          error: Color(0xFFBA1A1A),
          onError: Color(0xFFFFFFFF),
          errorContainer: Color(0xFFFFDAD6),
          onErrorContainer: Color(0xFF93000A),
          surface: Color(0xFFF0F4F8),
          onSurface: Color(0xFF1E2530),
          surfaceContainerHighest: Color(0xFFC4D1E2),
          onSurfaceVariant: Color(0xFF4A5568),
          outline: Color(0xFF718096),
          outlineVariant: Color(0xFFCBD5E0),
          inverseSurface: Color(0xFF2D3748),
          onInverseSurface: Color(0xFFEDF2F7),
          inversePrimary: Color(0xFFBFC3FF),
          surfaceTint: Color(0xFF3F4CDA),
        ),
        const Color(0xFFF0F4F8),
      );
}
