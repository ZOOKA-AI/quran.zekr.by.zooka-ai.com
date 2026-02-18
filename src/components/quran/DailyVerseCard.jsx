import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Volume2, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function DailyVerseCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = React.useRef(null);

  // جلب آية اليوم
  const { data: dailyVerse } = useQuery({
    queryKey: ['daily-verse'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const verses = await base44.entities.DailyVerse.filter({ 
        verse_date: today,
        is_active: true 
      });
      return verses[0] || {
        arabic_text: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
        tafsir_brief: "بيان الغاية من خلق الإنسان: العبادة والتوحيد",
        surah_name: "الذاريات",
        verse_number: 56,
        tag: "الغاية من الخلق"
      };
    }
  });

  const handleListen = () => {
    if (!dailyVerse?.arabic_text) return;

    // إيقاف أي صوت سابق
    if (speechRef.current) {
      window.speechSynthesis.cancel();
      speechRef.current = null;
      setIsPlaying(false);
      return;
    }

    // إنشاء صوت عربي
    const utterance = new SpeechSynthesisUtterance(dailyVerse.arabic_text);
    utterance.lang = 'ar-SA'; // عربي سعودي فصيح
    utterance.rate = 0.8; // سرعة بطيئة للوضوح
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // البحث عن صوت عربي
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(voice => 
      voice.lang.startsWith('ar') || voice.lang.includes('Arabic')
    );
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      toast.success('بدأ القراءة بصوت عربي فصيح');
    };

    utterance.onend = () => {
      setIsPlaying(false);
      speechRef.current = null;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      speechRef.current = null;
      toast.error('حدث خطأ في القراءة');
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // تحميل الأصوات عند بداية المكون
  React.useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const handleCopy = () => {
    if (dailyVerse) {
      navigator.clipboard.writeText(dailyVerse.arabic_text);
      toast.success('تم نسخ الآية');
    }
  };

  const handleShare = async () => {
    if (!dailyVerse) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'آية اليوم',
          text: `${dailyVerse.arabic_text}\n\n${dailyVerse.surah_name}: ${dailyVerse.verse_number}`
        });
      } else {
        handleCopy();
        toast.success('تم نسخ الآية للمشاركة');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (!dailyVerse) return null;

  return (
    <Card className="bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 p-8 rounded-2xl shadow-2xl border-4 border-amber-400">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-8 h-8 text-white" />
        <h3 className="text-2xl font-bold text-white">آية اليوم</h3>
      </div>

      <div className="bg-white/95 rounded-xl p-6 mb-4">
        <p className="text-3xl font-arabic text-gray-900 leading-loose mb-4 text-center">
          {dailyVerse.arabic_text}
        </p>

        <div className="bg-emerald-50 rounded-lg p-4 mb-3">
          <p className="text-gray-800 text-lg mb-2">
            <span className="font-bold text-emerald-700">التفسير:</span> {dailyVerse.tafsir_brief}
          </p>
          <p className="text-emerald-600 font-bold">
            📍 {dailyVerse.surah_name}: {dailyVerse.verse_number}
          </p>
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          <Button 
            onClick={handleListen}
            className={`${isPlaying ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700'} hover:bg-emerald-100 border border-emerald-300`}
          >
            <Volume2 className={`w-4 h-4 ml-1 ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying ? 'إيقاف' : 'استمع بصوت عربي'}
          </Button>
          <Button 
            onClick={handleCopy}
            className="bg-white hover:bg-gray-50 text-amber-700 border border-amber-300"
          >
            <Copy className="w-4 h-4 ml-1" />
            نسخ
          </Button>
          <Button 
            onClick={handleShare}
            className="bg-white hover:bg-gray-50 text-blue-700 border border-blue-300"
          >
            <Share2 className="w-4 h-4 ml-1" />
            مشاركة
          </Button>
        </div>
      </div>

      {dailyVerse.tag && (
        <div className="text-center">
          <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold">
            🏷️ {dailyVerse.tag}
          </span>
        </div>
      )}
    </Card>
  );
}