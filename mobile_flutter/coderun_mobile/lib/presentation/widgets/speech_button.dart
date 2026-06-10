import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:permission_handler/permission_handler.dart';
import '../../core/speech/speech_service.dart';
import '../../core/theme/app_colors.dart';

final _speechServiceProvider = Provider<SpeechService>((ref) => SpeechService());

class SpeechButton extends ConsumerStatefulWidget {
  final void Function(String) onResult;
  final String? tooltip;

  const SpeechButton({
    super.key,
    required this.onResult,
    this.tooltip,
  });

  @override
  ConsumerState<SpeechButton> createState() => _SpeechButtonState();
}

class _SpeechButtonState extends ConsumerState<SpeechButton> {
  bool _isListening = false;
  bool _isAvailable = false;

  @override
  void initState() {
    super.initState();
    _initSpeech();
  }

  Future<void> _initSpeech() async {
    final status = await Permission.microphone.status;
    if (status.isDenied) {
      await Permission.microphone.request();
    }
    final service = ref.read(_speechServiceProvider);
    final available = await service.initialize();
    if (mounted) setState(() => _isAvailable = available);
  }

  @override
  void dispose() {
    final service = ref.read(_speechServiceProvider);
    service.stopListening();
    super.dispose();
  }

  Future<void> _toggle() async {
    final service = ref.read(_speechServiceProvider);
    if (_isListening) {
      await service.stopListening();
      if (mounted) setState(() => _isListening = false);
    } else {
      setState(() => _isListening = true);
      await service.startListening(
        onResult: (text) {
          widget.onResult(text);
          if (mounted) setState(() => _isListening = false);
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: widget.tooltip ?? 'Sesli cevap ver',
      child: IconButton(
        onPressed: _isAvailable ? _toggle : null,
        icon: Stack(
          alignment: Alignment.center,
          children: [
            Icon(
              _isListening ? Icons.mic : Icons.mic_none,
              color: _isAvailable
                  ? (_isListening ? AppColors.error : AppColors.primary)
                  : AppColors.grey,
            ),
            if (_isListening)
              const SizedBox(
                width: 32,
                height: 32,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AppColors.error,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
