import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ScrollText } from 'lucide-react';

const VerseSync = ({ surahNumber, currentTime, isPlaying }) => {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);

  const { data: verses = [] } = useQuery({
    queryKey: ['verses-sync', surahNumber],
    queryFn: () => base44.entities.Verse.filter({ surah_number: surahNumber }),
    initialData: [],
  });

  // تقدير تقريبي للآية الحالية بناءً على الوقت (كل آية تستغرق حوالي 15 ثانية في المتوسط)
  useEffect(() => {
    if (isPlaying && verses.length > 0) {
      const estimatedVerse = Math.floor(currentTime / 15);
      const index = Math.min(estimatedVerse, verses.length - 1);
      setCurrentVerseIndex(index);
    }
  }, [currentTime, isPlaying, verses.length]);

  if (verses.length === 0) {
    return (
      <Card className="bg-white border-2 border-gray-100 p-6 text-center">
        <ScrollText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
        <p className="text-gray-500 text-sm">لا توجد آيات متاحة للمزامنة</p>
      </Card>
    );
  }

  const currentVerse = verses[currentVerseIndex];
  const prevVerse = currentVerseIndex > 0 ? verses[currentVerseIndex - 1] : null;
  const nextVerse = currentVerseIndex < verses.length - 1 ? verses[currentVerseIndex + 1] : null;

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-800">الآية المتزامنة مع التلاوة</h3>
          </div>
          <Badge className="bg-emerald-600">
            آية {currentVerse?.verse_number || 1} من {verses.length}
          </Badge>
        </div>

        {/* Previous Verse (faded) */}
        {prevVerse && (
          <div className="mb-4 opacity-40 transition-opacity">
            <p className="text-right text-lg font-arabic leading-loose text-gray-600 p-3 bg-gray-50 rounded-lg">
              {prevVerse.arabic_text}
            </p>
          </div>
        )}

        {/* Current Verse (highlighted) */}
        <div className="mb-4 animate-pulse">
          <div className="bg-gradient-to-r from-emerald-100 to-amber-50 rounded-xl p-6 border-4 border-emerald-400 shadow-xl">
            <p className="text-right text-2xl font-arabic leading-loose text-gray-900">
              {currentVerse?.arabic_text || 'جاري التحميل...'}
            </p>
            {currentVerse?.transliteration && (
              <p className="text-right text-sm text-gray-600 mt-3 italic border-t border-emerald-200 pt-3">
                {currentVerse.transliteration}
              </p>
            )}
            {currentVerse?.translation_english && (
              <p className="text-right text-sm text-gray-700 mt-2 bg-white/60 p-3 rounded-lg">
                الترجمة: {currentVerse.translation_english}
              </p>
            )}
          </div>
        </div>

        {/* Next Verse (faded) */}
        {nextVerse && (
          <div className="opacity-40 transition-opacity">
            <p className="text-right text-lg font-arabic leading-loose text-gray-600 p-3 bg-gray-50 rounded-lg">
              {nextVerse.arabic_text}
            </p>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-4 pt-4 border-t border-emerald-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>التقدم في السورة</span>
            <span>{Math.round((currentVerseIndex / verses.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentVerseIndex / verses.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VerseSync;