import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, 
  Search, Mic, BookOpen, Star, Heart, Download, Share2,
  Loader2, ChevronRight, ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';
import AudioManager from '@/components/audio/AudioManager';
import IslamicBackground from '@/components/layout/IslamicBackground';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePlayer } from '@/components/player/ClassicAudioPlayer';

// قائمة السور
const SURAHS = [
  { number: 1, name: 'الفاتحة' }, { number: 2, name: 'البقرة' }, { number: 3, name: 'آل عمران' },
  { number: 4, name: 'النساء' }, { number: 5, name: 'المائدة' }, { number: 6, name: 'الأنعام' },
  { number: 7, name: 'الأعراف' }, { number: 8, name: 'الأنفال' }, { number: 9, name: 'التوبة' },
  { number: 10, name: 'يونس' }, { number: 11, name: 'هود' }, { number: 12, name: 'يوسف' },
  { number: 13, name: 'الرعد' }, { number: 14, name: 'إبراهيم' }, { number: 15, name: 'الحجر' },
  { number: 16, name: 'النحل' }, { number: 17, name: 'الإسراء' }, { number: 18, name: 'الكهف' },
  { number: 19, name: 'مريم' }, { number: 20, name: 'طه' }, { number: 21, name: 'الأنبياء' },
  { number: 22, name: 'الحج' }, { number: 23, name: 'المؤمنون' }, { number: 24, name: 'النور' },
  { number: 25, name: 'الفرقان' }, { number: 26, name: 'الشعراء' }, { number: 27, name: 'النمل' },
  { number: 28, name: 'القصص' }, { number: 29, name: 'العنكبوت' }, { number: 30, name: 'الروم' },
  { number: 36, name: 'يس' }, { number: 55, name: 'الرحمن' }, { number: 56, name: 'الواقعة' },
  { number: 67, name: 'الملك' }, { number: 78, name: 'النبأ' }, { number: 112, name: 'الإخلاص' },
  { number: 113, name: 'الفلق' }, { number: 114, name: 'الناس' },
];

