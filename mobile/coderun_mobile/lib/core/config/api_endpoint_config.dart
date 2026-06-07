// API taban URL yapılandırması — emülatör, USB (adb reverse) ve WiFi geliştirme.

import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiEndpointConfig {
  ApiEndpointConfig._();

  static const prefKey = 'dev_api_base_url';
  static String? _runtimeOverride;

  static Future<void> load() async {
    if (kReleaseMode) return;
    final prefs = await SharedPreferences.getInstance();
    _runtimeOverride = prefs.getString(prefKey);
  }

  static String get baseUrl {
    const customUrl = String.fromEnvironment('API_BASE_URL');
    if (customUrl.isNotEmpty) {
      return customUrl;
    }

    if (_runtimeOverride != null && _runtimeOverride!.isNotEmpty) {
      return _runtimeOverride!;
    }

    return _defaultForEnvironment();
  }

  static String get displayUrl => baseUrl;

  static Future<void> setDevOverride(String? url) async {
    final trimmed = url?.trim();
    _runtimeOverride =
        (trimmed == null || trimmed.isEmpty) ? null : trimmed;

    if (kReleaseMode) return;

    final prefs = await SharedPreferences.getInstance();
    if (_runtimeOverride == null) {
      await prefs.remove(prefKey);
    } else {
      await prefs.setString(prefKey, _runtimeOverride!);
    }
  }

  static String _defaultForEnvironment() {
    const env = String.fromEnvironment('ENV', defaultValue: 'development');

    switch (env) {
      case 'production':
        return 'https://api.coderun.com/api/v1';
      case 'staging':
        return 'https://staging-api.coderun.com/api/v1';
      case 'development':
      default:
        if (kIsWeb) {
          return 'http://localhost:8000/api/v1';
        }
        if (Platform.isAndroid) {
          // Emülatör: 10.0.2.2 = host makine.
          // USB + adb reverse: scripts/dev-mobile-usb.ps1 → 127.0.0.1 kullanır.
          return 'http://10.0.2.2:8000/api/v1';
        }
        if (Platform.isIOS) {
          return 'http://127.0.0.1:8000/api/v1';
        }
        return 'http://127.0.0.1:8000/api/v1';
    }
  }

  /// USB geliştirme için önerilen URL (adb reverse sonrası).
  static String get usbDevUrl => 'http://127.0.0.1:8000/api/v1';

  /// Emülatör için önerilen URL.
  static String get emulatorDevUrl => 'http://10.0.2.2:8000/api/v1';
}
