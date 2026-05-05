// AI Mentor Riverpod provider'ları ve state yönetimi.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../data/models/mentor_model.dart';
import '../data/repositories/mentor_repository.dart';
import 'providers.dart';

part 'mentor_provider.freezed.dart';

/// Mentor sohbet durumu.
@freezed
class MentorChatState with _$MentorChatState {
  const factory MentorChatState({
    @Default([]) List<ChatMessageModel> messages,
    @Default(false) bool isLoading,
    String? error,
  }) = _MentorChatState;
}

/// Mentor bağlam yapılandırması.
/// family provider için equality doğru implement edilmiştir.
class MentorConfig {
  final String? moduleSlug;
  final String? lessonTitle;
  final String? questionText;
  final String context;

  const MentorConfig({
    this.moduleSlug,
    this.lessonTitle,
    this.questionText,
    this.context = 'general',
  });

  @override
  bool operator ==(Object other) =>
      other is MentorConfig &&
      other.moduleSlug == moduleSlug &&
      other.lessonTitle == lessonTitle &&
      other.questionText == questionText &&
      other.context == context;

  @override
  int get hashCode =>
      Object.hash(moduleSlug, lessonTitle, questionText, context);
}

/// Mentor sohbet state notifier.
class MentorNotifier extends StateNotifier<MentorChatState> {
  final MentorRepository _repository;
  final MentorConfig config;

  MentorNotifier(this._repository, this.config)
      : super(const MentorChatState()) {
    _addAssistantMessage(
      'Merhaba! Ben Phantom 👻 Takıldığın bir yer mi var? Yardımcı olmaya hazırım!',
    );
  }

  void _addAssistantMessage(String content) {
    state = state.copyWith(
      messages: [
        ...state.messages,
        ChatMessageModel(role: 'assistant', content: content),
      ],
    );
  }

  Future<void> sendMessage(String userMessage) async {
    if (userMessage.trim().isEmpty || state.isLoading) return;

    // Kullanıcı mesajını ekle
    state = state.copyWith(
      messages: [
        ...state.messages,
        ChatMessageModel(role: 'user', content: userMessage),
      ],
      isLoading: true,
      error: null,
    );

    // Geçmiş: yeni eklenen kullanıcı mesajı hariç önceki mesajlar
    final history = state.messages.length > 1
        ? state.messages.sublist(0, state.messages.length - 1)
        : <ChatMessageModel>[];

    final request = MentorRequestModel(
      message: userMessage,
      context: config.context,
      history: history,
      moduleSlug: config.moduleSlug,
      lessonTitle: config.lessonTitle,
      questionText: config.questionText,
    );

    final response = await _repository.sendMessage(request);

    response.when(
      success: (data) {
        state = state.copyWith(
          messages: [
            ...state.messages,
            ChatMessageModel(role: 'assistant', content: data.reply),
          ],
          isLoading: false,
        );
      },
      error: (message, _) {
        state = state.copyWith(isLoading: false, error: message);
        _addAssistantMessage('Üzgünüm, şu an yanıt veremiyorum. 😔 $message');
      },
      loading: () {},
    );
  }

  void clearChat() {
    state = const MentorChatState();
    _addAssistantMessage(
      'Merhaba! Ben Phantom 👻 Takıldığın bir yer mi var?',
    );
  }
}

/// Family provider — her MentorConfig için ayrı state tutar.
final mentorProvider = StateNotifierProvider.family<
    MentorNotifier, MentorChatState, MentorConfig>(
  (ref, config) {
    final repository = ref.watch(mentorRepositoryProvider);
    return MentorNotifier(repository, config);
  },
);
