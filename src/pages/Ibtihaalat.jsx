import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Music, Search, Shuffle, Repeat, Loader2, AudioLines } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import AudioManager from '@/components/audio/AudioManager';
import FeaturedChannels from '@/components/channels/FeaturedChannels';

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  
  const audioRef = useRef(null);

  const { data: ibtihaalat = [], isLoading } = useQuery({
    queryKey: ['ibtihaalat'],
    queryFn: () => base44.entities.Ibtihaal.list('-plays_count'),
  });

  useEffect(() => {
    const saved = localStorage.getItem('ibtihaalat_favorites');
    if (saved) setFavorites(JSON.parse(saved));
    
    const unsubscribe = AudioManager.addListener((source, status) => {
      if (source !== 'ibtihaalat' && status === 'playing') {
        audioRef.current?.pause();
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
    AudioManager.stopAll();
    
    if (currentTrack?.id === track.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      AudioManager.register(audioRef.current, 'ibtihaalat');
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audio;
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  const toggleFavorite = (trackId) => {
    const newFavorites = favorites.includes(trackId) 
      ? favorites.filter(id => id !== trackId)
      : [...favorites, trackId];
    setFavorites(newFavorites);
    localStorage.setItem('ibtihaalat_favorites', JSON.stringify(newFavorites));
    toast.success(favorites.includes(trackId) ? 'تم الإزالة من المفضلة' : 'تم الإضافة للمفضلة');
  };

  const getFilteredList = () => {
    return ibtihaalat.filter(track => {
      const matchSearch = track.title?.includes(searchQuery) || track.mubtahil_name?.includes(searchQuery);
      const matchCategory = selectedCategory === 'all' || track.category === selectedCategory;
      return matchSearch && matchCategory;
    }).map(track => ({
      id: track.id,
      title: track.title,
      mubtahil: track.mubtahil_name,
      audio: track.audio_url,
      category: track.category,
      duration: track.duration || 300
    }));
  };

  const filteredTracks = getFilteredList();

  return (
    <div className="min-h-screen relative pb-24" dir="rtl">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/90 via-amber-950/95 to-slate-950/98" />
      </div>
      
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={() => {
          if (isRepeat) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            const idx = filteredTracks.findIndex(t => t.id === currentTrack?.id);
            if (idx < filteredTracks.length - 1) {
              playTrack(filteredTracks[idx + 1]);
            }
          }
        }}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <AudioLines className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">الابتهالات والتواشيح</h1>
          <p className="text-amber-200 text-lg">أجمل الابتهالات الإسلامية بأصوات المبتهلين الكبار</p>
        </motion.div>

        {currentTrack && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="mb-8 bg-gradient-to-br from-amber-900/80 via-orange-900/80 to-amber-900/80 backdrop-blur-xl border-amber-500/30 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Music className="w-16 h-16 text-white/90" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-right">
                    <h2 className="text-3xl font-bold text-white mb-2">{currentTrack.title}</h2>
                    <p className="text-amber-200 text-xl">{currentTrack.mubtahil}</p>
                    <Badge className="mt-3 bg-amber-600 text-white">{currentTrack.category}</Badge>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/20 w-12 h-12"
                      onClick={() => toggleFavorite(currentTrack.id)}
                    >
                      <Heart className={`w-6 h-6 ${favorites.includes(currentTrack.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={(value) => {
                      if (audioRef.current) audioRef.current.currentTime = value[0];
                    }}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-amber-200">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 mt-8">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={`text-white hover:bg-white/20 w-12 h-12 ${isShuffle ? 'bg-white/20' : ''}`}
                    onClick={() => setIsShuffle(!isShuffle)}
                  >
                    <Shuffle className="w-5 h-5" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 w-12 h-12">
                    <SkipForward className="w-6 h-6" />
                  </Button>
                  
                  <Button 
                    size="lg"
                    className="w-20 h-20 rounded-full bg-white text-amber-700 hover:bg-amber-100 shadow-2xl hover:scale-110 transition-transform"
                    onClick={() => {
                      if (isPlaying) audioRef.current?.pause();
                      else audioRef.current?.play();
                      setIsPlaying(!isPlaying);
                    }}
                  >
                    {isPlaying ? <Pause className="w-9 h-9" /> : <Play className="w-9 h-9 mr-[-4px]" />}
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 w-12 h-12">
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={`text-white hover:bg-white/20 w-12 h-12 ${isRepeat ? 'bg-white/20' : ''}`}
                    onClick={() => setIsRepeat(!isRepeat)}
                  >
                    <Repeat className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => {
                      setVolume(value[0] / 100);
                      setIsMuted(false);
                    }}
                    className="w-40"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
          </div>
        )}

        {!isLoading && (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                <Input
                  placeholder="ابحث عن ابتهال أو مبتهل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 bg-slate-900/60 border-amber-500/30 text-white placeholder:text-slate-400"
                />
              </div>
              
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-4 bg-slate-900/80 backdrop-blur-xl border border-amber-500/30">
                  <TabsTrigger value="all" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">الكل</TabsTrigger>
                  <TabsTrigger value="ابتهالات" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">ابتهالات</TabsTrigger>
                  <TabsTrigger value="تواشيح" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">تواشيح</TabsTrigger>
                  <TabsTrigger value="مدائح نبوية" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">مدائح</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>

          <div className="grid gap-4">
            {filteredTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1 ${
                    currentTrack?.id === track.id 
                      ? 'bg-gradient-to-r from-amber-900/80 to-orange-900/80 ring-4 ring-amber-400/50' 
                      : 'bg-slate-900/60 border-amber-500/30'
                  } backdrop-blur-xl`}
                  onClick={() => playTrack(track)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                        currentTrack?.id === track.id && isPlaying 
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                          : 'bg-gradient-to-br from-slate-700 to-slate-800'
                      }`}>
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="w-7 h-7 text-white" />
                        ) : (
                          <Play className="w-7 h-7 text-white mr-[-2px]" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-amber-100">{track.title}</h3>
                        <p className="text-sm text-amber-300">{track.mubtahil}</p>
                      </div>
                      
                      <Badge className="bg-amber-600/80 text-white hidden md:flex">{track.category}</Badge>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-amber-300">{formatTime(track.duration)}</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-amber-300 hover:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(track.id);
                          }}
                        >
                          <Heart className={`w-6 h-6 ${favorites.includes(track.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredTracks.length === 0 && (
            <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-500/30 p-16 text-center shadow-2xl">
              <Music className="w-24 h-24 text-amber-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-amber-200 mb-3">لا توجد نتائج</h3>
              <p className="text-slate-400 text-lg">جرب البحث بكلمات أخرى</p>
            </Card>
          )}
        </>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12">
          <h2 className="text-2xl font-bold text-amber-200 mb-6">📺 قنوات الابتهالات والمدائح</h2>
          <FeaturedChannels variant="horizontal" limit={6} />
        </motion.div>
      </div>
    </div>
  );
}