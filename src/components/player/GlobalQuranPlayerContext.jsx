import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const GlobalQuranPlayerContext = createContext(null);

export function useGlobalQuranPlayer() {
  const context = useContext(GlobalQuranPlayerContext);
  if (!context) {
    throw new Error('useGlobalQuranPlayer must be used within GlobalQuranPlayerProvider');
  }
  return context;
}

export function GlobalQuranPlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [reciter, setReciter] = useState('ar.alafasy');
  const [surahNumber, setSurahNumber] = useState(1);
  const [verseStart, setVerseStart] = useState(1);
  const [verseEnd, setVerseEnd] = useState(7);
  const [isMinimized, setIsMinimized] = useState(true);

  // حفظ موضع التشغيل
  const savePlaybackPosition = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) return;

      const user = await base44.auth.me();
      const existing = await base44.entities.PlaybackPosition.filter({
        created_by: user.email
      });

      const data = {
        reciter_name: reciter,
        surah_number: surahNumber,
        verse_start: verseStart,
        verse_end: verseEnd,
        current_time: currentTime,
        duration: duration,
        last_played: new Date().toISOString()
      };

      if (existing.length > 0) {
        await base44.entities.PlaybackPosition.update(existing[0].id, data);
      } else {
        await base44.entities.PlaybackPosition.create(data);
      }
    } catch (err) {
      console.error('Failed to save playback position:', err);
    }
  };

  // استرجاع موضع التشغيل
  const loadPlaybackPosition = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) return;

      const user = await base44.auth.me();
      const positions = await base44.entities.PlaybackPosition.filter({
        created_by: user.email
      }, '-last_played', 1);

      if (positions.length > 0) {
        const pos = positions[0];
        setReciter(pos.reciter_name);
        setSurahNumber(pos.surah_number);
        setVerseStart(pos.verse_start);
        setVerseEnd(pos.verse_end);
      }
    } catch (err) {
      console.error('Failed to load playback position:', err);
    }
  };

  // تحميل الموضع عند البدء
  useEffect(() => {
    loadPlaybackPosition();
  }, []);

  // حفظ الموضع كل 10 ثواني
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(savePlaybackPosition, 10000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTime, reciter, surahNumber, verseStart, verseEnd]);

  // تحديث الوقت
  useEffect(() => {
    const audio = audioRef.current;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      savePlaybackPosition();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // تحديث الصوت
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const play = (newReciter, newSurah, newVerseStart, newVerseEnd) => {
    if (newReciter) setReciter(newReciter);
    if (newSurah) setSurahNumber(newSurah);
    if (newVerseStart) setVerseStart(newVerseStart);
    if (newVerseEnd) setVerseEnd(newVerseEnd);

    const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/${newReciter || reciter}/${newSurah || surahNumber}.mp3`;
    
    if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
    }
    
    audioRef.current.play();
    setIsPlaying(true);
    setIsMinimized(false);
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const stop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const value = {
    isPlaying,
    currentTime,
    duration,
    volume,
    reciter,
    surahNumber,
    verseStart,
    verseEnd,
    isMinimized,
    setVolume,
    setReciter,
    setSurahNumber,
    setVerseStart,
    setVerseEnd,
    setIsMinimized,
    play,
    pause,
    togglePlay,
    seek,
    stop,
    savePlaybackPosition
  };

  return (
    <GlobalQuranPlayerContext.Provider value={value}>
      {children}
    </GlobalQuranPlayerContext.Provider>
  );
}