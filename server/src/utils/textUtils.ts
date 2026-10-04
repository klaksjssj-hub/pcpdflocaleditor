import { PDFFont } from 'pdf-lib';

/**
 * Common Unicode to standard character replacements
 */
const UNICODE_REPLACEMENTS: [RegExp, string][] = [
  // Ligatures
  [/ﬁ/g, 'fi'],
  [/ﬂ/g, 'fl'],
  [/ﬀ/g, 'ff'],
  [/ﬃ/g, 'ffi'],
  [/ﬄ/g, 'ffl'],
  // Quotes & apostrophes
  [/[\u2018\u2019\u201A\u201B]/g, "'"],
  [/[\u201C\u201D\u201E\u201F]/g, '"'],
  [/[\u00AB\u00BB]/g, '"'],
  // Dashes & hyphens
  [/[\u2012\u2013\u2014\u2015]/g, '-'],
  // Bullets & symbols
  [/[\u2022\u2023\u2043\u2219]/g, '*'],
  [/\u2026/g, '...'],
  // Spaces & zero-width
  [/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, ' '],
  [/[\u200C\u200D\uFEFF]/g, ''],
  // Math & misc
  [/×/g, 'x'],
  [/÷/g, '/'],
  [/≠/g, '!='],
  [/≤/g, '<='],
  [/≥/g, '>='],
  [/±/g, '+/-'],
  [/™/g, '(TM)'],
  [/©/g, '(C)'],
  [/®/g, '(R)'],
  // Private use area characters (e.g. 0xE000 - 0xF8FF, 0xF0DE)
  [/[\uE000-\uF8FF]/g, ' '],
  [/[\uFFF0-\uFFFF]/g, ' '],
];

/**
 * Sanitize text to ensure it can be safely encoded by the given PDF font.
 * Supports Unicode, Indic (Hindi/Devanagari), Latin, and symbols.
 */
export function sanitizeForWinAnsi(text: string, font?: PDFFont): string {
  if (!text) return '';

  let sanitized = text;

  // Apply common replacement mappings
  for (const [regex, replacement] of UNICODE_REPLACEMENTS) {
    sanitized = sanitized.replace(regex, replacement);
  }

  // If a font is provided, test each character against font.encodeText
  if (font) {
    let result = '';
    for (const char of sanitized) {
      const code = char.charCodeAt(0);
      // Newlines and tabs are always layout markers
      if (code === 10 || code === 13 || code === 9) {
        result += char;
        continue;
      }
      try {
        font.encodeText(char);
        result += char;
      } catch {
        // Character not present in this specific font
        result += ' ';
      }
    }
    return result;
  }

  return sanitized;
}