// روابط صوتية حسب المقرئ
const AUDIO_BASE_URLS = {
  'husary': 'https://server6.mp3quran.net/qtm/',
  'afasy': 'https://server8.mp3quran.net/afs/',
  'minshawi': 'https://server10.mp3quran.net/minsh/',
  'ghamdi': 'https://server7.mp3quran.net/s_gmd/',
  'maher': 'https://server12.mp3quran.net/maher/',
  'sudais': 'https://server11.mp3quran.net/sds/',
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function Tilawa() {
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState([]);
  
  const audioRef = useRef(null);
  const { playTrack } = usePlayer();

  // جلب المقرئين من قاعدة البيانات
  const { data: reciters = [], isLoading } = useQuery({
    queryKey: ['reciters-tilawa'],
    queryFn: () => base44.entities.Reciter.list('-popularity_score'),
  });

  // تحميل المفضلة
  useEffect(() => {
    const saved = localStorage.getItem('tilawa_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // تعيين المقرئ الأول
  useEffect(() => {
    if (reciters.length > 0 && !selectedReciter) {
      setSelectedReciter(reciters[0]);
    }
  }, [reciters]);

  // الاستماع للتغييرات من المصادر الأخرى
  useEffect(() => {
    const unsubscribe = AudioManager.addListener((source, status) => {
      if (source !== 'tilawa' && status === 'playing') {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // تحديث الصوت عند تغيير المقرئ أو السورة
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const getAudioUrl = (reciterId, surahNumber) => {
    // تحديد رابط الصوت بناءً على المقرئ
    const reciterKey = reciterId?.toLowerCase().includes('عفاسي') ? 'afasy' : 
                       reciterId?.toLowerCase().includes('حصري') ? 'husary' :
                       reciterId?.toLowerCase().includes('منشاوي') ? 'minshawi' :
                       reciterId?.toLowerCase().includes('غامدي') ? 'ghamdi' :
                       reciterId?.toLowerCase().includes('معيقلي') ? 'maher' :
                       reciterId?.toLowerCase().includes('سديس') ? 'sudais' : 'afasy';
    
    const baseUrl = AUDIO_BASE_URLS[reciterKey] || AUDIO_BASE_URLS['afasy'];
    const surahStr = surahNumber.toString().padStart(3, '0');
    return `${baseUrl}${surahStr}.mp3`;
  };

  const playSurah = (surahNumber) => {
    if (!selectedReciter) return;
    
    AudioManager.stopAll();
    AudioManager.register(audioRef.current, 'tilawa');
    
    setSelectedSurah(surahNumber);
    const audioUrl = getAudioUrl(selectedReciter.name_arabic, surahNumber);
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(() => {
        toast.error('تعذر تشغيل التلاوة');
      });
      setIsPlaying(true);
    }
    
    const surahName = SURAHS.find(s => s.number === surahNumber)?.name || `سورة ${surahNumber}`;
    toast.success(`جاري تشغيل ${surahName} - ${selectedReciter.name_arabic}`);
    
    // تشغيل في المشغل العالمي
    playTrack({
      id: `tilawa-${selectedReciter.id}-${surahNumber}`,
      title: surahName,
      artist: selectedReciter.name_arabic,
      audioUrl: audioUrl,
      imageUrl: selectedReciter.image_url,
    });
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    // تشغيل السورة التالية
    const currentIndex = SURAHS.findIndex(s => s.number === selectedSurah);
    if (currentIndex < SURAHS.length - 1) {
      playSurah(SURAHS[currentIndex + 1].number);
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    const currentIndex = SURAHS.findIndex(s => s.number === selectedSurah);
    if (currentIndex < SURAHS.length - 1) {
      playSurah(SURAHS[currentIndex + 1].number);
    }
  };

  const playPrev = () => {
    const currentIndex = SURAHS.findIndex(s => s.number === selectedSurah);
    if (currentIndex > 0) {
      playSurah(SURAHS[currentIndex - 1].number);
    }
  };

  const toggleFavorite = (reciterId) => {
    const newFavorites = favorites.includes(reciterId) 
      ? favorites.filter(id => id !== reciterId)
      : [...favorites, reciterId];
    setFavorites(newFavorites);
    localStorage.setItem('tilawa_favorites', JSON.stringify(newFavorites));
    toast.success(favorites.includes(reciterId) ? 'تم الإزالة من المفضلة' : 'تم الإضافة للمفضلة');
  };

  const filteredReciters = reciters.filter(r => 
    r.name_arabic?.includes(searchQuery) || r.name_english?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSurahName = SURAHS.find(s => s.number === selectedSurah)?.name || '';

  return (
    <IslamicBackground variant="emerald">
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-amber-100 mb-2">التلاوات</h1>
          <p className="text-indigo-200">استمع لتلاوات القرآن الكريم بأصوات مشاهير القراء</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
          </div>
        )}

        {!isLoading && (
        <>
          {/* المشغل الحالي */}
          {selectedReciter && selectedSurah && (
            <Card className="mb-8 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 text-white overflow-hidden border-0">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
                    {selectedReciter.image_url ? (
                      <img src={selectedReciter.image_url} alt={selectedReciter.name_arabic} className="w-full h-full object-cover" />
                    ) : (
                      <Mic className="w-12 h-12 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-center md:text-right">
                    <h2 className="text-2xl font-bold mb-1">{currentSurahName}</h2>
                    <p className="text-emerald-200 text-lg">{selectedReciter.name_arabic}</p>
                    <div className="flex gap-2 justify-center md:justify-start mt-2">
                      {selectedReciter.recitation_style && (
                        <Badge className="bg-emerald-600">{selectedReciter.recitation_style}</Badge>
                      )}
                      <Badge variant="outline" className="border-emerald-400 text-emerald-300">{selectedReciter.country}</Badge>
                    </div>
                  </div>
                </div>

                {/* شريط التقدم */}
                <div className="mt-6">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={(value) => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = value[0];
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-emerald-200 mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* أزرار التحكم */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={playPrev}>
                    <SkipForward className="w-6 h-6" />
                  </Button>
                  
                  <Button 
                    size="lg"
                    className="w-16 h-16 rounded-full bg-white text-emerald-700 hover:bg-emerald-100"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 mr-[-4px]" />}
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={playNext}>
                    <SkipBack className="w-6 h-6" />
                  </Button>
                </div>

                {/* التحكم بالصوت */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => {
                      setVolume(value[0] / 100);
                      setIsMuted(false);
                    }}
                    className="w-32"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* اختيار المقرئ */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4">اختر المقرئ</h2>
            
            {/* البحث */}
            <div className="relative mb-4 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث عن مقرئ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-slate-900/60 border-amber-500/30 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {filteredReciters.map((reciter) => (
                <button
                  key={reciter.id}
                  onClick={() => setSelectedReciter(reciter)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    selectedReciter?.id === reciter.id 
                      ? 'bg-emerald-600 ring-2 ring-amber-400' 
                      : 'bg-slate-900/60 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                    {reciter.image_url ? (
                      <img src={reciter.image_url} alt={reciter.name_arabic} className="w-full h-full object-cover" />
                    ) : (
                      <Mic className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-white text-center max-w-[100px]">{reciter.name_arabic}</span>
                  {reciter.is_featured && (
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* اختيار السورة */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4">اختر السورة</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {SURAHS.map((surah) => (
                <Card
                  key={surah.number}
                  onClick={() => playSurah(surah.number)}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedSurah === surah.number 
                      ? 'bg-emerald-600 text-white ring-2 ring-amber-400' 
                      : 'bg-slate-900/60 hover:bg-slate-800/60 text-white'
                  }`}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                      selectedSurah === surah.number ? 'bg-white/20' : 'bg-amber-600/30'
                    }`}>
                      {surah.number}
                    </div>
                    <span className="font-bold">{surah.name}</span>
                    {selectedSurah === surah.number && isPlaying && (
                      <div className="mr-auto flex gap-0.5">
                        <div className="w-1 h-3 bg-white animate-pulse rounded" />
                        <div className="w-1 h-4 bg-white animate-pulse rounded delay-75" />
                        <div className="w-1 h-2 bg-white animate-pulse rounded delay-150" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* رابط صفحة المقرئين */}
          <div className="text-center">
            <Link to={createPageUrl('Reciters')}>
              <Button variant="outline" className="border-amber-500/50 text-amber-200 hover:bg-amber-500/20">
                <Mic className="w-5 h-5 ml-2" />
                عرض جميع المقرئين
                <ChevronLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </>
        )}
      </div>
    </IslamicBackground>
  );
}