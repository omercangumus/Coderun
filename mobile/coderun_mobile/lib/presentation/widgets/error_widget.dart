import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class AppErrorWidget extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;

  const AppErrorWidget({super.key, required this.message, this.onRetry});

  bool get _isNetworkError {
    final lower = message.toLowerCase();
    return lower.contains('internet') ||
        lower.contains('bağlantı') ||
        lower.contains('connection') ||
        lower.contains('network') ||
        lower.contains('socket');
  }

  @override
  Widget build(BuildContext context) {
    final isNetwork = _isNetworkError;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isNetwork ? Icons.wifi_off : Icons.error_outline,
              color: AppColors.error,
              size: 48,
            ),
            const SizedBox(height: 12),
            Text(
              isNetwork ? 'İnternet bağlantını kontrol et 📡' : message,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14, color: AppColors.greyDark),
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: const Text('Tekrar Dene'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
