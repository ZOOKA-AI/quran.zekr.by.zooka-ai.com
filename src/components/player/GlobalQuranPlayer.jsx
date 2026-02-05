import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Play, Pause, Volume2, VolumeX, ChevronDown, ChevronUp, BookOpen, User } from 'lucide-react';
import { useGlobalQuranPlayer } from './GlobalQuranPlayerContext';

const RECITERS = [
  { id: 'ar.alafasy', name: 'مشاري العفاسي' },
  { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد' },
  { id: 'ar.abdullahbasfar', name: 'عبدالله بصفر' },
  { id: 'ar.hudhaify', name: 'علي الحذيفي' },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي' },
  { id: 'ar.husary', name: 'محمود خليل الحصري' },
  { id: 'ar.muhammadayyoub', name: 'محمد أيوب' },
  { id: 'ar.shaatree', name: 'أبو بكر الشاطري' }
];

const SURAHS = [
  { number: 1, name: 'الفاتحة', verses: 7 },
  { number: 2, name: 'البقرة', verses: 286 },
  { number: 3, name: 'آل عمران', verses: 200 },
  { number: 18, name: 'الكهف', verses: 110 },
  { number: 36, name: 'يس', verses: 83 },
  { number: 55, name: 'الرحمن', verses: 78 },
  { number: 67, name: 'الملك', verses: 30 },
  { number: 112, name: 'الإخلاص', verses: 4 },
  { number: 113, name: 'الفلق', verses: 5 },
  { number: 114, name: 'الناس', verses: 6 }
];

export default function GlobalQuranPlayer() {
  const {
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
    seek
  } = useGlobalQuranPlayer();

  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeToggle = () => {
    if (isMuted) {
      setVolume(1);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedSurah = SURAHS.find(s => s.number === surahNumber);

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-900/95 to-teal-900/95 backdrop-blur-xl border-t-2 border-amber-500/50 shadow-2xl" dir="rtl">
      {/* Header - Always Visible */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={togglePlay}
            className="text-white hover:bg-white/10"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <div className="text-sm text-white">
            <p className="font-bold">{selectedSurah?.name || 'اختر سورة'}</p>
            <p className="text-xs text-emerald-200">{RECITERS.find(r => r.id === reciter)?.name}</p>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-white hover:bg-white/10"
        >
          {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>
      </div>

      {/* Full Player - Expandable */}
      {!isMinimized && (
        <div className="p-6 space-y-4">
          {/* Controls Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reciter Selection */}
            <div>
              <label className="text-sm text-emerald-200 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                القارئ
              </label>
              <Select value={reciter} onValueChange={setReciter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECITERS.map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Surah Selection */}
            <div>
              <label className="text-sm text-emerald-200 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                السورة
              </label>
              <Select value={surahNumber.toString()} onValueChange={(v) => setSurahNumber(parseInt(v))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SURAHS.map(s => (
                    <SelectItem key={s.number} value={s.number.toString()}>
                      {s.name} ({s.verses} آية)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Verse Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-emerald-200 mb-2 block">من الآية</label>
              <Input
                type="number"
                min="1"
                max={selectedSurah?.verses || 286}
                value={verseStart}
                onChange={(e) => setVerseStart(parseInt(e.target.value) || 1)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-emerald-200 mb-2 block">إلى الآية</label>
              <Input
                type="number"
                min={verseStart}
                max={selectedSurah?.verses || 286}
                value={verseEnd}
                onChange={(e) => setVerseEnd(parseInt(e.target.value) || verseEnd)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          {/* Play Button */}
          <Button
            onClick={() => play()}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold"
          >
            <Play className="w-5 h-5 ml-2" />
            تشغيل
          </Button>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={(value) => seek(value[0])}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-emerald-200">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleVolumeToggle}
              className="text-white hover:bg-white/10"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </Card>
  );
}