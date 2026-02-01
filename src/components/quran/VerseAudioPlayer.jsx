import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, RotateCw, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const RECITERS = [
  { 
    id: 'mishari_rashid', 
    name: 'مشاري راشد العفاسي', 
    baseUrl: 'https://server8.mp3quran.net/afs/',
    format: (s, v) => `${String(s).padStart(3, '0')}${String(v).padStart(3, '0')}.mp3`
  },
  { 
    id: 'abdulbasit', 
    name: 'عبد الباسط عبد الصمد', 
    baseUrl: 'https://server7.mp3quran.net/basit/',
    format: (s, v) => `${String(s).padStart(3, '0')}${String(v).padStart(3, '0')}.mp3`
  },
  { 
    id: 'sudais', 
    name: 'عبد الرحمن السديس', 
    baseUrl: 'https://server11.mp3quran.net/sds/',
    format: (s, v) => `${String(s).padStart(3, '0')}${String(v).padStart(3, '0')}.mp3`
  },
  { 
    id: 'husary', 
    name: 'محمود خليل الحصري', 
    baseUrl: 'https://server8.mp3quran.net/h_afs/',
    format: (s, v) => `${String(s).padStart(3, '0')}${String(v).padStart(3, '0')}.mp3`
  },
  { 
    id: 'minshawi', 
    name: 'محمد صديق المنشاوي', 
    baseUrl: 'https://server10.mp3quran.net/minsh/',
    format: (s, v) => `${String(s).padStart(3, '0')}${String(v).padStart(3, '0')}.mp3`
  },
  { 
    id: 'ghamdi', 
    name: 'سعد الغامدي', 
    baseUrl: 'https://server7.mp3quran.net/s_gmd/',
    format: (s, v) => `${String(s).padStart(3, '0')}${String(v).padStart(3, '0')}.mp3`
  },
  { 
    id: 'shuraim', 
    name: 'سعود الشريم', 
    baseUrl: 'https://server6.mp3quran.net/shur/',
    format: (s, v) => `${String(s).padStart(3, '0')}${String(v).padStart(3, '0')}.mp3`
  },
  { 
    id: 'ajmy', 
    name: 'أحمد العجمي', 
    baseUrl: 'https://server10.mp3quran.net/ajm/',
    format: (s, v) => `${String(s).padStart(3, '0')}${String(v).padStart(3, '0')}.mp3`
  },
];

export default function VerseAudioPlayer({ 
  surahNumber, 
  verseNumber, 
  onPrevious, 
  onNext,
  showNavigation = true,
  compact = false
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isRepeating, setIsRepeating] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState('mishari_rashid');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const currentReciter = RECITERS.find(r => r.id === selectedReciter) || RECITERS[0];

  const buildAudioUrl = () => {
    const url = currentReciter.baseUrl + currentReciter.format(surahNumber, verseNumber);
    return url;
  };

  const loadAndPlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audioUrl = buildAudioUrl();
    audioRef.current = new Audio(audioUrl);
    audioRef.current.volume = volume / 100;

    setIsLoading(true);

    audioRef.current.oncanplaythrough = () => {
      setIsLoading(false);
    };

    audioRef.current.onended = () => {
      if (isRepeating) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        setIsPlaying(false);
      }
    };

    audioRef.current.onerror = () => {
      toast.error('حدث خطأ في تحميل التلاوة');
      setIsPlaying(false);
      setIsLoading(false);
    };

    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error('فشل تشغيل التلاوة');
        setIsPlaying(false);
        setIsLoading(false);
      });
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      loadAndPlayAudio();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = ([newVolume]) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleReciterChange = (reciterId) => {
    const wasPlaying = isPlaying;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSelectedReciter(reciterId);
    setIsPlaying(false);
    
    if (wasPlaying) {
      setTimeout(() => {
        loadAndPlayAudio();
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      loadAndPlayAudio();
    }
  }, [surahNumber, verseNumber]);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant={isPlaying ? "default" : "outline"}
          size="sm"
          onClick={togglePlay}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent" />
          ) : isPlaying ? (
            <><Pause className="w-4 h-4" /> إيقاف</>
          ) : (
            <><Play className="w-4 h-4" /> استماع</>
          )}
        </Button>
        <Button
          variant={isRepeating ? "default" : "outline"}
          size="icon"
          onClick={() => setIsRepeating(!isRepeating)}
          className={isRepeating ? "bg-amber-500 hover:bg-amber-600" : ""}
        >
          <RotateCw className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200">
      <div className="p-4 space-y-4">
        {/* Reciter Selection */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <Select value={selectedReciter} onValueChange={handleReciterChange}>
            <SelectTrigger className="flex-1 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECITERS.map(reciter => (
                <SelectItem key={reciter.id} value={reciter.id}>
                  {reciter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          {showNavigation && onPrevious && (
            <Button
              variant="outline"
              size="icon"
              onClick={onPrevious}
              className="bg-white"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
          )}

          <Button
            size="lg"
            onClick={togglePlay}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-20"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>

          {showNavigation && onNext && (
            <Button
              variant="outline"
              size="icon"
              onClick={onNext}
              className="bg-white"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          )}

          <Button
            variant={isRepeating ? "default" : "outline"}
            size="icon"
            onClick={() => setIsRepeating(!isRepeating)}
            className={isRepeating ? "bg-amber-500 hover:bg-amber-600" : "bg-white"}
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="flex-shrink-0"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-700" />
            )}
          </Button>
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-10 text-left">{volume}%</span>
        </div>

        {/* Status */}
        <div className="text-center text-sm text-gray-600">
          <p>الآية {verseNumber} من سورة رقم {surahNumber}</p>
          {isRepeating && (
            <p className="text-amber-600 font-bold mt-1">🔁 وضع التكرار مفعّل</p>
          )}
        </div>
      </div>
    </Card>
  );
}