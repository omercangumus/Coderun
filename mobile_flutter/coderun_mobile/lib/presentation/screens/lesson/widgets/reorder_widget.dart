// Coderun mobile — sıralama widget'ı.
// ReorderableListView ile adımları doğru sıraya koyma.

import 'dart:convert';
import 'package:flutter/material.dart';

class ReorderWidget extends StatefulWidget {
  final String questionText;
  final List<String> items;
  final String? hint;
  final ValueChanged<String> onAnswer;

  const ReorderWidget({
    super.key,
    required this.questionText,
    required this.items,
    this.hint,
    required this.onAnswer,
  });

  @override
  State<ReorderWidget> createState() => _ReorderWidgetState();
}

class _ReorderWidgetState extends State<ReorderWidget> {
  late List<int> _order;
  bool _submitted = false;
  bool _showHint = false;

  @override
  void initState() {
    super.initState();
    _order = List.generate(widget.items.length, (i) => i)..shuffle();
  }

  void _onReorder(int oldIndex, int newIndex) {
    if (_submitted) return;
    setState(() {
      if (newIndex > oldIndex) newIndex -= 1;
      final item = _order.removeAt(oldIndex);
      _order.insert(newIndex, item);
    });
  }

  void _submit() {
    setState(() => _submitted = true);
    widget.onAnswer(jsonEncode(_order.map((e) => e.toString()).toList()));
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.questionText, style: theme.textTheme.titleMedium),
        const SizedBox(height: 16),

        SizedBox(
          height: widget.items.length * 72.0,
          child: ReorderableListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _order.length,
            onReorder: _onReorder,
            itemBuilder: (context, i) {
              return Container(
                key: ValueKey(_order[i]),
                margin: const EdgeInsets.symmetric(vertical: 4),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: theme.colorScheme.outlineVariant),
                ),
                child: ListTile(
                  leading: CircleAvatar(
                    radius: 16,
                    backgroundColor: theme.colorScheme.primary,
                    child: Text('${i + 1}',
                        style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 14)),
                  ),
                  title: Text(widget.items[_order[i]],
                      style: theme.textTheme.bodyMedium),
                  trailing: _submitted
                      ? null
                      : Icon(Icons.drag_handle,
                          color: theme.colorScheme.onSurfaceVariant),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 16),

        if (!_submitted)
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: _submit,
              child: const Text('Sıralamayı Onayla'),
            ),
          ),

        if (widget.hint != null) ...[
          const SizedBox(height: 12),
          GestureDetector(
            onTap: () => setState(() => _showHint = !_showHint),
            child: Text(
              _showHint ? '💡 ${widget.hint}' : '💡 İpucu göster',
              style: TextStyle(color: theme.colorScheme.primary, fontSize: 13),
            ),
          ),
        ],
      ],
    );
  }
}
