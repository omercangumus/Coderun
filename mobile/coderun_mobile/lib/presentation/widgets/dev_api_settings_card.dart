import 'package:dio/dio.dart';
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
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _applyUrl(String url) async {
    await ApiEndpointConfig.setDevOverride(url);
    ref.read(apiConfigRevisionProvider.notifier).state++;
    if (mounted) {
      setState(() {
        _statusMessage = 'Bağlantı adresi güncellendi: $url';
      });
    }
  }

  Future<void> _testConnection() async {
    setState(() {
      _testing = true;
      _statusMessage = null;
    });

    try {
      final dio = Dio(
        BaseOptions(
          baseUrl: ApiEndpointConfig.baseUrl,
          connectTimeout: const Duration(seconds: 5),
          receiveTimeout: const Duration(seconds: 5),
        ),
      );
      final response = await dio.get('/health');
      if (!mounted) return;
      setState(() {
        _statusMessage = response.statusCode == 200
            ? 'Backend bağlantısı OK ✓'
            : 'Beklenmeyen yanıt: ${response.statusCode}';
      });
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _statusMessage =
            'Bağlantı hatası: $error\nUSB için dev-mobile-usb.ps1 çalıştırdın mı?';
      });
    } finally {
      if (mounted) {
        setState(() => _testing = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (kReleaseMode) return const SizedBox.shrink();

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
              'Web ile aynı veriyi görmek için tablet ve PC aynı backend\'e (port 8000) bağlanmalı.',
              style: TextStyle(
                fontSize: 12,
                color: Theme.of(context).colorScheme.onSurfaceVariant,
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
                  onPressed: () => _applyUrl(ApiEndpointConfig.usbDevUrl),
                  child: const Text('USB (127.0.0.1)'),
                ),
                OutlinedButton(
                  onPressed: () => _applyUrl(ApiEndpointConfig.emulatorDevUrl),
                  child: const Text('Emülatör'),
                ),
                OutlinedButton(
                  onPressed: () async {
                    await ApiEndpointConfig.setDevOverride(null);
                    ref.read(apiConfigRevisionProvider.notifier).state++;
                    _controller.text = ApiEndpointConfig.displayUrl;
                    setState(() => _statusMessage = 'Varsayılan URL kullanılıyor.');
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
                    onPressed: () => _applyUrl(_controller.text.trim()),
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
                style: const TextStyle(fontSize: 12),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
