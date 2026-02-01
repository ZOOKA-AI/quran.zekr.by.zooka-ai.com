import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, Square, Headphones, Search, Users, BookOpen, 
  Loader2, Star, Grid, List 
} from 'lucide-react';
import { toast } from 'sonner';
import IslamicBackground from '@/components/layout/IslamicBackground';
import AudioManager from '@/components/audio/AudioManager';
import ReciterCard from '@/components/tilawa/ReciterCard';
import AudioControls from '@/components/tilawa/AudioControls';

// روابط صوت القراء
const RECITER_URLS = {
  'محمود خليل الحصري': 'https://server13.mp3quran.net/husr/',
  'الشيخ محمود خليل الحصري': 'https://server13.mp3quran.net/husr/',
  'محمد صديق المنشاوي': 'https://server10.mp3quran.net/minsh/',
  'عبد الباسط عبد الصمد': 'https://server7.mp3quran.net/basit/',
  'الشيخ عبد الباسط عبد الصمد': 'https://server7.mp3quran.net/basit/',
  'عبد الرحمن السديس': 'https://server11.mp3quran.net/sds/',
  'الشيخ عبد الرحمن السديس': 'https://server11.mp3quran.net/sds/',
  'مشاري راشد العفاسي': 'https://server8.mp3quran.net/afs/',
  'الشيخ مشاري بن راشد العفاسي': 'https://server8.mp3quran.net/afs/',
  'ماهر المعيقلي': 'https://server12.mp3quran.net/maher/',
  'الشيخ ماهر المعيقلي': 'https://server12.mp3quran.net/maher/',
  'أحمد العجمي': 'https://server10.mp3quran.net/ajm/',
  'الشيخ أحمد العجمي': 'https://server10.mp3quran.net/ajm/',
  'سعود الشريم': 'https://server7.mp3quran.net/shur/',
  'الشيخ سعود الشريم': 'https://server7.mp3quran.net/shur/',
  'سعد الغامدي': 'https://server7.mp3quran.net/s_gmd/',
  'الشيخ سعد الغامدي': 'https://server7.mp3quran.net/s_gmd/',
  'ياسر الدوسري': 'https://server11.mp3quran.net/yasser/',
  'الشيخ ياسر الدوسري': 'https://server11.mp3quran.net/yasser/',
  'ناصر القطامي': 'https://server6.mp3quran.net/qtm/',
  'الشيخ ناصر القطامي': 'https://server6.mp3quran.net/qtm/',
};

// السور المشهورة
const POPULAR_SURAHS = [
  { number: 1, name: 'الفاتحة' },
  { number: 2, name: 'البقرة' },
  { number: 18, name: 'الكهف' },
  { number: 36, name: 'يس' },
  { number: 55, name: 'الرحمن' },
  { number: 67, name: 'الملك' },
  { number: 78, name: 'النبأ' },
  { number: 112, name: 'الإخلاص' },
];

