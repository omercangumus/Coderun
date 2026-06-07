// Ghostie mentor yanıtından ÖNERİ: satırını ayıklar.

class MentorSuggestionParseResult {
  const MentorSuggestionParseResult({
    required this.displayText,
    this.suggestion,
  });

  final String displayText;
  final String? suggestion;
}

final _suggestionPattern = RegExp(r'ÖNERİ:\s*(.+?)(?:\n|$)', caseSensitive: false);

MentorSuggestionParseResult parseMentorSuggestion(String content) {
  final match = _suggestionPattern.firstMatch(content);
  if (match == null) {
    return MentorSuggestionParseResult(displayText: content);
  }

  var suggestion = match.group(1)?.trim() ?? '';
  if ((suggestion.startsWith('"') && suggestion.endsWith('"')) ||
      (suggestion.startsWith("'") && suggestion.endsWith("'")) ||
      (suggestion.startsWith('`') && suggestion.endsWith('`'))) {
    suggestion = suggestion.substring(1, suggestion.length - 1);
  }

  final displayText = content.replaceAll(_suggestionPattern, '').trimRight();

  return MentorSuggestionParseResult(
    displayText: displayText.isEmpty ? content : displayText,
    suggestion: suggestion.isEmpty ? null : suggestion,
  );
}
