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
    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
      {/* خلفية روحانية */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#1a3a2a] to-[#0a2a1a]" />
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fbbf24' stroke-width='0.5'%3E%3Cpolygon points='30,3 57,18 57,42 30,57 3,42 3,18'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />
      {/* توهج ذهبي مركزي */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,1), transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 p-8">
        {/* العنوان */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-300">آية اليوم</h3>
            <p className="text-white/50 text-xs">تدبّر واستأنس بكلام الله</p>
          </div>
          <div className="mr-auto">
            <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full">
              ✨ {dailyVerse.tag || 'قرآن كريم'}
            </span>
          </div>
        </div>

        {/* الآية */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-amber-400/20">
          <p
            className="text-2xl md:text-3xl text-white leading-loose text-center mb-4"
            style={{ fontFamily: 'Amiri, serif', lineHeight: 2.4, textShadow: '0 0 20px rgba(251,191,36,0.2)' }}
          >
            ﴿ {dailyVerse.arabic_text} ﴾
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mb-4" />
          {dailyVerse.tafsir_brief && (
            <p className="text-white/70 text-sm leading-relaxed text-center">
              💡 {dailyVerse.tafsir_brief}
            </p>
          )}
          {dailyVerse.surah_name && (
            <p className="text-amber-400 font-bold text-sm text-center mt-2">
              — {dailyVerse.surah_name} ({dailyVerse.verse_number})
            </p>
          )}
        </div>

        {/* الأزرار */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            onClick={handleListen}
            className={`${isPlaying ? 'bg-amber-500 text-white' : 'bg-white/10 text-amber-300 border border-amber-400/40 hover:bg-amber-400/20'}`}
          >
            <Volume2 className={`w-4 h-4 ml-1 ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying ? 'إيقاف' : 'استمع'}
          </Button>
          <Button onClick={handleCopy} className="bg-white/10 text-white/80 border border-white/20 hover:bg-white/20">
            <Copy className="w-4 h-4 ml-1" /> نسخ
          </Button>
          <Button onClick={handleShare} className="bg-white/10 text-white/80 border border-white/20 hover:bg-white/20">
            <Share2 className="w-4 h-4 ml-1" /> مشاركة
          </Button>
        </div>
      </div>
    </div>
  );
}