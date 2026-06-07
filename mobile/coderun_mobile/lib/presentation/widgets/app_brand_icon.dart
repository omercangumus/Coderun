import 'package:flutter/material.dart';

/// Uygulama marka ikonu — AppBar ve küçük alanlar için hafif PNG.
class AppBrandIcon extends StatelessWidget {
  final double size;
  final double borderRadius;

  const AppBrandIcon({
    super.key,
    this.size = 28,
    this.borderRadius = 8,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: Image.asset(
        'assets/icons/app_icon.png',
        width: size,
        height: size,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.primary,
            borderRadius: BorderRadius.circular(borderRadius),
          ),
          child: Center(
            child: Text('👻', style: TextStyle(fontSize: size * 0.5)),
          ),
        ),
      ),
    );
  }
}
