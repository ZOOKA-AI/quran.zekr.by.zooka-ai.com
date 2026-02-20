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
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState('128');
  const [reciter, setReciter] = useState('ar.alafasy');
  const [surahNumber, setSurahNumber] = useState(1);
  const [verseStart, setVerseStart] = useState(1);
  const [verseEnd, setVerseEnd] = useState(7);
  const [customStart, setCustomStart] = useState(0);
  const [customEnd, setCustomEnd] = useState(null);
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

  // تحديث السرعة
  useEffect(() => {
    audioRef.current.playbackRate = speed;
  }, [speed]);

  // إيقاف التشغيل عند نقطة النهاية المخصصة
  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      if (customEnd !== null && typeof customEnd === 'number' && audio.currentTime >= customEnd) {
        audio.pause();
        setIsPlaying(false);
        audio.currentTime = customStart || 0;
      }
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [customStart, customEnd]);

  const play = async (newReciter, newSurah, newVerseStart, newVerseEnd) => {
    if (newReciter) setReciter(newReciter);
    if (newSurah) setSurahNumber(newSurah);
    if (newVerseStart) setVerseStart(newVerseStart);
    if (newVerseEnd) setVerseEnd(newVerseEnd);

    const reciterValue = newReciter || reciter;
    const surahValue = newSurah || surahNumber;
    
    // محاولة جلب التلاوة من قاعدة البيانات المحلية
    try {
      const recitations = await base44.entities.Recitation.filter({
        reciter_id: reciterValue,
        surah_number: surahValue
      });
      
      if (recitations.length > 0 && recitations[0].audio_url) {
        const audioUrl = recitations[0].audio_url;
        
        // Try to use cached version from IndexedDB
        const cachedBlob = await getCachedAudio(audioUrl);
        if (cachedBlob) {
          const blobUrl = URL.createObjectURL(cachedBlob);
          audioRef.current.src = blobUrl;
        } else {
          audioRef.current.src = audioUrl;
          // Download and cache in background
          cacheAudio(audioUrl);
        }
      }
    } catch (err) {
      console.error('Failed to fetch recitation from database:', err);
    }
    
    if (customStart > 0) {
      audioRef.current.currentTime = customStart;
    }
    
    audioRef.current.play().catch(err => {
      console.error('Audio playback error:', err);
      setIsPlaying(false);
    });
    audioRef.current.playbackRate = speed;
    setIsPlaying(true);
    setIsMinimized(false);
  };

  // وظيفة للحصول على الصوت من الذاكرة المحلية
  const getCachedAudio = async (url) => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['audio'], 'readonly');
      const store = transaction.objectStore('audio');
      const request = store.get(url);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result?.blob);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error('Failed to get cached audio:', err);
      return null;
    }
  };

  // وظيفة لحفظ الصوت في الذاكرة المحلية
  const cacheAudio = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const db = await openDB();
      const transaction = db.transaction(['audio'], 'readwrite');
      const store = transaction.objectStore('audio');
      store.put({ url, blob, timestamp: Date.now() });
    } catch (err) {
      console.error('Failed to cache audio:', err);
    }
  };

  // فتح قاعدة البيانات المحلية
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('QuranAudioDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('audio')) {
          db.createObjectStore('audio', { keyPath: 'url' });
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
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
    speed,
    quality,
    customStart,
    customEnd,
    reciter,
    surahNumber,
    verseStart,
    verseEnd,
    isMinimized,
    setVolume,
    setSpeed,
    setQuality,
    setCustomStart,
    setCustomEnd,
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