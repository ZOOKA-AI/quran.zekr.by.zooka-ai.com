import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function GlobalAudioPlayer({ 
  currentSurah, 
  currentVerse, 
  isPlaying, 
  onPlayPause,
  onNext,
  onPrevious,
  progress = 0,
  onProgressChange,
  volume = 80,
  onVolumeChange,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-6">
          {/* Current Playing Info */}
          <div className="flex items-center gap-4 min-w-[240px]">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">{currentSurah || 1}</span>
            </div>
            <div>
              <Link to={createPageUrl(`SurahView?surah=${currentSurah}`)}>
                <p className="text-white font-bold hover:underline cursor-pointer">
                  سورة رقم {currentSurah || 1}
                </p>
              </Link>
              <p className="text-slate-400 text-sm">آية {currentVerse || 1}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? 'text-emerald-500' : 'text-slate-400'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Player Controls */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShuffled(!isShuffled)}
                className={isShuffled ? 'text-emerald-500' : 'text-slate-400'}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="text-slate-400 hover:text-white"
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                size="icon"
                onClick={onPlayPause}
                className="bg-white hover:bg-slate-100 text-slate-900 w-10 h-10 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
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
                onValueChange={([value]) => onProgressChange(value)}
                max={300}
                step={1}
                className="flex-1"
              />
              <span className="text-slate-400 text-xs min-w-[40px]">
                {formatTime(300)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 min-w-[180px]">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={([value]) => {
                onVolumeChange(value);
                if (value > 0) setIsMuted(false);
              }}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}