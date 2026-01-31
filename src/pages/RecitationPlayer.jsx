import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Square } from 'lucide-react';

const RECITERS = {
  khalid_al_jaleel: { name: 'خالد الجليل', baseUrl: 'https://EveryAyah.com/data/Khalid_Al_Jaleel_64kbps/' },
  islam_sobhi: { name: 'إسلام صبحي', baseUrl: 'https://EveryAyah.com/data/IslamSobhi_128kbps/' },
  tablawi: { name: 'محمد محمود الطبلاوي', baseUrl: 'https://EveryAyah.com/data/AlTablawi_128kbps/' },
  husary: { name: 'محمود خليل الحصري', baseUrl: 'https://EveryAyah.com/data/Husary_128kbps/' },
  minshawi: { name: 'محمد صديق المنشاوي', baseUrl: 'https://EveryAyah.com/data/Minshawy_Murattal_128kbps/' },
  abdulbasit: { name: 'عبد الباسط عبد الصمد', baseUrl: 'https://EveryAyah.com/data/Abdul_Basit_Mujawwad_128kbps/' },
  sudais: { name: 'عبد الرحمن السديس', baseUrl: 'https://EveryAyah.com/data/Abdurrahmaan_As-Sudais_192kbps/' },
  mishary_alafasy: { name: 'مشاري راشد العفاسي', baseUrl: 'https://EveryAyah.com/data/Alafasy_128kbps/' }
};

export default function RecitationPlayer() {
  const [reciter, setReciter] = useState('husary');
  const [surah, setSurah] = useState(1);
  const [fromAyah, setFromAyah] = useState(1);
  const [toAyah, setToAyah] = useState(7);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const playerRef = useRef(new Audio());
  const playlistRef = useRef([]);
  const indexRef = useRef(0);
  const stoppedByUserRef = useRef(false);

  const playNext = () => {
    if (stoppedByUserRef.current) return;
    if (indexRef.current >= playlistRef.current.length) {
      setIsPlaying(false);
      return;
    }

    playerRef.current.src = playlistRef.current[indexRef.current];
    playerRef.current.play().catch(console.error);
    playerRef.current.onended = () => {
      indexRef.current++;
      playNext();
    };
  };

  const playSurah = () => {
    const selectedReciter = RECITERS[reciter];
    if (!selectedReciter) return;

    if (!surah || !fromAyah || !toAyah || fromAyah > toAyah) {
      alert('تحقق من أرقام السورة والآيات.');
      return;
    }

    playlistRef.current = [];
    indexRef.current = 0;
    stoppedByUserRef.current = false;

    // إضافة الآيات
    for (let a = fromAyah; a <= toAyah; a++) {
      const surahStr = surah.toString().padStart(3, '0');
      const ayahStr = a.toString().padStart(3, '0');
      const url = `${selectedReciter.baseUrl}${surahStr}${ayahStr}.mp3`;
      playlistRef.current.push(url);
    }

    setIsPlaying(true);
    playNext();
  };

  const stopPlayback = () => {
    stoppedByUserRef.current = true;
    playerRef.current.pause();
    playerRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-6" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white border-2 border-emerald-200 shadow-xl">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">
              🎧 تلاوة القرآن الكريم
            </h2>

            {/* اختيار القارئ */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                القارئ:
              </label>
              <Select value={reciter} onValueChange={setReciter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RECITERS).map(([id, data]) => (
                    <SelectItem key={id} value={id}>
                      {data.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* اختيار السورة والآيات */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم السورة (1–114):
                </label>
                <Input
                  type="number"
                  min="1"
                  max="114"
                  value={surah}
                  onChange={(e) => setSurah(Number(e.target.value))}
                  className="text-center"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  من الآية:
                </label>
                <Input
                  type="number"
                  min="1"
                  value={fromAyah}
                  onChange={(e) => setFromAyah(Number(e.target.value))}
                  className="text-center"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  إلى الآية:
                </label>
                <Input
                  type="number"
                  min="1"
                  value={toAyah}
                  onChange={(e) => setToAyah(Number(e.target.value))}
                  className="text-center"
                />
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="flex gap-3">
              <Button
                onClick={playSurah}
                disabled={isPlaying}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-6 text-lg"
              >
                <Play className="w-5 h-5 ml-2" />
                تشغيل التلاوة
              </Button>
              <Button
                onClick={stopPlayback}
                disabled={!isPlaying}
                variant="destructive"
                className="py-6"
              >
                <Square className="w-5 h-5" />
              </Button>
            </div>

            {/* ملاحظة */}
            <p className="text-sm text-gray-600 mt-6 text-center bg-emerald-50 p-4 rounded-lg">
              يتم تشغيل الآيات المحددة بصوت القارئ المختار تلقائياً
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}