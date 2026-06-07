// AI Mentor sohbet ekranı — Ghostie ile quiz odaklı sohbet.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../providers/mentor_provider.dart';
import '../../widgets/speech_button.dart';

class MentorChatScreen extends ConsumerStatefulWidget {
  final String? moduleSlug;
  final String? lessonTitle;
  final String? questionText;
  final String? questionType;
  final String? codeBlock;
  final String? lessonId;
  final String? questionId;
  final String context;

  const MentorChatScreen({
    super.key,
    this.moduleSlug,
    this.lessonTitle,
    this.questionText,
    this.questionType,
    this.codeBlock,
    this.lessonId,
    this.questionId,
    this.context = 'general',
  });

  @override
  ConsumerState<MentorChatScreen> createState() => _MentorChatScreenState();
}

class _MentorChatScreenState extends ConsumerState<MentorChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  late final MentorConfig _config;

  @override
  void initState() {
    super.initState();
    _config = MentorConfig(
      moduleSlug: widget.moduleSlug,
      lessonTitle: widget.lessonTitle,
      questionText: widget.questionText,
      questionType: widget.questionType,
      codeBlock: widget.codeBlock,
      lessonId: widget.lessonId,
      questionId: widget.questionId,
      context: widget.context,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage([String? preset]) async {
    final text = (preset ?? _controller.text).trim();
    if (text.isEmpty) return;
    if (preset == null) _controller.clear();
    await ref.read(mentorProvider(_config).notifier).sendMessage(text);
    _scrollToBottom();
  }

  void _applySuggestion() {
    final state = ref.read(mentorProvider(_config));
    final notifier = ref.read(mentorProvider(_config).notifier);
    final suggestion = state.lastSuggestion;
    if (!notifier.canApplySuggestion || suggestion == null) return;

    ref.read(pendingMentorSuggestionProvider.notifier).state =
        PendingMentorSuggestion(
      lessonId: widget.lessonId!,
      questionId: widget.questionId!,
      suggestion: suggestion,
    );
    if (mounted) context.pop();
  }

  List<({String label, String message})> get _quickPrompts {
    if (widget.questionType == 'code_completion') {
      return [
        (
          label: 'Soruyu açıkla',
          message: 'Bu kod tamamlama sorusunu adım adım açıklar mısın?',
        ),
        (
          label: 'Nasıl düşünmeliyim?',
          message: 'Bu boşluğu doldurmak için hangi kavramlara bakmalıyım?',
        ),
        (
          label: 'Boşluk ipucu',
          message: '___ işaretli yere ne tür bir ifade gelmeli? Cevabı verme.',
        ),
        (
          label: 'Mini örnek',
          message: 'Benzer ama farklı küçük bir kod örneği gösterir misin?',
        ),
      ];
    }

    return [
      (
        label: 'Soruyu açıkla',
        message: 'Bu soruyu daha sade bir dille açıklar mısın?',
      ),
      (
        label: 'Nasıl düşünmeliyim?',
        message: 'Bu soruyu çözmek için hangi adımları izlemeliyim?',
      ),
      (
        label: 'Kavram hatırlat',
        message: 'Bu soru hangi Python kavramını ölçüyor?',
      ),
      (
        label: 'Yanlışları ele',
        message: 'Hangi seçenekler elenebilir? Doğru şıkkı söyleme.',
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(mentorProvider(_config));
    final notifier = ref.read(mentorProvider(_config).notifier);

    ref.listen(mentorProvider(_config), (_, next) {
      if (!next.isLoading) _scrollToBottom();
    });

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Text('👻', style: TextStyle(fontSize: 20)),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Ghostie AI Mentor',
                    style: TextStyle(fontSize: 16),
                  ),
                  if (_config.isLessonQuiz)
                    Text(
                      notifier.attemptLabel(),
                      style: TextStyle(
                        fontSize: 11,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline),
            tooltip: 'Sohbeti temizle',
            onPressed: () => notifier.clearChat(),
          ),
        ],
      ),
      body: Column(
        children: [
          if (_config.isLessonQuiz)
            SizedBox(
              height: 44,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                itemCount: _quickPrompts.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final chip = _quickPrompts[index];
                  return ActionChip(
                    label: Text(chip.label, style: const TextStyle(fontSize: 12)),
                    onPressed:
                        state.isLoading ? null : () => _sendMessage(chip.message),
                  );
                },
              ),
            ),

          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              itemCount: state.messages.length + (state.isLoading ? 1 : 0),
              itemBuilder: (ctx, index) {
                if (index == state.messages.length) {
                  return const _TypingIndicator();
                }
                final msg = state.messages[index];
                return _MessageBubble(
                  role: msg.role,
                  content: msg.content,
                );
              },
            ),
          ),

          if (notifier.canApplySuggestion)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
              child: SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: _applySuggestion,
                  icon: const Icon(Icons.edit_outlined, size: 18),
                  label: Text('Öneriyi kutuya yaz: "${state.lastSuggestion}"'),
                ),
              ),
            ),

          Container(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 16),
            decoration: BoxDecoration(
              color: Theme.of(context).scaffoldBackgroundColor,
              border: Border(top: BorderSide(color: Colors.grey.shade200)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    maxLines: 3,
                    minLines: 1,
                    textInputAction: TextInputAction.newline,
                    decoration: InputDecoration(
                      hintText: 'Ghostie\'ye sor...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                        borderSide: BorderSide(color: Colors.grey.shade300),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 10,
                      ),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 8),
                SpeechButton(
                  onResult: (text) {
                    _controller.text = text;
                    _controller.selection = TextSelection.fromPosition(
                      TextPosition(offset: text.length),
                    );
                  },
                ),
                const SizedBox(width: 4),
                IconButton(
                  onPressed: state.isLoading || _controller.text.trim().isEmpty
                      ? null
                      : () => _sendMessage(),
                  icon: const Icon(Icons.send_rounded),
                  color: AppColors.primary,
                  style: IconButton.styleFrom(
                    backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                    disabledBackgroundColor: Colors.grey.shade100,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MessageBubble extends StatelessWidget {
  final String role;
  final String content;

  const _MessageBubble({required this.role, required this.content});

  @override
  Widget build(BuildContext context) {
    final isUser = role == 'user';

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment:
            isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) ...[
            const CircleAvatar(
              radius: 16,
              backgroundColor: Color(0xFF7C3AED),
              child: Text('👻', style: TextStyle(fontSize: 14)),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: isUser ? AppColors.primary : Colors.grey.shade100,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(18),
                  topRight: const Radius.circular(18),
                  bottomLeft: Radius.circular(isUser ? 18 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 18),
                ),
              ),
              child: Text(
                content,
                style: TextStyle(
                  color: isUser ? Colors.white : Colors.grey.shade800,
                  fontSize: 14,
                  height: 1.4,
                ),
              ),
            ),
          ),
          if (isUser) const SizedBox(width: 8),
        ],
      ),
    );
  }
}

class _TypingIndicator extends StatefulWidget {
  const _TypingIndicator();

  @override
  State<_TypingIndicator> createState() => _TypingIndicatorState();
}

class _TypingIndicatorState extends State<_TypingIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 16,
            backgroundColor: Color(0xFF7C3AED),
            child: Text('👻', style: TextStyle(fontSize: 14)),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(18),
                topRight: Radius.circular(18),
                bottomRight: Radius.circular(18),
                bottomLeft: Radius.circular(4),
              ),
            ),
            child: AnimatedBuilder(
              animation: _controller,
              builder: (_, __) {
                final dots = '.' * ((_controller.value * 3).floor() + 1);
                return Text(
                  'Ghostie düşünüyor$dots',
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: 13,
                    fontStyle: FontStyle.italic,
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
