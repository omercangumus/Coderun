import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/config/api_endpoint_config.dart';
import '../../providers/providers.dart';

/// Yalnızca debug modda — USB / emülatör backend bağlantısı.
class DevApiSettingsCard extends ConsumerStatefulWidget {
  const DevApiSettingsCard({super.key});

  @override
  ConsumerState<DevApiSettingsCard> createState() => _DevApiSettingsCardState();
}

class _DevApiSettingsCardState extends ConsumerState<DevApiSettingsCard> {
  late final TextEditingController _controller;
  String? _statusMessage;
  bool _testing = false;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: ApiEndpointConfig.displayUrl);
    if (ApiEndpointConfig.lastProbeMessage != null) {
      _statusMessage = ApiEndpointConfig.lastProbeMessage;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _applyUrl(String url, {bool showStatus = true}) async {
    await ApiEndpointConfig.setDevOverride(url);
    ref.read(apiConfigRevisionProvider.notifier).state++;
    if (mounted && showStatus) {
      setState(() {
        _statusMessage = 'Bağlantı adresi güncellendi: $url';
        _controller.text = url;
      });
    }
  }

  Future<void> _testConnection() async {
    setState(() {
      _testing = true;
      _statusMessage = null;
    });

    final result = await ApiEndpointConfig.probeCurrentBackend();

    if (!mounted) return;

    if (result.changedUrl) {
      ref.read(apiConfigRevisionProvider.notifier).state++;
      _controller.text = result.baseUrl;
    }

    setState(() {
      _testing = false;
      _statusMessage = result.message;
    });
  }

  Future<void> _autoDetect() async {
    setState(() {
      _testing = true;
      _statusMessage = 'Adres aranıyor...';
    });

    final detected = await ApiEndpointConfig.autoDetectAndroidDevUrl();

    if (!mounted) return;

    if (detected != null) {
      await _applyUrl(detected, showStatus: false);
      setState(() {
        _testing = false;
        _statusMessage = 'Otomatik bulundu: $detected';
        _controller.text = detected;
      });
    } else {
      setState(() {
        _testing = false;
        _statusMessage =
            'Backend bulunamadı. Önce PC\'de backend\'i başlat, sonra USB script\'ini çalıştır.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (kReleaseMode) return const SizedBox.shrink();

    final colorScheme = Theme.of(context).colorScheme;

    return Card(
      margin: const EdgeInsets.only(top: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Geliştirici — Backend Bağlantısı',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Web ile aynı veri için tablet ve PC aynı backend\'e (port 8000) bağlanmalı. '
              'USB kablo: adb reverse + 127.0.0.1',
              style: TextStyle(
                fontSize: 12,
                color: colorScheme.onSurfaceVariant,
                height: 1.35,
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _controller,
              decoration: const InputDecoration(
                labelText: 'API Base URL',
                border: OutlineInputBorder(),
                isDense: true,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                OutlinedButton(
                  onPressed: _testing
                      ? null
                      : () => _applyUrl(ApiEndpointConfig.usbDevUrl),
                  child: const Text('USB (127.0.0.1)'),
                ),
                OutlinedButton(
                  onPressed: _testing
                      ? null
                      : () => _applyUrl(ApiEndpointConfig.emulatorDevUrl),
                  child: const Text('Emülatör'),
                ),
                OutlinedButton(
                  onPressed: _testing ? null : _autoDetect,
                  child: const Text('Otomatik bul'),
                ),
                OutlinedButton(
                  onPressed: _testing
                      ? null
                      : () async {
                          await ApiEndpointConfig.setDevOverride(null);
                          ref.read(apiConfigRevisionProvider.notifier).state++;
                          _controller.text = ApiEndpointConfig.displayUrl;
                          setState(
                            () => _statusMessage = 'Varsayılan URL kullanılıyor.',
                          );
                        },
                  child: const Text('Sıfırla'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: FilledButton(
                    onPressed: _testing
                        ? null
                        : () => _applyUrl(_controller.text.trim()),
                    child: const Text('Kaydet'),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton.tonal(
                  onPressed: _testing ? null : _testConnection,
                  child: _testing
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Test'),
                ),
              ],
            ),
            if (_statusMessage != null) ...[
              const SizedBox(height: 8),
              Text(
                _statusMessage!,
                style: TextStyle(
                  fontSize: 12,
                  color: _statusMessage!.contains('OK') ||
                          _statusMessage!.contains('bulundu')
                      ? colorScheme.primary
                      : colorScheme.error,
                  height: 1.35,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
