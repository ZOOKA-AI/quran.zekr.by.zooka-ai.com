import { useRef, useCallback, useState } from 'react';
import { audioUtils } from '@/components/utils/audioUtils';
import { performanceUtils } from '@/components/utils/performanceUtils';

export function useAudioOptimization() {
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);

  const preloadAudio = useCallback(async (url) => {
    setIsLoading(true);
    try {
      const { result } = await performanceUtils.measureAsync(
        () => audioUtils.preloadAudio(url),
        'Audio preload'
      );
      audioRef.current = result;
      setDuration(result.duration);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAudioUrl = useCallback((reciterId, surahNumber) => {
    return audioUtils.getAudioUrl(reciterId, surahNumber);
  }, []);

  const getAudioDuration = useCallback(async (url) => {
    const dur = await audioUtils.getAudioDuration(url);
    setDuration(dur);
    return dur;
  }, []);

  return {
    audioRef,
    isLoading,
    duration,
    preloadAudio,
    getAudioUrl,
    getAudioDuration
  };
}