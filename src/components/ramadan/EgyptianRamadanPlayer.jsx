import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

export default function EgyptianRamadanPlayer({ playlist }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
     if (audioRef.current && currentTrack?.url) {
       if (typeof currentTrack.url !== 'string' || !currentTrack.url.trim()) {
         console.error('Invalid audio URL:', currentTrack.url);
         return;
       }
       audioRef.current.src = currentTrack.url;
       if (isPlaying) {
         audioRef.current.play().catch(e => {
           console.error('Play error:', e?.message);
           setIsPlaying(false);
         });
       }
     }
   }, [currentTrackIndex, currentTrack?.url]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack?.url) {
      console.warn('Cannot play: missing audio reference or URL');
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.error('Play error:', e?.message);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
     if (!playlist || playlist.length === 0) return;
     setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
   };

  const handlePrevious = () => {
     if (!playlist || playlist.length === 0) return;
     setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
   };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl">
      <CardContent className="p-6">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleNext}
          onLoadedMetadata={handleTimeUpdate}
        />
        
        {/* معلومات المقطع */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold mb-1">{currentTrack?.title}</h3>
          <p className="text-amber-100 text-sm">{currentTrack?.artist}</p>
        </div>

        {/* شريط التقدم */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-amber-100">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={handlePrevious}
            className="text-white hover:bg-white/20"
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button
            size="icon"
            onClick={togglePlay}
            className="w-14 h-14 bg-white text-orange-600 hover:bg-amber-100 rounded-full shadow-lg"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 mr-0.5" />}
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={handleNext}
            className="text-white hover:bg-white/20"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* التحكم في الصوت */}
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            className="text-white hover:bg-white/20"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(val) => setVolume(val[0])}
            className="flex-1"
          />
          <span className="text-sm text-amber-100 w-10">{volume}%</span>
        </div>
      </CardContent>
    </Card>
  );
}