import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Square, Volume2, BookOpen, Headphones } from 'lucide-react';
import { toast } from 'sonner';
import IslamicBackground from '@/components/layout/IslamicBackground';
import AudioManager from '@/components/audio/AudioManager';
import { toast } from 'sonner';

// روابط صوت القراء - كل سورة كاملة
const RECITERS = {
  husary: { name: "محمود خليل الحصري", baseUrl: "https://server13.mp3quran.net/husr/" },
  minshawi: { name: "محمد صديق المنشاوي", baseUrl: "https://server10.mp3quran.net/minsh/" },
  abdulbasit: { name: "عبد الباسط عبد الصمد", baseUrl: "https://server7.mp3quran.net/basit/" },
  sudais: { name: "عبد الرحمن السديس", baseUrl: "https://server11.mp3quran.net/sds/" },
  mishary_alafasy: { name: "مشاري راشد العفاسي", baseUrl: "https://server8.mp3quran.net/afs/" },
  maher: { name: "ماهر المعيقلي", baseUrl: "https://server12.mp3quran.net/maher/" },
  ajmi: { name: "أحمد العجمي", baseUrl: "https://server10.mp3quran.net/ajm/" },
  shuraim: { name: "سعود الشريم", baseUrl: "https://server7.mp3quran.net/shur/" }
};

export default function TilawaPage() {
  const [selectedReciter, setSelectedReciter] = useState("husary");
  const [surahNumber, setSurahNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const playerRef = useRef(null);
  const stoppedByUserRef = useRef(false);

  useEffect(() => {
    // الاستماع لتغييرات الصوت من المصادر الأخرى
    const unsubscribe = AudioManager.addListener((source, status) => {
      if (source !== 'tilawa' && status === 'playing') {
        // مصدر آخر بدأ التشغيل - إيقاف التلاوة
        if (playerRef.current) {
          playerRef.current.pause();
        }
        setIsPlaying(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const handlePlay = () => {
    const reciter = RECITERS[selectedReciter];
    if (!reciter) {
      toast.error("القارئ غير موجود");
      return;
    }

    const s = Number(surahNumber);

    if (!s || s < 1 || s > 114) {
      toast.error("تحقق من رقم السورة");
      return;
    }

    stoppedByUserRef.current = false;

    // تشغيل السورة كاملة
    const surahStr = s.toString().padStart(3, "0");
    const url = `${reciter.baseUrl}${surahStr}.mp3`;

    if (!playerRef.current) {
      playerRef.current = new Audio();
    }
    
    // تسجيل الصوت في المدير المركزي (سيوقف أي صوت آخر تلقائياً)
    AudioManager.register(playerRef.current, 'tilawa');
    
    playerRef.current.src = url;
    playerRef.current.play()
      .then(() => {
        setIsPlaying(true);
        toast.success(`جاري تشغيل سورة رقم ${s} بصوت ${reciter.name}`);
      })
      .catch(err => {
        console.error('خطأ في التشغيل:', err);
        toast.error('حدث خطأ في تشغيل السورة - جرب قارئ آخر');
      });
    
    playerRef.current.onended = () => {
      setIsPlaying(false);
      toast.success('انتهت التلاوة');
    };
  };

  const handleStop = () => {
    stoppedByUserRef.current = true;
    AudioManager.stop();
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    toast.info('تم إيقاف التلاوة');
  };

  return (
    <IslamicBackground variant="emerald">
      {/* الرأس */}
      <div className="relative text-white pt-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-5 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-3xl backdrop-blur-sm border border-amber-400/20">
                <Headphones className="w-16 h-16 text-amber-300" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-100">تلاوة القرآن الكريم</h1>
            <p className="text-xl text-indigo-200 font-arabic">﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾</p>
            <p className="text-lg text-slate-300 mt-2">استمع لكتاب الله بصوت أشهر القراء</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <Card className="bg-slate-900/60 backdrop-blur-xl shadow-2xl border border-amber-900/30">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-amber-400" />
              <h2 className="text-2xl font-bold text-amber-100">اختر القارئ والآيات</h2>
            </div>

            {/* اختيار القارئ */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-amber-200 mb-2">
                القارئ:
              </label>
              <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                <SelectTrigger className="h-12 text-lg border border-amber-700/50 bg-slate-800/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RECITERS).map(([id, reciter]) => (
                    <SelectItem key={id} value={id}>
                      {reciter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* اختيار السورة */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-amber-200 mb-2">
                رقم السورة (1-114):
              </label>
              <Input
                type="number"
                min="1"
                max="114"
                value={surahNumber}
                onChange={(e) => setSurahNumber(e.target.value)}
                className="h-12 text-lg text-center border border-amber-700/50 bg-slate-800/50 text-white"
              />
            </div>

            {/* أزرار التحكم */}
            <div className="flex gap-3">
              <Button
                onClick={handlePlay}
                disabled={isPlaying}
                className="flex-1 h-14 text-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50"
              >
                <Play className="w-5 h-5 ml-2" />
                {isPlaying ? 'جاري التشغيل...' : 'تشغيل التلاوة'}
              </Button>
              <Button
                onClick={handleStop}
                disabled={!isPlaying}
                variant="destructive"
                className="h-14 px-8 text-lg disabled:opacity-50"
              >
                <Square className="w-5 h-5 ml-2" />
                إيقاف
              </Button>
            </div>

            {/* ملاحظة */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <p className="text-sm text-amber-100 leading-relaxed mb-2">
                ✨ <strong>تشغيل السورة كاملة</strong> بصوت القارئ المختار
              </p>
              <p className="text-xs text-indigo-300">
                🎧 جودة صوت عالية من mp3quran.net
              </p>
            </div>
          </div>
        </Card>

        {/* سور مختارة */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-amber-100 mb-4">سور مختارة:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'الفاتحة', surah: 1 },
              { name: 'الكهف', surah: 18 },
              { name: 'يس', surah: 36 },
              { name: 'الرحمن', surah: 55 },
              { name: 'الملك', surah: 67 },
              { name: 'الإخلاص', surah: 112 }
            ].map(surah => (
              <Button
                key={surah.surah}
                variant="outline"
                onClick={() => {
                  setSurahNumber(surah.surah);
                  toast.success(`تم اختيار سورة ${surah.name}`);
                }}
                className="h-12 border border-amber-600/40 bg-slate-800/40 text-amber-200 hover:bg-amber-600/20"
              >
                {surah.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </IslamicBackground>
  );
}