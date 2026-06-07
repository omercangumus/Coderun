// AI Mentor Riverpod provider'ları ve state yönetimi.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../core/utils/mentor_suggestion.dart';
import '../data/models/mentor_model.dart';
import '../data/repositories/mentor_repository.dart';
import 'providers.dart';

part 'mentor_provider.freezed.dart';

/// Kod tamamlama sorusunda mentor önerisini derse aktarmak için.
class PendingMentorSuggestion {
  const PendingMentorSuggestion({
    required this.lessonId,
    required this.questionId,
    required this.suggestion,
  });

  final String lessonId;
  final String questionId;
  final String suggestion;
}

final pendingMentorSuggestionProvider =
    StateProvider<PendingMentorSuggestion?>((ref) => null);

/// Mentor sohbet durumu.
@freezed
class MentorChatState with _$MentorChatState {
  const factory MentorChatState({
    @Default([]) List<ChatMessageModel> messages,
    @Default(false) bool isLoading,
    @Default(1) int attemptCount,
    String? lastSuggestion,
    String? error,
  }) = _MentorChatState;
}

/// Mentor bağlam yapılandırması.
class MentorConfig {
  final String? moduleSlug;
  final String? lessonTitle;
  final String? questionText;
  final String? questionType;
  final String? codeBlock;
  final String? lessonId;
  final String? questionId;
  final String context;

  const MentorConfig({
    this.moduleSlug,
    this.lessonTitle,
    this.questionText,
    this.questionType,
    this.codeBlock,
    this.lessonId,
    this.questionId,
    this.context = 'general',
  });

  bool get isLessonQuiz => context == 'lesson';

  @override
  bool operator ==(Object other) =>
      other is MentorConfig &&
      other.moduleSlug == moduleSlug &&
      other.lessonTitle == lessonTitle &&
      other.questionText == questionText &&
      other.questionType == questionType &&
      other.codeBlock == codeBlock &&
      other.lessonId == lessonId &&
      other.questionId == questionId &&
      other.context == context;

  @override
  int get hashCode => Object.hash(
        moduleSlug,
        lessonTitle,
        questionText,
        questionType,
        codeBlock,
        lessonId,
        questionId,
        context,
      );
}

/// Mentor sohbet state notifier.
class MentorNotifier extends StateNotifier<MentorChatState> {
  final MentorRepository _repository;
  final MentorConfig config;

  MentorNotifier(this._repository, this.config)
      : super(const MentorChatState()) {
    _addAssistantMessage(
      config.isLessonQuiz
          ? 'Merhaba! Ben Ghostie 👻 Bu soruda takılırsan bana yaz — önce konuyu tartışırız, cevabı hemen vermem!'
          : 'Merhaba! Ben Ghostie 👻 Takıldığın bir yer mi var? Yardımcı olmaya hazırım!',
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

    state = state.copyWith(
      messages: [
        ...state.messages,
        ChatMessageModel(role: 'user', content: userMessage),
      ],
      isLoading: true,
      error: null,
    );

    if (config.isLessonQuiz) {
      await _sendLessonAsk(userMessage);
    } else {
      await _sendGeneralChat(userMessage);
    }
  }

  Future<void> _sendLessonAsk(String userMessage) async {
    final request = MentorAskRequestModel(
      message: userMessage,
      learningPath: config.moduleSlug,
      attemptCount: state.attemptCount,
      questionText: config.questionText,
      lessonTitle: config.lessonTitle,
      questionType: config.questionType,
      codeBlock: config.codeBlock,
    );

    final response = await _repository.askMentor(request);

    response.when(
      success: (data) {
        final parsed = parseMentorSuggestion(data.answer);
        state = state.copyWith(
          messages: [
            ...state.messages,
            ChatMessageModel(role: 'assistant', content: parsed.displayText),
          ],
          isLoading: false,
          attemptCount: state.attemptCount + 1,
          lastSuggestion: parsed.suggestion ?? state.lastSuggestion,
        );
      },
      error: (message, _) {
        state = state.copyWith(isLoading: false, error: message);
        _addAssistantMessage('Üzgünüm, şu an yanıt veremiyorum. 😔');
      },
      loading: () {},
    );
  }

  Future<void> _sendGeneralChat(String userMessage) async {
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
        _addAssistantMessage('Üzgünüm, şu an yanıt veremiyorum. 😔');
      },
      loading: () {},
    );
  }

  void clearChat() {
    state = const MentorChatState();
    _addAssistantMessage(
      config.isLessonQuiz
          ? 'Merhaba! Ben Ghostie 👻 Soruyu birlikte çözelim!'
          : 'Merhaba! Ben Ghostie 👻 Takıldığın bir yer mi var?',
    );
  }

  String attemptLabel() {
    if (state.attemptCount <= 1) return 'İpucu modu';
    if (state.attemptCount == 2) return 'Açık ipucu';
    if (state.attemptCount == 3) return 'Örnek modu';
    return 'Öneri modu';
  }

  bool get canApplySuggestion =>
      config.questionType == 'code_completion' &&
      state.lastSuggestion != null &&
      state.attemptCount >= 4 &&
      config.lessonId != null &&
      config.questionId != null;
}

/// Family provider — her MentorConfig için ayrı state tutar.
final mentorProvider = StateNotifierProvider.family<
    MentorNotifier, MentorChatState, MentorConfig>(
  (ref, config) {
    final repository = ref.watch(mentorRepositoryProvider);
    return MentorNotifier(repository, config);
  },
);
