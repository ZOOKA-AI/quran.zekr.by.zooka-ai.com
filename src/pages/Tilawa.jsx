import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Search, Mic, Star, Loader2, Music } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import AudioManager from '@/components/audio/AudioManager';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePlayer } from '@/components/player/ClassicAudioPlayer';
import FeaturedChannels from '@/components/channels/FeaturedChannels';
import VideoGrid from '@/components/videos/VideoGrid';

const SURAHS = [
  { number: 1, name: 'الفاتحة' }, { number: 2, name: 'البقرة' }, { number: 3, name: 'آل عمران' },
  { number: 4, name: 'النساء' }, { number: 5, name: 'المائدة' }, { number: 6, name: 'الأنعام' },
  { number: 7, name: 'الأعراف' }, { number: 18, name: 'الكهف' }, { number: 36, name: 'يس' },
  { number: 55, name: 'الرحمن' }, { number: 67, name: 'الملك' }, { number: 112, name: 'الإخلاص' },
  { number: 113, name: 'الفلق' }, { number: 114, name: 'الناس' }
];

const AUDIO_BASE_URLS = {
  'husary': 'https://server6.mp3quran.net/qtm/',
  'afasy': 'https://server8.mp3quran.net/afs/',
  'minshawi': 'https://server10.mp3quran.net/minsh/',
  'ghamdi': 'https://server7.mp3quran.net/s_gmd/',
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
  
  const audioRef = useRef(null);
  const { playTrack } = usePlayer();

  const { data: reciters = [], isLoading } = useQuery({
    queryKey: ['reciters-tilawa'],
    queryFn: () => base44.entities.Reciter.list('-popularity_score'),
  });

  useEffect(() => {
    if (reciters.length > 0 && !selectedReciter) {
      setSelectedReciter(reciters[0]);
    }
  }, [reciters]);

  useEffect(() => {
    const unsubscribe = AudioManager.addListener((source, status) => {
      if (source !== 'tilawa' && status === 'playing') {
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

  const getAudioUrl = (reciterId, surahNumber) => {
    const reciterKey = reciterId?.toLowerCase().includes('عفاسي') ? 'afasy' : 
                       reciterId?.toLowerCase().includes('حصري') ? 'husary' :
                       reciterId?.toLowerCase().includes('منشاوي') ? 'minshawi' :
                       reciterId?.toLowerCase().includes('غامدي') ? 'ghamdi' : 'afasy';
    
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
      audioRef.current.play().catch(() => toast.error('تعذر تشغيل التلاوة'));
      setIsPlaying(true);
    }
    
    const surahName = SURAHS.find(s => s.number === surahNumber)?.name || `سورة ${surahNumber}`;
    toast.success(`جاري تشغيل ${surahName} - ${selectedReciter.name_arabic}`);
    
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

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const filteredReciters = reciters.filter(r => 
    r.name_arabic?.includes(searchQuery) || r.name_english?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSurahName = SURAHS.find(s => s.number === selectedSurah)?.name || '';

  return (
    <div className="min-h-screen relative pb-24" dir="rtl">
      {/* خلفية */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/90 via-indigo-950/95 to-slate-950/98" />
      </div>
      
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">التلاوات المباركة</h1>
          <p className="text-purple-200 text-lg">استمع لأجمل التلاوات بأصوات مشاهير القراء</p>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          </div>
        )}

        {!isLoading && (
        <>
          {selectedReciter && selectedSurah && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="mb-8 bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-purple-900/80 backdrop-blur-xl text-white border-purple-500/30 shadow-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl">
                      {selectedReciter.image_url ? (
                        <img src={selectedReciter.image_url} alt={selectedReciter.name_arabic} className="w-full h-full object-cover" />
                      ) : (
                        <Mic className="w-16 h-16 text-white m-auto mt-8" />
                      )}
                    </div>
                    
                    <div className="flex-1 text-center md:text-right">
                      <h2 className="text-3xl font-bold mb-2 text-amber-200">{currentSurahName}</h2>
                      <p className="text-purple-200 text-xl mb-3">{selectedReciter.name_arabic}</p>
                      <div className="flex gap-2 justify-center md:justify-start">
                        {selectedReciter.recitation_style && (
                          <Badge className="bg-purple-600/80 text-white">{selectedReciter.recitation_style}</Badge>
                        )}
                        <Badge className="bg-pink-600/80 text-white">{selectedReciter.country}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={1}
                      onValueChange={(value) => {
                        if (audioRef.current) audioRef.current.currentTime = value[0];
                      }}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-purple-200 mt-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 w-12 h-12">
                      <SkipForward className="w-6 h-6" />
                    </Button>
                    
                    <Button 
                      size="lg"
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-purple-100 text-purple-700 hover:scale-110 transition-transform shadow-2xl"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 mr-[-4px]" />}
                    </Button>
                    
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 w-12 h-12">
                      <SkipBack className="w-6 h-6" />
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-2xl font-bold text-purple-200 mb-4">اختر المقرئ</h2>
            <div className="relative mb-6 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <Input
                placeholder="ابحث عن مقرئ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-slate-900/60 border-purple-500/30 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {filteredReciters.map((reciter, index) => (
                <motion.button
                  key={reciter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedReciter(reciter)}
                  className={`flex-shrink-0 flex flex-col items-center gap-3 p-5 rounded-2xl transition-all hover:-translate-y-1 ${
                    selectedReciter?.id === reciter.id 
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 ring-4 ring-amber-400 shadow-2xl' 
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border border-purple-500/30'
                  }`}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl">
                    {reciter.image_url ? (
                      <img src={reciter.image_url} alt={reciter.name_arabic} className="w-full h-full object-cover" />
                    ) : (
                      <Mic className="w-12 h-12 text-white m-auto mt-6" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-white text-center max-w-[110px]">{reciter.name_arabic}</span>
                  {reciter.is_featured && (
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
            <h2 className="text-2xl font-bold text-purple-200 mb-4">اختر السورة</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {SURAHS.map((surah, index) => (
                <motion.div
                  key={surah.number}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card
                    onClick={() => playSurah(surah.number)}
                    className={`cursor-pointer transition-all hover:scale-105 hover:shadow-2xl group ${
                      selectedSurah === surah.number 
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white ring-4 ring-amber-400 shadow-2xl' 
                        : 'bg-slate-900/60 hover:bg-slate-800/80 text-white border-purple-500/30'
                    }`}
                  >
                    <CardContent className="p-5 flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-lg ${
                        selectedSurah === surah.number ? 'bg-white/30' : 'bg-purple-600/40'
                      }`}>
                        {surah.number}
                      </div>
                      <span className="font-bold text-lg">{surah.name}</span>
                      {selectedSurah === surah.number && isPlaying && (
                        <div className="mr-auto flex gap-1">
                          <div className="w-1 h-4 bg-white animate-pulse rounded" />
                          <div className="w-1 h-5 bg-white animate-pulse rounded" style={{ animationDelay: '0.1s' }} />
                          <div className="w-1 h-3 bg-white animate-pulse rounded" style={{ animationDelay: '0.2s' }} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-12 mb-12">
            <Link to={createPageUrl('Reciters')}>
              <Button variant="outline" size="lg" className="border-purple-500/50 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400">
                <Mic className="w-5 h-5 ml-2" />
                عرض جميع المقرئين
              </Button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-2xl font-bold text-purple-200 mb-6">📺 القنوات الإسلامية</h2>
            <FeaturedChannels variant="horizontal" limit={6} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <VideoGrid pageName="Tilawa" limit={6} />
          </motion.div>
        </>
        )}
      </div>
    </div>
  );
}