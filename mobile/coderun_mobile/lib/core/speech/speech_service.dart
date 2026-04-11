import 'package:flutter/foundation.dart';
import 'package:speech_to_text/speech_to_text.dart';

class SpeechService {
  final SpeechToText _speechToText = SpeechToText();
  bool _isInitialized = false;

  Future<bool> initialize() async {
    _isInitialized = await _speechToText.initialize(
      onError: (error) => debugPrint('Ses hatası: $error'),
      onStatus: (status) => debugPrint('Ses durumu: $status'),
    );
    return _isInitialized;
  }

  Future<void> startListening({
    required void Function(String) onResult,
    String locale = 'tr_TR',
  }) async {
    if (!_isInitialized) await initialize();
    await _speechToText.listen(
      onResult: (result) {
        if (result.finalResult) {
          onResult(result.recognizedWords);
        }
      },
      localeId: locale,
      listenFor: const Duration(seconds: 30),
      pauseFor: const Duration(seconds: 3),
    );
  }

  Future<void> stopListening() async {
    await _speechToText.stop();
  }

  bool get isListening => _speechToText.isListening;
  bool get isAvailable => _isInitialized;
}
