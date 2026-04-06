// Splash ekranı.
// Uygulama açılışında auth durumu kontrol edilirken gösterilir.

import 'package:flutter/material.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/theme/app_colors.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.primary,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // TODO: Lottie animasyonu eklenecek (Hafta 6)
            Text(
              AppConstants.appName,
              style: TextStyle(
                fontSize: 48,
                fontWeight: FontWeight.bold,
                color: AppColors.white,
                letterSpacing: 4,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Kodlamayı öğren, seviye atla',
              style: TextStyle(
                fontSize: 16,
                color: AppColors.grey,
              ),
            ),
            SizedBox(height: 48),
            CircularProgressIndicator(
              color: AppColors.highlight,
            ),
          ],
        ),
      ),
    );
  }
}
