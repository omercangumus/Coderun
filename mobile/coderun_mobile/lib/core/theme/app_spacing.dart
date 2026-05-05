// Coderun Stitch Design System — Spacing
// Based on 8px unit system from Stitch designs

abstract class AppSpacing {
  // Base unit
  static const double unit = 8.0;

  // Spacing scale
  static const double xs = 4.0;    // unit * 0.5
  static const double sm = 8.0;    // unit * 1
  static const double md = 12.0;   // stack-sm
  static const double lg = 16.0;   // unit * 2
  static const double xl = 24.0;   // stack-md / gutter
  static const double xxl = 32.0;  // margin-page
  static const double xxxl = 48.0; // stack-lg

  // Semantic spacing
  static const double stackSm = 12.0;
  static const double stackMd = 24.0;
  static const double stackLg = 48.0;
  static const double gutter = 24.0;
  static const double marginPage = 32.0;

  // Border radius
  static const double radiusSm = 4.0;
  static const double radiusMd = 8.0;
  static const double radiusLg = 12.0;
  static const double radiusXl = 16.0;
  static const double radiusXxl = 24.0;
  static const double radiusFull = 9999.0;

  // Card padding
  static const double cardPadding = 16.0;
  static const double cardPaddingLg = 24.0;

  // Icon sizes
  static const double iconSm = 16.0;
  static const double iconMd = 24.0;
  static const double iconLg = 32.0;
  static const double iconXl = 48.0;

  // Button heights
  static const double buttonHeight = 52.0;
  static const double buttonHeightSm = 40.0;

  // Bottom nav height
  static const double bottomNavHeight = 64.0;
  static const double bottomNavPadding = 80.0; // content padding above nav
}
