import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SAMPLE_SURAHS = [
  { id: 1, name: 'الفاتحة', reciter: 'عبد الباسط عبد الصمد', url: 'https://server11.mp3quran.net/sds/Rewayat-Hafs-A-n-Assem/001.mp3' },
  { id: 2, name: 'البقرة', reciter: 'عبد الباسط عبد الصمد', url: 'https://server11.mp3quran.net/sds/Rewayat-Hafs-A-n-Assem/002.mp3' },
  { id: 3, name: 'آل عمران', reciter: 'عبد الباسط عبد الصمد', url: 'https://server11.mp3quran.net/sds/Rewayat-Hafs-A-n-Assem/003.mp3' }
];

export default function FloatingAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = SAMPLE_SURAHS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % SAMPLE_SURAHS.length);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + SAMPLE_SURAHS.length) % SAMPLE_SURAHS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Audio Visualizer Effect
  const visualizerBars = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="w-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-full"
      animate={{
        height: isPlaying ? ['20%', '80%', '40%', '90%', '30%'] : '20%',
      }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        delay: i * 0.05,
      }}
    />
  ));

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 right-4 left-4 z-50 md:bottom-6 md:right-6 md:left-auto md:w-96"
    >
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl overflow-hidden border-2 border-emerald-400">
        {/* Expand/Collapse Button */}
        <div className="flex items-center justify-between p-3 border-b border-white/20">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">{currentTrack.name}</p>
              <p className="text-xs text-emerald-100 truncate">{currentTrack.reciter}</p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/20 shrink-0"
          >
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </Button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 space-y-4"
            >
              {/* Audio Visualizer */}
              <div className="h-16 flex items-end justify-center gap-1 bg-white/10 rounded-lg p-2">
                {visualizerBars}
              </div>

              {/* Progress Bar */}
              <div>
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={(value) => {
                    if (audioRef.current) audioRef.current.currentTime = value[0];
                  }}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/80 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
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
                  className="w-14 h-14 bg-white text-emerald-600 hover:bg-white/90 rounded-full shadow-lg"
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

              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsMuted(!isMuted)}
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
                <span className="text-sm text-white w-12 text-center">{volume}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Controls (when collapsed) */}
        {!isExpanded && (
          <div className="p-3 flex items-center justify-between">
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
              className="w-12 h-12 bg-white text-emerald-600 hover:bg-white/90 rounded-full"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 mr-0.5" />}
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
        )}
      </div>
    </motion.div>
  );
}