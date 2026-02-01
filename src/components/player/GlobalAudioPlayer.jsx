import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart, Download, X, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

const SURAH_NAMES = {
  1: 'الفاتحة', 2: 'البقرة', 3: 'آل عمران', 18: 'الكهف', 36: 'يس', 67: 'الملك'
};

const RECITERS = {
  husary: { name: 'الحصري', baseUrl: 'https://server8.mp3quran.net/afs/' },
  minshawi: { name: 'المنشاوي', baseUrl: 'https://server10.mp3quran.net/minsh/' },
  abdulbasit: { name: 'عبد الباسط', baseUrl: 'https://server7.mp3quran.net/basit/' },
};

export default function GlobalAudioPlayer({ 
  currentSurah = 1, 
  currentVerse = 1, 
  isPlaying: externalIsPlaying, 
  onPlayPause: externalOnPlayPause,
  onNext: externalOnNext,
  onPrevious: externalOnPrevious,
  onVolumeChange: externalOnVolumeChange,
  onProgressChange: externalOnProgressChange,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [surah, setSurah] = useState(currentSurah);
  const [reciter, setReciter] = useState('husary');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const getAudioUrl = (surahNum) => {
    const paddedNum = surahNum.toString().padStart(3, '0');
    return `${RECITERS[reciter].baseUrl}${paddedNum}.mp3`;
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume / 100;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeating]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio.src) {
      audio.src = getAudioUrl(surah);
    }
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => toast.error('تعذر تشغيل الصوت'));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextSurah = surah < 114 ? surah + 1 : 1;
    setSurah(nextSurah);
    loadAndPlay(nextSurah);
  };

  const handlePrevious = () => {
    const prevSurah = surah > 1 ? surah - 1 : 114;
    setSurah(prevSurah);
    loadAndPlay(prevSurah);
  };

  const loadAndPlay = (surahNum) => {
    const audio = audioRef.current;
    audio.src = getAudioUrl(surahNum);
    audio.play().catch(() => {});
    setIsPlaying(true);
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
    if (value > 0) setIsMuted(false);
  };

  const handleProgressChange = (value) => {
    setProgress(value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };

  const handleDownload = () => {
    const url = getAudioUrl(surah);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surah_${surah}.mp3`;
    a.click();
    toast.success('جاري التحميل...');
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 shadow-2xl"
      >
        <ChevronUp className="w-6 h-6" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl">
        <div className="p-3 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">{surah}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold truncate">{SURAH_NAMES[surah] || `سورة ${surah}`}</p>
            <p className="text-slate-400 text-xs">{RECITERS[reciter].name}</p>
          </div>
          <Button size="icon" onClick={handlePlayPause} className="bg-emerald-600 hover:bg-emerald-700 rounded-full w-10 h-10">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setIsMinimized(false)} className="text-slate-400">
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {/* Current Playing Info */}
          <div className="flex items-center gap-4 w-full md:w-auto md:min-w-[240px]">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">{surah}</span>
            </div>
            <div className="flex-1">
              <Link to={createPageUrl(`SurahView?surah=${surah}`)}>
                <p className="text-white font-bold hover:underline cursor-pointer">
                  {SURAH_NAMES[surah] || `سورة ${surah}`}
                </p>
              </Link>
              <p className="text-slate-400 text-sm">{RECITERS[reciter].name}</p>
            </div>
            <div className="flex md:hidden gap-2">
              <Button size="icon" variant="ghost" onClick={() => setIsMinimized(true)} className="text-slate-400">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`hidden md:flex ${isFavorite ? 'text-emerald-500' : 'text-slate-400'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Player Controls */}
          <div className="flex-1 flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShuffled(!isShuffled)}
                className={`hidden md:flex ${isShuffled ? 'text-emerald-500' : 'text-slate-400'}`}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="text-slate-400 hover:text-white"
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                size="icon"
                onClick={handlePlayPause}
                className="bg-white hover:bg-slate-100 text-slate-900 w-10 h-10 rounded-full"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="text-slate-400 hover:text-white"
              >
                <SkipForward className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRepeating(!isRepeating)}
                className={isRepeating ? 'text-emerald-500' : 'text-slate-400'}
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center gap-3">
              <span className="text-slate-400 text-xs min-w-[40px] text-left">
                {formatTime(progress)}
              </span>
              <Slider
                value={[progress]}
                onValueChange={([value]) => handleProgressChange(value)}
                max={duration || 300}
                step={1}
                className="flex-1"
              />
              <span className="text-slate-400 text-xs min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume & Download */}
          <div className="hidden md:flex items-center gap-3 min-w-[200px]">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="text-slate-400 hover:text-white"
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsMuted(!isMuted);
                if (audioRef.current) {
                  audioRef.current.muted = !isMuted;
                }
              }}
              className="text-slate-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={([value]) => handleVolumeChange(value)}
              max={100}
              step={1}
              className="w-24"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}