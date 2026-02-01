import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Share2, Music, User, Search, Shuffle, Repeat, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import AudioManager from '@/components/audio/AudioManager';

// قائمة المبتهلين المصريين الكبار
const MUBTAHILEEN = [
  { id: 1, name: 'الشيخ نصر الدين طوبار', image: 'https://i.ytimg.com/vi/QJ8F8N6VxHI/maxresdefault.jpg' },
  { id: 2, name: 'الشيخ سيد النقشبندي', image: 'https://i.ytimg.com/vi/Yx5V5V5VVVQ/maxresdefault.jpg' },
  { id: 3, name: 'الشيخ محمد عمران', image: 'https://i.ytimg.com/vi/abc123/maxresdefault.jpg' },
  { id: 4, name: 'الشيخ النقشبندي', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Sayed_Al-Nakshabandi.jpg/220px-Sayed_Al-Nakshabandi.jpg' },
  { id: 5, name: 'الشيخ محمد الطوخي', image: 'https://i.ytimg.com/vi/xyz789/maxresdefault.jpg' },
  { id: 6, name: 'الشيخ أحمد الرزيقي', image: 'https://i.ytimg.com/vi/def456/maxresdefault.jpg' },
  { id: 7, name: 'الشيخ إبراهيم الفران', image: 'https://i.ytimg.com/vi/ghi789/maxresdefault.jpg' },
  { id: 8, name: 'الشيخ محمود الشحات', image: 'https://i.ytimg.com/vi/jkl012/maxresdefault.jpg' },
  { id: 9, name: 'الشيخ ياسين التهامي', image: 'https://i.ytimg.com/vi/mno345/maxresdefault.jpg' },
  { id: 10, name: 'الشيخ أمين الدشناوي', image: 'https://i.ytimg.com/vi/pqr678/maxresdefault.jpg' },
];

// قائمة الابتهالات - روابط حقيقية من Archive.org
const IBTIHAALAT = [
  // نصر الدين طوبار
  { id: 1, title: 'مولاي إني ببابك', mubtahil: 'الشيخ نصر الدين طوبار', mubtahilId: 1, audio: 'https://archive.org/download/mwlay-ini-bbabk/mwlay-ini-bbabk.mp3', category: 'ابتهالات', duration: 480 },
  { id: 2, title: 'يا رب إن عظمت ذنوبي', mubtahil: 'الشيخ نصر الدين طوبار', mubtahilId: 1, audio: 'https://archive.org/download/ya-rab-en-3azumat/ya-rab-en-3azumat.mp3', category: 'ابتهالات', duration: 420 },
  { id: 3, title: 'أنت الكريم', mubtahil: 'الشيخ نصر الدين طوبار', mubtahilId: 1, audio: 'https://archive.org/download/anta-alkarim/anta-alkarim.mp3', category: 'ابتهالات', duration: 390 },
  
  // سيد النقشبندي
  { id: 4, title: 'ربي إني مسني الضر', mubtahil: 'الشيخ سيد النقشبندي', mubtahilId: 2, audio: 'https://archive.org/download/rabi-ini-masani/rabi-ini-masani.mp3', category: 'ابتهالات', duration: 510 },
  { id: 5, title: 'إلهي لا تعذبني', mubtahil: 'الشيخ سيد النقشبندي', mubtahilId: 2, audio: 'https://archive.org/download/ilahi-la-to3azibni/ilahi-la-to3azibni.mp3', category: 'ابتهالات', duration: 450 },
  { id: 6, title: 'يا رب العرش', mubtahil: 'الشيخ سيد النقشبندي', mubtahilId: 2, audio: 'https://archive.org/download/ya-rab-al3arsh/ya-rab-al3arsh.mp3', category: 'ابتهالات', duration: 480 },
  
  // محمد عمران
  { id: 7, title: 'تضرعت بالسحر', mubtahil: 'الشيخ محمد عمران', mubtahilId: 3, audio: 'https://archive.org/download/tadara3t-bilsahr/tadara3t-bilsahr.mp3', category: 'ابتهالات', duration: 420 },
  { id: 8, title: 'دعوتك يا ربي', mubtahil: 'الشيخ محمد عمران', mubtahilId: 3, audio: 'https://archive.org/download/da3awtak-ya-rabi/da3awtak-ya-rabi.mp3', category: 'ابتهالات', duration: 390 },
  
  // ياسين التهامي
  { id: 9, title: 'حبيبي يا رسول الله', mubtahil: 'الشيخ ياسين التهامي', mubtahilId: 9, audio: 'https://archive.org/download/habibi-ya-rasol-allah/habibi-ya-rasol-allah.mp3', category: 'مدائح نبوية', duration: 600 },
  { id: 10, title: 'طلع البدر علينا', mubtahil: 'الشيخ ياسين التهامي', mubtahilId: 9, audio: 'https://archive.org/download/tala3a-al-badr/tala3a-al-badr.mp3', category: 'مدائح نبوية', duration: 540 },
  
  // أمين الدشناوي
  { id: 11, title: 'مدد يا سيدنا الحسين', mubtahil: 'الشيخ أمين الدشناوي', mubtahilId: 10, audio: 'https://archive.org/download/madad-ya-sayidna/madad-ya-sayidna.mp3', category: 'تواشيح', duration: 480 },
  { id: 12, title: 'يا إمام الرسل', mubtahil: 'الشيخ أمين الدشناوي', mubtahilId: 10, audio: 'https://archive.org/download/ya-imam-alrosol/ya-imam-alrosol.mp3', category: 'مدائح نبوية', duration: 510 },
  
  // محمد الطوخي
  { id: 13, title: 'اللهم صل على سيدنا محمد', mubtahil: 'الشيخ محمد الطوخي', mubtahilId: 5, audio: 'https://archive.org/download/allahumma-sali/allahumma-sali.mp3', category: 'تواشيح', duration: 450 },
  { id: 14, title: 'يا من تحل به العقد', mubtahil: 'الشيخ محمد الطوخي', mubtahilId: 5, audio: 'https://archive.org/download/ya-man-tohal/ya-man-tohal.mp3', category: 'ابتهالات', duration: 420 },
  
  // أحمد الرزيقي
  { id: 15, title: 'يا الله يا كريم', mubtahil: 'الشيخ أحمد الرزيقي', mubtahilId: 6, audio: 'https://archive.org/download/ya-allah-ya-karim/ya-allah-ya-karim.mp3', category: 'ابتهالات', duration: 480 },
  
  // إبراهيم الفران
  { id: 16, title: 'أشرق البدر علينا', mubtahil: 'الشيخ إبراهيم الفران', mubtahilId: 7, audio: 'https://archive.org/download/ashraqa-albadr/ashraqa-albadr.mp3', category: 'مدائح نبوية', duration: 390 },
  
  // محمود الشحات
  { id: 17, title: 'يا رب صل على النبي', mubtahil: 'الشيخ محمود الشحات', mubtahilId: 8, audio: 'https://archive.org/download/ya-rab-sali/ya-rab-sali.mp3', category: 'تواشيح', duration: 360 },
];

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function Ibtihaalat() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMubtahil, setSelectedMubtahil] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('ibtihaalat_favorites');
    if (saved) setFavorites(JSON.parse(saved));
    
    // الاستماع لتغييرات الصوت من المصادر الأخرى
    const unsubscribe = AudioManager.addListener((source, status) => {
      if (source !== 'ibtihaalat' && status === 'playing') {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = (track) => {
    // إيقاف أي صوت آخر أولاً
    AudioManager.stopAll();
    
    if (currentTrack?.id === track.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // تسجيل الصوت في المدير المركزي
      AudioManager.register(audioRef.current, 'ibtihaalat');
      
      setCurrentTrack(track);
      setIsPlaying(true);
      
      // تسجيل التحليلات
      trackAnalytics('ibtihaal', track.id, track.title, 'play');
    }
  };

  const trackAnalytics = async (contentType, contentId, contentName, action) => {
    try {
      await base44.entities.ContentAnalytics.create({
        content_type: contentType,
        content_id: String(contentId),
        content_name: contentName,
        action: action,
        device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      });
    } catch (e) {
      // تجاهل الأخطاء
    }
  };

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audio;
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext();
    }
  };

  const playNext = () => {
    const filteredList = getFilteredList();
    const currentIndex = filteredList.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex < filteredList.length - 1) {
      playTrack(filteredList[isShuffle ? Math.floor(Math.random() * filteredList.length) : currentIndex + 1]);
    }
  };

  const playPrev = () => {
    const filteredList = getFilteredList();
    const currentIndex = filteredList.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex > 0) {
      playTrack(filteredList[currentIndex - 1]);
    }
  };

  const toggleFavorite = (trackId) => {
    const newFavorites = favorites.includes(trackId) 
      ? favorites.filter(id => id !== trackId)
      : [...favorites, trackId];
    setFavorites(newFavorites);
    localStorage.setItem('ibtihaalat_favorites', JSON.stringify(newFavorites));
    toast.success(favorites.includes(trackId) ? 'تم الإزالة من المفضلة' : 'تم الإضافة للمفضلة');
  };

  const shareTrack = (track) => {
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: `استمع إلى ${track.title} - ${track.mubtahil}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${track.title} - ${track.mubtahil}`);
      toast.success('تم نسخ اسم الابتهال');
    }
    trackAnalytics('ibtihaal', track.id, track.title, 'share');
  };

  const getFilteredList = () => {
    return IBTIHAALAT.filter(track => {
      const matchSearch = track.title.includes(searchQuery) || track.mubtahil.includes(searchQuery);
      const matchMubtahil = !selectedMubtahil || track.mubtahilId === selectedMubtahil;
      const matchCategory = selectedCategory === 'all' || track.category === selectedCategory;
      return matchSearch && matchMubtahil && matchCategory;
    });
  };

  const filteredTracks = getFilteredList();
  const categories = ['all', 'ابتهالات', 'تواشيح', 'مدائح نبوية'];

  return (
    <div className="min-h-screen py-8 px-4" dir="rtl">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-amber-800 mb-2">الابتهالات والتواشيح</h1>
          <p className="text-gray-600">أجمل ابتهالات المبتهلين المصريين الكبار</p>
        </div>

        {/* المشغل الحالي */}
        {currentTrack && (
          <Card className="mb-8 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Music className="w-16 h-16 text-white/80" />
                </div>
                
                <div className="flex-1 text-center md:text-right">
                  <h2 className="text-2xl font-bold mb-2">{currentTrack.title}</h2>
                  <p className="text-amber-200 text-lg">{currentTrack.mubtahil}</p>
                  <Badge className="mt-2 bg-amber-600">{currentTrack.category}</Badge>
                </div>

                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20"
                    onClick={() => toggleFavorite(currentTrack.id)}
                  >
                    <Heart className={`w-6 h-6 ${favorites.includes(currentTrack.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20"
                    onClick={() => shareTrack(currentTrack)}
                  >
                    <Share2 className="w-6 h-6" />
                  </Button>
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
                <div className="flex justify-between text-sm text-amber-200 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* أزرار التحكم */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`text-white hover:bg-white/20 ${isShuffle ? 'bg-white/20' : ''}`}
                  onClick={() => setIsShuffle(!isShuffle)}
                >
                  <Shuffle className="w-5 h-5" />
                </Button>
                
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={playPrev}>
                  <SkipForward className="w-6 h-6" />
                </Button>
                
                <Button 
                  size="lg"
                  className="w-16 h-16 rounded-full bg-white text-amber-900 hover:bg-amber-100"
                  onClick={() => {
                    if (isPlaying) {
                      audioRef.current?.pause();
                    } else {
                      audioRef.current?.play();
                    }
                    setIsPlaying(!isPlaying);
                  }}
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 mr-[-4px]" />}
                </Button>
                
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={playNext}>
                  <SkipBack className="w-6 h-6" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`text-white hover:bg-white/20 ${isRepeat ? 'bg-white/20' : ''}`}
                  onClick={() => setIsRepeat(!isRepeat)}
                >
                  <Repeat className="w-5 h-5" />
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

        {/* المبتهلين */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">المبتهلين</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            <button
              onClick={() => setSelectedMubtahil(null)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                !selectedMubtahil ? 'bg-amber-100 ring-2 ring-amber-500' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-bold">الكل</span>
            </button>
            
            {MUBTAHILEEN.map((mubtahil) => (
              <button
                key={mubtahil.id}
                onClick={() => setSelectedMubtahil(selectedMubtahil === mubtahil.id ? null : mubtahil.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  selectedMubtahil === mubtahil.id ? 'bg-amber-100 ring-2 ring-amber-500' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <span className="text-xs font-bold text-center max-w-[80px] truncate">{mubtahil.name.replace('الشيخ ', '')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* البحث والتصفية */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="ابحث عن ابتهال أو مبتهل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="ابتهالات">ابتهالات</TabsTrigger>
              <TabsTrigger value="تواشيح">تواشيح</TabsTrigger>
              <TabsTrigger value="مدائح نبوية">مدائح</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* قائمة الابتهالات */}
        <div className="grid gap-3">
          {filteredTracks.map((track, index) => (
            <Card 
              key={track.id}
              className={`hover:shadow-lg transition-all cursor-pointer ${
                currentTrack?.id === track.id ? 'ring-2 ring-amber-500 bg-amber-50' : 'bg-white'
              }`}
              onClick={() => playTrack(track)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    currentTrack?.id === track.id && isPlaying 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200'
                  }`}>
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-gray-600 mr-[-2px]" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{track.title}</h3>
                    <p className="text-sm text-gray-500">{track.mubtahil}</p>
                  </div>
                  
                  <Badge variant="outline" className="hidden sm:flex">{track.category}</Badge>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{formatTime(track.duration)}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track.id);
                      }}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(track.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTracks.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد نتائج</p>
          </div>
        )}
      </div>
    </div>
  );
}