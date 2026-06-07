/** Ghostie mentor yanıtından ÖNERİ: satırını ayıklar. */

const SUGGESTION_PATTERN = /ÖNERİ:\s*(.+?)(?:\n|$)/i;

export function parseMentorSuggestion(content: string): {
  displayText: string;
  suggestion: string | null;
} {
  const match = content.match(SUGGESTION_PATTERN);
  if (!match) {
    return { displayText: content, suggestion: null };
  }

  const suggestion = match[1].trim().replace(/^['"`]|['"`]$/g, '');
  const displayText = content.replace(SUGGESTION_PATTERN, '').trimEnd();

  return { displayText: displayText || content, suggestion };
}
