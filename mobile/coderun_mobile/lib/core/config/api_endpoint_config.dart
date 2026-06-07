// API taban URL yapılandırması — emülatör, USB (adb reverse) ve WiFi geliştirme.

import 'dart:io' show Platform;

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiEndpointConfig {
  ApiEndpointConfig._();

  static const prefKey = 'dev_api_base_url';
  static String? _runtimeOverride;
  static String? _lastProbeMessage;

  /// Son bağlantı testi / otomatik keşif mesajı (debug).
  static String? get lastProbeMessage => _lastProbeMessage;

  static Future<void> load() async {
    if (kReleaseMode) return;

    final prefs = await SharedPreferences.getInstance();
    _runtimeOverride = prefs.getString(prefKey);

    const customUrl = String.fromEnvironment('API_BASE_URL');
    if (customUrl.isNotEmpty) {
      _lastProbeMessage = 'Script URL: $customUrl';
      return;
    }

    if (_runtimeOverride != null && _runtimeOverride!.isNotEmpty) {
      _lastProbeMessage = 'Kayıtlı URL: $_runtimeOverride';
      return;
    }

    // Fiziksel cihaz / emülatör — hangi adres çalışıyorsa onu seç.
    if (Platform.isAndroid) {
      final detected = await autoDetectAndroidDevUrl();
      if (detected != null) {
        _runtimeOverride = detected;
        _lastProbeMessage = 'Otomatik bulundu: $detected';
        debugPrint('[ApiEndpointConfig] $_lastProbeMessage');
      } else {
        _lastProbeMessage =
            'Backend bulunamadı. USB: dev-mobile-usb.ps1 | Emülatör: 10.0.2.2';
        debugPrint('[ApiEndpointConfig] $_lastProbeMessage');
      }
    }
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

  /// Health check için kök origin (ör. http://127.0.0.1:8000).
  static String get serverOrigin {
    final url = baseUrl;
    if (url.endsWith('/api/v1')) {
      return url.substring(0, url.length - '/api/v1'.length);
    }
    return url;
  }

  static String get healthCheckUrl => '$serverOrigin/health';

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

  /// Android geliştirmede çalışan backend adresini bulur.
  static Future<String?> autoDetectAndroidDevUrl() async {
    const candidates = [
      'http://127.0.0.1:8000', // USB + adb reverse
      'http://10.0.2.2:8000', // Emülatör
    ];

    for (final origin in candidates) {
      if (await pingHealth('$origin/health')) {
        return '$origin/api/v1';
      }
    }
    return null;
  }

  /// Backend /health endpoint'ine istek atar.
  static Future<bool> pingHealth(String healthUrl) async {
    try {
      final dio = Dio(
        BaseOptions(
          connectTimeout: const Duration(seconds: 3),
          receiveTimeout: const Duration(seconds: 3),
        ),
      );
      final response = await dio.get<dynamic>(healthUrl);
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  /// Mevcut baseUrl ile backend erişilebilir mi?
  static Future<BackendProbeResult> probeCurrentBackend() async {
    final healthOk = await pingHealth(healthCheckUrl);
    if (healthOk) {
      return BackendProbeResult(
        ok: true,
        message: 'Backend bağlantısı OK ($healthCheckUrl)',
        baseUrl: baseUrl,
      );
    }

    // Android'de alternatif adresleri dene
    if (!kReleaseMode && Platform.isAndroid) {
      final detected = await autoDetectAndroidDevUrl();
      if (detected != null) {
        await setDevOverride(detected);
        return BackendProbeResult(
          ok: true,
          message: 'Backend otomatik bulundu: $detected',
          baseUrl: detected,
          changedUrl: true,
        );
      }
    }

    return BackendProbeResult(
      ok: false,
      message: _connectionHelpMessage(),
      baseUrl: baseUrl,
    );
  }

  static String _connectionHelpMessage() {
    return 'Backend\'e ulaşılamıyor ($baseUrl).\n'
        '• USB: .\\scripts\\dev-mobile-usb.ps1 çalıştır\n'
        '• Backend: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000\n'
        '• Profil → Geliştirici → USB (127.0.0.1) → Test';
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
          return 'http://127.0.0.1:8000/api/v1';
        }
        if (Platform.isIOS) {
          return 'http://127.0.0.1:8000/api/v1';
        }
        return 'http://127.0.0.1:8000/api/v1';
    }
  }

  static String get usbDevUrl => 'http://127.0.0.1:8000/api/v1';
  static String get emulatorDevUrl => 'http://10.0.2.2:8000/api/v1';

  static String wifiDevUrl(String pcIp) =>
      'http://${pcIp.trim()}:8000/api/v1';
}

class BackendProbeResult {
  const BackendProbeResult({
    required this.ok,
    required this.message,
    required this.baseUrl,
    this.changedUrl = false,
  });

  final bool ok;
  final String message;
  final String baseUrl;
  final bool changedUrl;
}
