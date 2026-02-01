import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Square, Volume2, BookOpen, Headphones } from 'lucide-react';
import { toast } from 'sonner';
import IslamicBackground from '@/components/layout/IslamicBackground';

const RECITERS = {
  khalid_al_jaleel: { name: "خالد الجليل", baseUrl: "https://server8.mp3quran.net/khalid_al_jalil/hafs/" },
  islam_sobhi: { name: "إسلام صبحي", baseUrl: "https://server11.mp3quran.net/islam_sobhi/hafs/" },
  tablawi: { name: "محمد محمود الطبلاوي", baseUrl: "https://server8.mp3quran.net/tablawi/hafs/" },
  husary: { name: "محمود خليل الحصري", baseUrl: "https://server13.mp3quran.net/husary/hafs/" },
  minshawi: { name: "محمد صديق المنشاوي", baseUrl: "https://server10.mp3quran.net/minshawi/hafs/" },
  abdulbasit: { name: "عبد الباسط عبد الصمد", baseUrl: "https://server7.mp3quran.net/basit/hafs/" },
  sudais: { name: "عبد الرحمن السديس", baseUrl: "https://server11.mp3quran.net/sds/hafs/" },
  mishary_alafasy: { name: "مشاري راشد العفاسي", baseUrl: "https://server8.mp3quran.net/afs/hafs/" }
};

const ISTIATHA_URL = "https://server8.mp3quran.net/afs/hafs/001000.mp3";
const BASMALA_URL = "https://server8.mp3quran.net/afs/hafs/001001.mp3";

export default function TilawaPage() {
  const [selectedReciter, setSelectedReciter] = useState("husary");
  const [surahNumber, setSurahNumber] = useState(1);
  const [fromAyah, setFromAyah] = useState(1);
  const [toAyah, setToAyah] = useState(7);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const playerRef = useRef(null);
  const playlistRef = useRef([]);
  const indexRef = useRef(0);
  const stoppedByUserRef = useRef(false);

  const playNext = () => {
    if (stoppedByUserRef.current) return;
    if (indexRef.current >= playlistRef.current.length) {
      setIsPlaying(false);
      toast.success('انتهت التلاوة');
      return;
    }

    const url = playlistRef.current[indexRef.current];
    
    if (!playerRef.current) {
      playerRef.current = new Audio();
    }
    
    playerRef.current.src = url;
    playerRef.current.play()
      .catch(err => {
        console.error('خطأ في التشغيل:', err);
        toast.error('حدث خطأ في تشغيل الآية');
      });
    
    playerRef.current.onended = () => {
      indexRef.current++;
      playNext();
    };
  };

  const handlePlay = () => {
    const reciter = RECITERS[selectedReciter];
    if (!reciter) {
      toast.error("القارئ غير موجود");
      return;
    }

    const s = Number(surahNumber);
    const from = Number(fromAyah);
    const to = Number(toAyah);

    if (!s || !from || !to || from > to || s < 1 || s > 114) {
      toast.error("تحقق من أرقام السورة والآيات");
      return;
    }

    playlistRef.current = [];
    indexRef.current = 0;
    stoppedByUserRef.current = false;

    // إضافة الاستعاذة
    playlistRef.current.push(ISTIATHA_URL);
    
    // إضافة البسملة إذا لم تكن سورة التوبة
    if (s !== 9) {
      playlistRef.current.push(BASMALA_URL);
    }

    // بناء قائمة التشغيل للآيات
    for (let a = from; a <= to; a++) {
      const surahStr = s.toString().padStart(3, "0");
      const ayahStr = a.toString().padStart(3, "0");
      const url = `${reciter.baseUrl}${surahStr}${ayahStr}.mp3`;
      playlistRef.current.push(url);
    }

    setIsPlaying(true);
    toast.success(`بدء التلاوة بالاستعاذة والبسملة: السورة ${s} من الآية ${from} إلى ${to}`);
    playNext();
  };

  const handleStop = () => {
    stoppedByUserRef.current = true;
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

            {/* اختيار السورة والآيات */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-amber-200 mb-2">
                  رقم السورة:
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
              <div>
                <label className="block text-sm font-bold text-amber-200 mb-2">
                  من الآية:
                </label>
                <Input
                  type="number"
                  min="1"
                  value={fromAyah}
                  onChange={(e) => setFromAyah(e.target.value)}
                  className="h-12 text-lg text-center border border-amber-700/50 bg-slate-800/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-200 mb-2">
                  إلى الآية:
                </label>
                <Input
                  type="number"
                  min="1"
                  value={toAyah}
                  onChange={(e) => setToAyah(e.target.value)}
                  className="h-12 text-lg text-center border border-amber-700/50 bg-slate-800/50 text-white"
                />
              </div>
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
                ✨ <strong>التشغيل الآلي:</strong> يبدأ بالاستعاذة، ثم البسملة (ما عدا سورة التوبة)، ثم تشغيل الآيات تلقائياً
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
              { name: 'الفاتحة', surah: 1, from: 1, to: 7 },
              { name: 'الكهف', surah: 18, from: 1, to: 110 },
              { name: 'يس', surah: 36, from: 1, to: 83 },
              { name: 'الرحمن', surah: 55, from: 1, to: 78 },
              { name: 'الملك', surah: 67, from: 1, to: 30 },
              { name: 'الإخلاص', surah: 112, from: 1, to: 4 }
            ].map(surah => (
              <Button
                key={surah.surah}
                variant="outline"
                onClick={() => {
                  setSurahNumber(surah.surah);
                  setFromAyah(surah.from);
                  setToAyah(surah.to);
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