import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Repeat, Shuffle, Heart, Download, X, ChevronUp, ChevronDown,
  Music, Radio, BookOpen, Mic, MoreHorizontal, Loader2, Check
} from 'lucide-react';
import { toast } from 'sonner';

// سياق المشغل العالمي
const PlayerContext = createContext(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};

// أنواع المحتوى
const CONTENT_TYPES = {
  quran: { icon: BookOpen, label: 'قرآن', color: 'from-emerald-600 to-green-600' },
  radio: { icon: Radio, label: 'راديو', color: 'from-purple-600 to-indigo-600' },
  ibtihaal: { icon: Mic, label: 'ابتهال', color: 'from-amber-600 to-orange-600' },
  tawsheeh: { icon: Music, label: 'تواشيح', color: 'from-rose-600 to-pink-600' },
};

// دوال التخزين المحلي
const openOfflineDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AudioOfflineDB', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('tracks')) {
        db.createObjectStore('tracks', { keyPath: 'id' });
      }
    };
  });
};

const saveTrackOffline = async (trackId, audioBlob) => {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('tracks', 'readwrite');
      const store = tx.objectStore('tracks');
      store.put({ id: trackId, audio: audioBlob, savedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error('Save offline error:', e);
    return false;
  }
};

const getTrackOffline = async (trackId) => {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('tracks', 'readonly');
      const store = tx.objectStore('tracks');
      const request = store.get(trackId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
};

const _isTrackDownloaded = async (trackId) => {
  const track = await getTrackOffline(trackId);
  return !!track;
};

// تنسيق الوقت
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// مزود المشغل
export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedTracks, setDownloadedTracks] = useState(new Set());

  // إعداد أحداث الصوت
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [isRepeat]);

  // تحديث الصوت
  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // تشغيل مسار
  const play = async (track, newPlaylist = null) => {
    if (newPlaylist) {
      setPlaylist(newPlaylist);
    }

    // إذا نفس المسار - تبديل التشغيل/الإيقاف
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      return;
    }

    setCurrentTrack(track);

    // محاولة التشغيل من الملفات المحملة
    const offlineTrack = await getTrackOffline(track.id);
    if (offlineTrack?.audio) {
      audioRef.current.src = URL.createObjectURL(offlineTrack.audio);
    } else {
      audioRef.current.src = track.url || track.audioUrl;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      toast.error('تعذر تشغيل الصوت');
    }
  };

  // إيقاف مؤقت
  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // إيقاف
  const stop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  // التالي
  const playNext = () => {
    if (!playlist.length || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    let nextIndex;
    
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
    }
    
    play(playlist[nextIndex]);
  };

  // السابق
  const playPrev = () => {
    if (!playlist.length || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    play(playlist[prevIndex]);
  };

  // تغيير موضع التشغيل
  const seek = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  // تحميل للاستماع بدون نت
  const downloadTrack = async (track = currentTrack) => {
    if (!track || isDownloading) return;
    
    if (downloadedTracks.has(track.id)) {
      toast.info('المقطع محمل مسبقاً ✓');
      return;
    }

    setIsDownloading(true);
    toast.info('جاري التحميل للاستماع دون نت...');

    try {
      const response = await fetch(track.url);
      const blob = await response.blob();
      await saveTrackOffline(track.id, blob);
      
      setDownloadedTracks(prev => new Set([...prev, track.id]));
      toast.success('تم التحميل! يمكنك الاستماع دون نت 📥');
    } catch {
      toast.error('فشل التحميل');
    } finally {
      setIsDownloading(false);
    }
  };

  // دالة تشغيل مسار جديد (للاستخدام من الصفحات الأخرى)
  const playTrack = (trackData) => {
    const track = {
      id: trackData.id,
      title: trackData.title,
      artist: trackData.artist || trackData.reciter,
      url: trackData.audioUrl || trackData.url || trackData.audio_url,
      type: trackData.type || 'quran',
      imageUrl: trackData.imageUrl || trackData.image_url,
    };
    play(track);
  };

  const value = {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    playlist,
    isDownloading,
    downloadedTracks,
    play,
    pause,
    stop,
    playNext,
    playPrev,
    seek,
    setVolume,
    setIsMuted,
    setIsRepeat,
    setIsShuffle,
    downloadTrack,
    playTrack,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

// المشغل الكلاسيكي
export default function ClassicAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    isDownloading,
    downloadedTracks,
    play,
    pause,
    playNext,
    playPrev,
    seek,
    setVolume,
    setIsMuted,
    setIsRepeat,
    setIsShuffle,
    downloadTrack,
  } = usePlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!currentTrack) return null;

  const contentType = CONTENT_TYPES[currentTrack.type] || CONTENT_TYPES.quran;
  const ContentIcon = contentType.icon;
  const isDownloaded = downloadedTracks.has(currentTrack.id);

  // المشغل المصغر
  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 shadow-2xl animate-pulse"
      >
        <ChevronUp className="w-6 h-6" />
      </Button>
    );
  }

  // المشغل الموسع (كامل الشاشة)
  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col" dir="rtl">
        {/* رأس المشغل */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)} className="text-white">
            <ChevronDown className="w-6 h-6" />
          </Button>
          <span className="text-white/60 text-sm">{contentType.label}</span>
          <Button variant="ghost" size="icon" className="text-white">
            <MoreHorizontal className="w-6 h-6" />
          </Button>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* صورة الألبوم */}
          <div className={`w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br ${contentType.color} flex items-center justify-center shadow-2xl mb-8`}>
            <ContentIcon className="w-32 h-32 text-white/80" />
          </div>

          {/* معلومات المسار */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentTrack.title}</h2>
            <p className="text-white/60 text-lg">{currentTrack.artist || currentTrack.reciter}</p>
          </div>

          {/* شريط التقدم */}
          <div className="w-full max-w-md mb-6">
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={([val]) => seek(val)}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-sm text-white/50 mt-2">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* أزرار التحكم الرئيسية */}
          <div className="flex items-center gap-6 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsShuffle(!isShuffle)}
              className={isShuffle ? 'text-emerald-400' : 'text-white/50'}
            >
              <Shuffle className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="icon" onClick={playPrev} className="text-white">
              <SkipForward className="w-8 h-8" />
            </Button>

            <Button
              size="lg"
              onClick={() => isPlaying ? pause() : play(currentTrack)}
              className="w-20 h-20 rounded-full bg-white text-slate-900 hover:bg-white/90 shadow-xl"
            >
              {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 mr-[-4px]" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={playNext} className="text-white">
              <SkipBack className="w-8 h-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRepeat(!isRepeat)}
              className={isRepeat ? 'text-emerald-400' : 'text-white/50'}
            >
              <Repeat className="w-5 h-5" />
            </Button>
          </div>

          {/* أزرار إضافية */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? 'text-red-500' : 'text-white/50'}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => downloadTrack()}
              disabled={isDownloading}
              className={isDownloaded ? 'text-emerald-400' : 'text-white/50'}
            >
              {isDownloading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isDownloaded ? (
                <Check className="w-6 h-6" />
              ) : (
                <Download className="w-6 h-6" />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white/50"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={([val]) => setVolume(val)}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // المشغل العادي (أسفل الشاشة)
  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-xl border-t border-slate-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* معلومات المسار */}
          <div 
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
            onClick={() => setIsExpanded(true)}
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${contentType.color} flex items-center justify-center flex-shrink-0`}>
              <ContentIcon className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold truncate">{currentTrack.title}</p>
              <p className="text-slate-400 text-sm truncate">{currentTrack.artist || currentTrack.reciter}</p>
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={playPrev} className="text-slate-400 hover:text-white hidden md:flex">
              <SkipForward className="w-5 h-5" />
            </Button>

            <Button
              size="icon"
              onClick={() => isPlaying ? pause() : play(currentTrack)}
              className="w-12 h-12 rounded-full bg-white text-slate-900 hover:bg-white/90"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 mr-[-2px]" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={playNext} className="text-slate-400 hover:text-white hidden md:flex">
              <SkipBack className="w-5 h-5" />
            </Button>
          </div>

          {/* شريط التقدم - سطح المكتب */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
            <span className="text-slate-400 text-xs">{formatTime(progress)}</span>
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={([val]) => seek(val)}
              className="flex-1"
            />
            <span className="text-slate-400 text-xs">{formatTime(duration)}</span>
          </div>

          {/* أزرار إضافية */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => downloadTrack()}
              disabled={isDownloading}
              className={isDownloaded ? 'text-emerald-400' : 'text-slate-400'}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isDownloaded ? (
                <Check className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>

            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={([val]) => setVolume(val)}
              className="w-20"
            />

            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(true)} className="text-slate-400">
              <ChevronUp className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)} className="text-slate-400">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* زر التوسيع - موبايل */}
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(true)} className="md:hidden text-slate-400">
            <ChevronUp className="w-5 h-5" />
          </Button>
        </div>

        {/* شريط التقدم - موبايل */}
        <div className="md:hidden mt-2">
          <Slider
            value={[progress]}
            max={duration || 100}
            step={1}
            onValueChange={([val]) => seek(val)}
          />
        </div>
      </div>
    </Card>
  );
}