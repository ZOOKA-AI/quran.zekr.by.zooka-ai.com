import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, SkipBack, Volume2, VolumeX, 
  RotateCcw, RotateCw, Repeat, Loader2
} from 'lucide-react';

// تنسيق الوقت
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function AudioControls({ 
  audioRef, 
  isPlaying, 
  isLoading,
  onPlayPause, 
  onStop,
  currentTrack 
}) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
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
  }, [audioRef, isRepeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, audioRef]);

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  return (
    <Card className="bg-slate-900/80 backdrop-blur-xl border-amber-900/30">
      <div className="p-6">
        {/* معلومات المسار */}
        {currentTrack && (
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-amber-100">{currentTrack.title}</h3>
            <p className="text-slate-400">{currentTrack.reciter}</p>
          </div>
        )}

        {/* شريط التقدم */}
        <div className="mb-6">
          <Slider
            value={[progress]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-sm text-slate-400 mt-2">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* أزرار التحكم الرئيسية */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRepeat(!isRepeat)}
            className={isRepeat ? 'text-amber-400' : 'text-slate-400'}
          >
            <Repeat className="w-5 h-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={skipBackward}
            className="text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>

          <Button
            size="lg"
            onClick={onPlayPause}
            disabled={isLoading}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-xl"
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 mr-[-4px]" />
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={skipForward}
            className="text-slate-300 hover:text-white"
          >
            <RotateCw className="w-6 h-6" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onStop}
            className="text-slate-400 hover:text-red-400"
          >
            <SkipBack className="w-5 h-5" />
          </Button>
        </div>

        {/* التحكم بالصوت */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="text-slate-400"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={([val]) => setVolume(val)}
            className="w-32"
          />
          <span className="text-sm text-slate-400 w-8">{volume}%</span>
        </div>
      </div>
    </Card>
  );
}