export default function TilawaPage() {
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [surahNumber, setSurahNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentTrack, setCurrentTrack] = useState(null);
  
  const playerRef = useRef(null);

  // جلب القراء من قاعدة البيانات
  const { data: reciters = [], isLoading: loadingReciters } = useQuery({
    queryKey: ['reciters'],
    queryFn: () => base44.entities.Reciter.list('-popularity_score'),
  });

  // فلترة القراء
  const filteredReciters = reciters.filter(reciter => 
    reciter.name_arabic?.includes(searchQuery) ||
    reciter.name_english?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reciter.country?.includes(searchQuery)
  );

  // القراء المميزون
  const featuredReciters = reciters.filter(r => r.is_featured);

  useEffect(() => {
    const unsubscribe = AudioManager.addListener((source, status) => {
      if (source !== 'tilawa' && status === 'playing') {
        if (playerRef.current) {
          playerRef.current.pause();
        }
        setIsPlaying(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const getReciterUrl = (reciter) => {
    // محاولة إيجاد URL للقارئ
    const names = [reciter.name_arabic, reciter.name_english];
    for (const name of names) {
      if (RECITER_URLS[name]) return RECITER_URLS[name];
    }
    // البحث الجزئي
    for (const [key, url] of Object.entries(RECITER_URLS)) {
      if (reciter.name_arabic?.includes(key) || key.includes(reciter.name_arabic)) {
        return url;
      }
    }
    return null;
  };

  const handlePlay = () => {
    if (!selectedReciter) {
      toast.error('اختر قارئاً أولاً');
      return;
    }

    const baseUrl = getReciterUrl(selectedReciter);
    if (!baseUrl) {
      toast.error('رابط القارئ غير متوفر حالياً');
      return;
    }

    const s = Number(surahNumber);
    if (!s || s < 1 || s > 114) {
      toast.error('تحقق من رقم السورة (1-114)');
      return;
    }

    setIsLoading(true);
    AudioManager.stopAll();

    const surahStr = s.toString().padStart(3, '0');
    const url = `${baseUrl}${surahStr}.mp3`;

    if (!playerRef.current) {
      playerRef.current = new Audio();
    }

    AudioManager.register(playerRef.current, 'tilawa');
    playerRef.current.src = url;

    playerRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
        setCurrentTrack({
          title: `سورة رقم ${s}`,
          reciter: selectedReciter.name_arabic,
          url
        });
        toast.success(`جاري تشغيل سورة رقم ${s} بصوت ${selectedReciter.name_arabic}`);
      })
      .catch(err => {
        console.error('خطأ في التشغيل:', err);
        setIsLoading(false);
        toast.error('حدث خطأ في تشغيل السورة - جرب قارئ آخر');
      });

    playerRef.current.onended = () => {
      setIsPlaying(false);
      toast.success('انتهت التلاوة');
    };
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else if (currentTrack) {
      playerRef.current.play();
      setIsPlaying(true);
    } else {
      handlePlay();
    }
  };

  const handleStop = () => {
    AudioManager.stop();
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    toast.info('تم إيقاف التلاوة');
  };

  const handleSelectReciter = (reciter) => {
    setSelectedReciter(reciter);
    toast.success(`تم اختيار ${reciter.name_arabic}`);
  };

  return (
    <IslamicBackground variant="emerald">
      {/* الرأس */}
      <div className="relative text-white pt-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* القسم الأيمن - قائمة القراء */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <TabsList className="bg-slate-800/60">
                  <TabsTrigger value="all" className="gap-2">
                    <Users className="w-4 h-4" />
                    جميع القراء
                  </TabsTrigger>
                  <TabsTrigger value="featured" className="gap-2">
                    <Star className="w-4 h-4" />
                    المميزون
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="ابحث عن قارئ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 w-48 bg-slate-800/60 border-slate-700 text-white"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="text-slate-400"
                  >
                    {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <TabsContent value="all">
                {loadingReciters ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                  </div>
                ) : (
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
                    : 'space-y-3'
                  }>
                    {filteredReciters.map(reciter => (
                      <ReciterCard
                        key={reciter.id}
                        reciter={reciter}
                        isSelected={selectedReciter?.id === reciter.id}
                        onSelect={handleSelectReciter}
                      />
                    ))}
                  </div>
                )}

                {!loadingReciters && filteredReciters.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">لم يتم العثور على قراء</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="featured">
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
                  : 'space-y-3'
                }>
                  {featuredReciters.map(reciter => (
                    <ReciterCard
                      key={reciter.id}
                      reciter={reciter}
                      isSelected={selectedReciter?.id === reciter.id}
                      onSelect={handleSelectReciter}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* القسم الأيسر - التحكم بالتشغيل */}
          <div className="space-y-6">
            {/* اختيار السورة */}
            <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-900/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-bold text-amber-100">اختر السورة</h3>
              </div>

              <div className="mb-4">
                <label className="text-sm text-slate-400 mb-2 block">رقم السورة (1-114):</label>
                <Input
                  type="number"
                  min="1"
                  max="114"
                  value={surahNumber}
                  onChange={(e) => setSurahNumber(e.target.value)}
                  className="h-12 text-lg text-center bg-slate-800/60 border-slate-700 text-white"
                />
              </div>

              {/* سور مختارة */}
              <div className="grid grid-cols-4 gap-2">
                {POPULAR_SURAHS.map(surah => (
                  <Button
                    key={surah.number}
                    variant="outline"
                    size="sm"
                    onClick={() => setSurahNumber(surah.number)}
                    className={`text-xs border-slate-700 ${
                      Number(surahNumber) === surah.number 
                        ? 'bg-amber-600/30 border-amber-500 text-amber-200' 
                        : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    {surah.name}
                  </Button>
                ))}
              </div>

              {/* زر التشغيل */}
              <Button
                onClick={handlePlay}
                disabled={!selectedReciter || isLoading}
                className="w-full h-14 mt-4 text-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                ) : (
                  <Play className="w-5 h-5 ml-2" />
                )}
                {isLoading ? 'جاري التحميل...' : 'تشغيل التلاوة'}
              </Button>

              {!selectedReciter && (
                <p className="text-sm text-amber-300/70 text-center mt-2">
                  ← اختر قارئاً من القائمة أولاً
                </p>
              )}
            </Card>

            {/* عناصر التحكم بالتشغيل */}
            {(isPlaying || currentTrack) && (
              <AudioControls
                audioRef={playerRef}
                isPlaying={isPlaying}
                isLoading={isLoading}
                onPlayPause={handlePlayPause}
                onStop={handleStop}
                currentTrack={currentTrack}
              />
            )}

            {/* القارئ المختار */}
            {selectedReciter && (
              <Card className="bg-gradient-to-br from-amber-600/20 to-amber-700/10 border-amber-500/30 p-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedReciter.image_url} 
                    alt={selectedReciter.name_arabic}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-amber-100">{selectedReciter.name_arabic}</h4>
                    <p className="text-sm text-slate-400">{selectedReciter.country}</p>
                  </div>
                </div>
                {selectedReciter.bio && (
                  <p className="text-sm text-slate-300 mt-3 leading-relaxed">{selectedReciter.bio}</p>
                )}
              </Card>
            )}

            {/* ملاحظة */}
            <Card className="bg-amber-500/10 border-amber-500/30 p-4">
              <p className="text-sm text-amber-100 leading-relaxed">
                ✨ <strong>تشغيل السورة كاملة</strong> بجودة صوت عالية
              </p>
              <p className="text-xs text-indigo-300 mt-2">
                🎧 المصدر: mp3quran.net
              </p>
            </Card>
          </div>
        </div>
      </div>
    </IslamicBackground>
  );
}