import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Heart, Clock, Music2, Mic2, Star, Volume2, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import AudioManager from '@/components/audio/AudioManager';

// روابط صوتية حقيقية للتواشيح والابتهالات
const TAWASHEEH = [
  { id: 1, title: 'مولاي إني ببابك', artist: 'النقشبندي', duration: '8:45', category: 'ابتهالات', url: 'https://archive.org/download/mwlay-ini-bbabk/mwlay-ini-bbabk.mp3', featured: true },
  { id: 2, title: 'يا رب العباد', artist: 'سيد النقشبندي', duration: '12:30', category: 'ابتهالات', url: 'https://archive.org/download/ya-rab-al3ebad/ya-rab-al3ebad.mp3', featured: true },
  { id: 3, title: 'حبيبي يا رسول الله', artist: 'محمد عمران', duration: '6:20', category: 'تواشيح', url: 'https://archive.org/download/habibi-ya-rasol-allah/habibi-ya-rasol-allah.mp3', featured: false },
  { id: 4, title: 'طلع البدر علينا', artist: 'المنشد المصري', duration: '4:15', category: 'أناشيد', url: 'https://archive.org/download/tala3a-al-badr/tala3a-al-badr.mp3', featured: true },
  { id: 5, title: 'يا إمام الرسل', artist: 'نصر الدين طوبار', duration: '15:00', category: 'ابتهالات', url: 'https://archive.org/download/ya-imam-alrosol/ya-imam-alrosol.mp3', featured: true },
  { id: 6, title: 'رباه يا من أناجي', artist: 'النقشبندي', duration: '10:30', category: 'ابتهالات', url: 'https://archive.org/download/rabah-ya-man-onaji/rabah-ya-man-onaji.mp3', featured: false },
  { id: 7, title: 'أشرق المعنى', artist: 'نصر الدين طوبار', duration: '9:00', category: 'تواشيح', url: 'https://archive.org/download/ashraqa-alma3na/ashraqa-alma3na.mp3', featured: false },
  { id: 8, title: 'لبيك اللهم لبيك', artist: 'محمد الهلباوي', duration: '5:30', category: 'أناشيد', url: 'https://archive.org/download/labayk-allahuma/labayk-allahuma.mp3', featured: true },
];

const CATEGORIES = [
  { id: 'all', name: 'الكل', icon: Music2 },
  { id: 'ابتهالات', name: 'ابتهالات', icon: Mic2 },
  { id: 'تواشيح', name: 'تواشيح', icon: Music2 },
  { id: 'أناشيد', name: 'أناشيد', icon: Star },
];

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function Tawasheeh() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);

  useEffect(() => {
    // الاستماع لتغييرات الصوت من المصادر الأخرى
    const unsubscribe = AudioManager.addListener((source, status) => {
      if (source !== 'tawasheeh' && status === 'playing') {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      // تسجيل الصوت في المدير المركزي
      AudioManager.register(audioRef.current, 'tawasheeh');
      
      audioRef.current.src = currentTrack.url;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(err => {
        toast.error('تعذر تشغيل الصوت');
      });
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    const currentIndex = TAWASHEEH.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex < TAWASHEEH.length - 1) {
      setCurrentTrack(TAWASHEEH[currentIndex + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  const playTrack = (track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      toast.info('تم إيقاف التشغيل');
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      toast.success(`جاري تشغيل: ${track.title}`);
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
    const currentIndex = TAWASHEEH.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex < TAWASHEEH.length - 1) {
      setCurrentTrack(TAWASHEEH[currentIndex + 1]);
      setIsPlaying(true);
    }
  };

  const playPrev = () => {
    const currentIndex = TAWASHEEH.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex > 0) {
      setCurrentTrack(TAWASHEEH[currentIndex - 1]);
      setIsPlaying(true);
    }
  };

  const toggleFavorite = (trackId) => {
    setFavorites(prev => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  const filteredTracks = TAWASHEEH.filter(track => 
    selectedCategory === 'all' || track.category === selectedCategory
  );

  const featuredTracks = TAWASHEEH.filter(t => t.featured);

  return (
    <div className="min-h-screen py-8 px-4" dir="rtl">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Music2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">التواشيح والابتهالات</h1>
          <p className="text-gray-600">أجمل الابتهالات والتواشيح المصرية الأصيلة</p>
        </div>

        {/* Now Playing */}
        {currentTrack && (
          <Card className="mb-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      {isPlaying ? (
                        <div className="flex gap-1 items-end">
                          <div className="w-1 h-4 bg-white animate-bounce rounded" style={{ animationDelay: '0ms' }} />
                          <div className="w-1 h-6 bg-white animate-bounce rounded" style={{ animationDelay: '150ms' }} />
                          <div className="w-1 h-3 bg-white animate-bounce rounded" style={{ animationDelay: '300ms' }} />
                          <div className="w-1 h-5 bg-white animate-bounce rounded" style={{ animationDelay: '450ms' }} />
                        </div>
                      ) : (
                        <Music2 className="w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <p className="text-xl font-bold">{currentTrack.title}</p>
                      <p className="opacity-80">{currentTrack.artist}</p>
                    </div>
                  </div>
                </div>

                {/* شريط التقدم */}
                <div className="w-full">
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
                  <div className="flex justify-between text-sm opacity-70 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* أزرار التحكم */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="ghost" size="icon" onClick={playPrev} className="text-white hover:bg-white/20">
                    <SkipForward className="w-6 h-6" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={togglePlayPause}
                    className="w-14 h-14 rounded-full bg-white text-amber-600 hover:bg-white/90"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 mr-1" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={playNext} className="text-white hover:bg-white/20">
                    <SkipBack className="w-6 h-6" />
                  </Button>
                </div>

                {/* التحكم بالصوت */}
                <div className="flex items-center justify-center gap-3">
                  <Volume2 className="w-5 h-5" />
                  <Slider
                    value={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                    className="w-32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Featured Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            مختارات مميزة
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {featuredTracks.map(track => (
              <Card 
                key={track.id}
                className="min-w-[200px] cursor-pointer hover:shadow-lg transition-all"
                onClick={() => playTrack(track)}
              >
                <CardContent className="p-4">
                  <div className="w-full h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-3 flex items-center justify-center">
                    <Music2 className="w-10 h-10 text-amber-600" />
                  </div>
                  <p className="font-bold text-gray-800 truncate">{track.title}</p>
                  <p className="text-sm text-gray-500">{track.artist}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className={`gap-2 ${selectedCategory === cat.id ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </Button>
            );
          })}
        </div>

        {/* Tracks List */}
        <div className="space-y-3">
          {filteredTracks.map(track => (
            <Card 
              key={track.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                currentTrack?.id === track.id ? 'ring-2 ring-amber-500 bg-amber-50' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4" onClick={() => playTrack(track)}>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      currentTrack?.id === track.id && isPlaying
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100'
                    }`}>
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 text-amber-600 mr-0.5" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{track.title}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{track.artist}</span>
                        <Badge variant="secondary">{track.category}</Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {track.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track.id);
                    }}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(track.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}