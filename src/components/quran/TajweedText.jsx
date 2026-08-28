import React, { useMemo } from 'react';

/**
 * Tajweed rules color coding for Quran text
 * Each rule has a specific color to help readers pronounce correctly
 */
const TAJWEED_COLORS = {
  ghunnah: '#1fa355',      // Green - Ghunnah (nasalization)
  ikhfa: '#d94741',        // Red - Ikhfa (hiding)
  idgham: '#169be0',       // Blue - Idgham (merging)
  iqlab: '#987ab5',        // Purple - Iqlab (changing)
  qalqalah: '#b5541a',     // Brown/Orange - Qalqalah (echoing)
  madd: '#dd9800',         // Amber - Madd (prolongation)
};

/**
 * Tajweed rules definitions
 * These patterns help identify where Tajweed rules apply
 */
const TAJWEED_RULES = [
  // Ghunnah - occurs with noon and meem with shaddah
  {
    name: 'ghunnah',
    // Noon or Meem with shaddah (ّ)
    pattern: /([نم]ّ)/g,
    color: TAJWEED_COLORS.ghunnah,
  },
  // Ikhfa - noon sakinah or tanween followed by specific letters
  {
    name: 'ikhfa',
    // Letters that cause Ikhfa: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك
    pattern: /(نْ?[تثجدذزسشصضطظفقك]|[ًٌٍ]\s*[تثجدذزسشصضطظفقك])/g,
    color: TAJWEED_COLORS.ikhfa,
  },
  // Idgham - noon sakinah or tanween followed by specific letters (يرملون)
  {
    name: 'idgham',
    // Letters: ي ر م ل و ن
    pattern: /(نْ?[يرملون]|[ًٌٍ]\s*[يرملون])/g,
    color: TAJWEED_COLORS.idgham,
  },
  // Iqlab - noon sakinah or tanween followed by ب
  {
    name: 'iqlab',
    pattern: /(نْ?ب|[ًٌٍ]\s*ب)/g,
    color: TAJWEED_COLORS.iqlab,
  },
  // Qalqalah - echoing letters ق ط ب ج د when sakinah
  {
    name: 'qalqalah',
    pattern: /([قطبجد]ْ)/g,
    color: TAJWEED_COLORS.qalqalah,
  },
  // Madd - prolongation markers (alef, waw, ya with sukun after fatha, damma, kasra)
  {
    name: 'madd',
    // Madd (prolongation) patterns:
    // - Fatha + Alef (مد بالألف)
    // - Damma + Waw with optional sukun (مد بالواو)
    // - Kasra + Ya with optional sukun (مد بالياء)
    // - Maddah sign ٓ (علامة المد)
    // - Superscript Alef ـٰ (ألف خنجرية)
    pattern: /([َ]ا|[ُ]وْ?|[ِ]يْ?|ٓ|ـٰ)/g,
    color: TAJWEED_COLORS.madd,
  },
];

/**
 * Parse Arabic text and apply Tajweed color coding
 * Returns an array of segments with their respective colors
 */
function parseTajweedText(text) {
  if (!text) return [];

  // Create a map of character positions to their Tajweed rules
  const colorMap = new Map();
  
  for (const rule of TAJWEED_RULES) {
    let match;
    const regex = new RegExp(rule.pattern.source, 'g');
    while ((match = regex.exec(text)) !== null) {
      const startIndex = match.index;
      const matchedText = match[0];
      for (let i = 0; i < matchedText.length; i++) {
        // Only set color if not already set (rules earlier in TAJWEED_RULES array take precedence)
        if (!colorMap.has(startIndex + i)) {
          colorMap.set(startIndex + i, rule.color);
        }
      }
    }
  }

  // Build segments
  const segments = [];
  let currentSegment = { text: '', color: null };
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const color = colorMap.get(i) || null;
    
    if (color === currentSegment.color) {
      currentSegment.text += char;
    } else {
      if (currentSegment.text) {
        segments.push(currentSegment);
      }
      currentSegment = { text: char, color };
    }
  }
  
  if (currentSegment.text) {
    segments.push(currentSegment);
  }
  
  return segments;
}

/**
 * TajweedText Component
 * Renders Quran text with Tajweed color coding
 */
export default function TajweedText({ 
  text, 
  enabled = true, 
  className = '',
  style = {},
  showLegend = false,
}) {
  const segments = useMemo(() => {
    if (!enabled) {
      return [{ text, color: null }];
    }
    return parseTajweedText(text);
  }, [text, enabled]);

  if (!text) return null;

  return (
    <span className={className} style={style}>
      {segments.map((segment, index) => (
        <span
          key={index}
          style={segment.color ? { color: segment.color } : undefined}
        >
          {segment.text}
        </span>
      ))}
      
      {showLegend && enabled && (
        <div className="mt-4 flex flex-wrap gap-3 text-sm justify-center border-t pt-4">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TAJWEED_COLORS.ghunnah }} />
            <span className="text-gray-600">غنة</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TAJWEED_COLORS.ikhfa }} />
            <span className="text-gray-600">إخفاء</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TAJWEED_COLORS.idgham }} />
            <span className="text-gray-600">إدغام</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TAJWEED_COLORS.iqlab }} />
            <span className="text-gray-600">إقلاب</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TAJWEED_COLORS.qalqalah }} />
            <span className="text-gray-600">قلقلة</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TAJWEED_COLORS.madd }} />
            <span className="text-gray-600">مد</span>
          </div>
        </div>
      )}
    </span>
  );
}

// Export colors for use in other components
export { TAJWEED_COLORS };
