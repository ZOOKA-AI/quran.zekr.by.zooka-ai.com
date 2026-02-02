import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, SkipBack, Volume2, Download, Repeat, Repeat1, Gauge } from 'lucide-react';

const RECITERS = [
  { id: 'afasy', name: 'مشاري راشد العفاسي', url: 'https://server8.mp3quran.net/afs/' },
  { id: 'husary', name: 'محمود خليل الحصري', url: 'https://server8.mp3quran.net/husary/' },
  { id: 'minshawi', name: 'محمد صديق المنشاوي', url: 'https://server10.mp3quran.net/minsh/' },
  { id: 'abdulbasit', name: 'عبد الباسط عبد الصمد', url: 'https://server7.mp3quran.net/basit/' },
  { id: 'sudais', name: 'عبد الرحمن السديس', url: 'https://server11.mp3quran.net/sds/' },
  { id: 'ghamadi', name: 'سعد الغامدي', url: 'https://server7.mp3quran.net/s_gmd/' },
  { id: 'shuraim', name: 'سعود الشريم', url: 'https://server6.mp3quran.net/shur/' },
  { id: 'alajmi', name: 'أحمد العجمي', url: 'https://server10.mp3quran.net/ajm/' },
  { id: 'jibreen', name: 'عبد الله الجبرين', url: 'https://server16.mp3quran.net/jbreen/' },
  { id: 'budair', name: 'عبد الله بصفر', url: 'https://server11.mp3quran.net/bsfr/' }
];

const AudioPlayer = ({ surahNumber, onTimeUpdate, onPlayingChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0].id);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [repeatMode, setRepeatMode] = useState('none'); // none, one, all
  const audioRef = useRef(null);

  const reciter = RECITERS.find(r => r.id === selectedReciter);
  const audioUrl = `${reciter.url}${String(surahNumber).padStart(3, '0')}.mp3`;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    const newState = !isPlaying;
    setIsPlaying(newState);
    if (onPlayingChange) onPlayingChange(newState);
  };

  const handleTimeUpdate = () => {
    const time = audioRef.current?.currentTime || 0;
    setCurrentTime(time);
    if (onTimeUpdate) onTimeUpdate(time);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      setIsPlaying(false);
    }
  };

  const toggleRepeatMode = () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return <Repeat1 className="w-5 h-5" />;
    return <Repeat className="w-5 h-5" />;
  };

  const getRepeatColor = () => {
    if (repeatMode === 'none') return 'text-gray-400';
    return 'text-emerald-600';
  };

  const handleSeek = (value) => {
    const time = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 shadow-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            🎵 المشغل الصوتي
          </h3>
          <Select value={selectedReciter} onValueChange={setSelectedReciter}>
            <SelectTrigger className="w-56">
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

        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />

        {/* Progress Bar */}
        <div className="mb-6">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
              }
            }}
            aria-label="الرجوع 10 ثوان"
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            className="rounded-full w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
            onClick={togglePlayPause}
            aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 mr-1" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
              }
            }}
            aria-label="التقديم 10 ثوان"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-center gap-3 mb-4 pb-4 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleRepeatMode}
            className={getRepeatColor()}
            aria-label={`وضع التكرار: ${repeatMode === 'none' ? 'بدون تكرار' : repeatMode === 'one' ? 'تكرار السورة' : 'تكرار مستمر'}`}
          >
            {getRepeatIcon()}
            <span className="mr-2">
              {repeatMode === 'none' && 'بدون تكرار'}
              {repeatMode === 'one' && 'تكرار السورة'}
              {repeatMode === 'all' && 'تكرار مستمر'}
            </span>
          </Button>

          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-gray-600" />
            <Select value={playbackRate.toString()} onValueChange={(v) => setPlaybackRate(parseFloat(v))}>
              <SelectTrigger className="w-32 h-9" aria-label="سرعة التشغيل">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">× 0.5 (أبطأ جداً)</SelectItem>
                <SelectItem value="0.75">× 0.75 (أبطأ)</SelectItem>
                <SelectItem value="1">× 1 (عادي)</SelectItem>
                <SelectItem value="1.25">× 1.25 (أسرع)</SelectItem>
                <SelectItem value="1.5">× 1.5 (أسرع جداً)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-4">
          <Volume2 className="w-5 h-5 text-gray-600" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(v) => setVolume(v[0])}
            className="flex-1"
            aria-label="مستوى الصوت"
          />
          <span className="text-sm text-gray-600 w-12">{volume}%</span>
          <Button variant="outline" size="icon" asChild>
            <a href={audioUrl} download aria-label="تحميل الملف الصوتي">
              <Download className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AudioPlayer;