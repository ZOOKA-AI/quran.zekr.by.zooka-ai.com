import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Square, Volume2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const RECITERS = {
  khalid_al_jaleel: { name: "خالد الجليل", baseUrl: "https://EveryAyah.com/data/Khalid_Al_Jaleel_64kbps/" },
  islam_sobhi: { name: "إسلام صبحي", baseUrl: "https://EveryAyah.com/data/IslamSobhi_128kbps/" },
  tablawi: { name: "محمد محمود الطبلاوي", baseUrl: "https://EveryAyah.com/data/AlTablawi_128kbps/" },
  elsayed_saeed: { name: "السيد سعيد", baseUrl: "https://EveryAyah.com/data/ElsayedSaeed_64kbps/" },
  mohamed_elleithy: { name: "محمد الليثي", baseUrl: "https://EveryAyah.com/data/Mohamed_Al_Lithy_128kbps/" },
  husary: { name: "محمود خليل الحصري", baseUrl: "https://EveryAyah.com/data/Husary_128kbps/" },
  minshawi: { name: "محمد صديق المنشاوي", baseUrl: "https://EveryAyah.com/data/Minshawy_Murattal_128kbps/" },
  abdulbasit: { name: "عبد الباسط عبد الصمد", baseUrl: "https://EveryAyah.com/data/Abdul_Basit_Mujawwad_128kbps/" },
  sudais: { name: "عبد الرحمن السديس", baseUrl: "https://EveryAyah.com/data/Abdurrahmaan_As-Sudais_192kbps/" },
  shuraim: { name: "سعود الشريم", baseUrl: "https://EveryAyah.com/data/Saood_Shreem_128kbps/" },
  maher_muaiqly: { name: "ماهر المعيقلي", baseUrl: "https://EveryAyah.com/data/MaherAlMuaiqly_64kbps/" },
  saad_al_ghamdi: { name: "سعد الغامدي", baseUrl: "https://EveryAyah.com/data/SaadAlGhamdi_128kbps/" },
  mishary_alafasy: { name: "مشاري راشد العفاسي", baseUrl: "https://EveryAyah.com/data/Alafasy_128kbps/" },
  abdullah_matroud: { name: "عبد الله المطرود", baseUrl: "https://EveryAyah.com/data/Abdullah_Almatroud_128kbps/" },
  ali_jaber: { name: "علي جابر", baseUrl: "https://EveryAyah.com/data/Ali_Jaber_64kbps/" }
};

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

    // بناء قائمة التشغيل
    for (let a = from; a <= to; a++) {
      const surahStr = s.toString().padStart(3, "0");
      const ayahStr = a.toString().padStart(3, "0");
      const url = `${reciter.baseUrl}${surahStr}${ayahStr}.mp3`;
      playlistRef.current.push(url);
    }

    setIsPlaying(true);
    toast.success(`بدء التلاوة: السورة ${s} من الآية ${from} إلى ${to}`);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Volume2 className="w-16 h-16 text-amber-300" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">تلاوة القرآن الكريم</h1>
            <p className="text-xl text-emerald-100">استمع لكتاب الله بصوت أشهر القراء</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <Card className="bg-white shadow-2xl border-2 border-emerald-100">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-emerald-600" />
              <h2 className="text-2xl font-bold text-gray-800">اختر القارئ والآيات</h2>
            </div>

            {/* Reciter Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                القارئ:
              </label>
              <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                <SelectTrigger className="h-12 text-lg border-2 border-emerald-200">
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

            {/* Surah and Ayah Selection */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  رقم السورة:
                </label>
                <Input
                  type="number"
                  min="1"
                  max="114"
                  value={surahNumber}
                  onChange={(e) => setSurahNumber(e.target.value)}
                  className="h-12 text-lg text-center border-2 border-emerald-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  من الآية:
                </label>
                <Input
                  type="number"
                  min="1"
                  value={fromAyah}
                  onChange={(e) => setFromAyah(e.target.value)}
                  className="h-12 text-lg text-center border-2 border-emerald-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  إلى الآية:
                </label>
                <Input
                  type="number"
                  min="1"
                  value={toAyah}
                  onChange={(e) => setToAyah(e.target.value)}
                  className="h-12 text-lg text-center border-2 border-emerald-200"
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handlePlay}
                disabled={isPlaying}
                className="flex-1 h-14 text-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50"
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

            {/* Info Note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                💡 <strong>ملاحظة:</strong> سيتم تشغيل الآيات المحددة تلقائياً واحدة تلو الأخرى بصوت القارئ المختار.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Surahs */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">سور مختارة سريعة:</h3>
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
                className="h-12 border-2 border-emerald-200 hover:bg-emerald-50"
              >
                {surah.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}