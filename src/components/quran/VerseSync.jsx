import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ScrollText, ChevronUp, ChevronDown, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VerseSync = ({ surahNumber, currentTime, isPlaying, onVerseClick }) => {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const currentVerseRef = useRef(null);

  const { data: verses = [] } = useQuery({
    queryKey: ['verses-sync', surahNumber],
    queryFn: () => base44.entities.Verse.filter({ surah_number: surahNumber }),
    initialData: [],
  });

  // تقدير محسن للآية الحالية بناءً على الوقت
  useEffect(() => {
    if (isPlaying && verses.length > 0) {
      // حساب أكثر دقة: الآيات الطويلة تستغرق وقتاً أطول
      const avgTimePerVerse = 12; // متوسط الوقت لكل آية
      const estimatedVerse = Math.floor(currentTime / avgTimePerVerse);
      const index = Math.min(Math.max(0, estimatedVerse), verses.length - 1);
      setCurrentVerseIndex(index);
    }
  }, [currentTime, isPlaying, verses.length]);

  // التمرير التلقائي للآية الحالية
  useEffect(() => {
    if (autoScroll && currentVerseRef.current && isPlaying) {
      currentVerseRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [currentVerseIndex, autoScroll, isPlaying]);

  const goToVerse = (index) => {
    setCurrentVerseIndex(index);
    if (onVerseClick) {
      onVerseClick(index);
    }
  };

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
          <div className="flex items-center gap-2">
            <Button
              variant={autoScroll ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoScroll(!autoScroll)}
              className={autoScroll ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {autoScroll ? "تمرير تلقائي ✓" : "تمرير يدوي"}
            </Button>
            <Badge className="bg-emerald-600">
              آية {currentVerse?.verse_number || 1} من {verses.length}
            </Badge>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToVerse(Math.max(0, currentVerseIndex - 1))}
            disabled={currentVerseIndex === 0}
          >
            <ChevronUp className="w-4 h-4 ml-1" />
            السابقة
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToVerse(Math.min(verses.length - 1, currentVerseIndex + 1))}
            disabled={currentVerseIndex === verses.length - 1}
          >
            التالية
            <ChevronDown className="w-4 h-4 mr-1" />
          </Button>
        </div>

        {/* Previous Verse (faded) */}
        <AnimatePresence>
          {prevVerse && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="mb-4 cursor-pointer hover:opacity-60 transition-opacity"
              onClick={() => goToVerse(currentVerseIndex - 1)}
            >
              <p className="text-right text-lg font-arabic leading-loose text-gray-600 p-3 bg-gray-50 rounded-lg">
                <span className="text-emerald-600 text-sm ml-2">﴿{prevVerse.verse_number}﴾</span>
                {prevVerse.arabic_text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Verse (highlighted) */}
        <motion.div 
          ref={currentVerseRef}
          key={currentVerseIndex}
          initial={{ scale: 0.98, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <div className={`bg-gradient-to-r from-emerald-100 to-amber-50 rounded-xl p-6 border-4 ${isPlaying ? 'border-emerald-500 shadow-emerald-200' : 'border-emerald-400'} shadow-xl transition-all`}>
            <div className="flex items-center gap-2 mb-3">
              {isPlaying && (
                <div className="flex items-center gap-1 text-emerald-600">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-bold">جاري التلاوة</span>
                </div>
              )}
              <Badge variant="outline" className="border-emerald-500 text-emerald-700">
                آية {currentVerse?.verse_number}
              </Badge>
            </div>
            <p className="text-right text-2xl md:text-3xl font-arabic leading-loose text-gray-900">
              {currentVerse?.arabic_text || 'جاري التحميل...'}
              <span className="text-emerald-600 text-lg mr-2">﴿{currentVerse?.verse_number}﴾</span>
            </p>
            {currentVerse?.transliteration && (
              <p className="text-right text-sm text-gray-600 mt-3 italic border-t border-emerald-200 pt-3">
                {currentVerse.transliteration}
              </p>
            )}
            {currentVerse?.translation_english && (
              <p className="text-left text-sm text-gray-700 mt-2 bg-white/60 p-3 rounded-lg" dir="ltr">
                {currentVerse.translation_english}
              </p>
            )}
          </div>
        </motion.div>

        {/* Next Verse (faded) */}
        <AnimatePresence>
          {nextVerse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="cursor-pointer hover:opacity-60 transition-opacity"
              onClick={() => goToVerse(currentVerseIndex + 1)}
            >
              <p className="text-right text-lg font-arabic leading-loose text-gray-600 p-3 bg-gray-50 rounded-lg">
                <span className="text-emerald-600 text-sm ml-2">﴿{nextVerse.verse_number}﴾</span>
                {nextVerse.arabic_text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="mt-4 pt-4 border-t border-emerald-200">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>التقدم في السورة</span>
            <span>{currentVerseIndex + 1} / {verses.length} ({Math.round(((currentVerseIndex + 1) / verses.length) * 100)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentVerseIndex + 1) / verses.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {/* Verse dots indicator */}
          <div className="flex gap-1 mt-3 flex-wrap justify-center">
            {verses.slice(0, 20).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToVerse(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentVerseIndex 
                    ? 'bg-emerald-600 w-4' 
                    : idx < currentVerseIndex 
                      ? 'bg-emerald-300' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
            {verses.length > 20 && <span className="text-gray-400 text-xs">...</span>}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VerseSync;