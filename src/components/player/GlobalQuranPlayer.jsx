import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Volume2, VolumeX, ChevronDown, ChevronUp, ChevronRight, BookOpen, User, Radio, Mic, Book, Shield, Info, Zap } from 'lucide-react';
import { useGlobalQuranPlayer } from './GlobalQuranPlayerContext';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

const RECITERS = [
  { id: 'ar.alafasy', name: 'مشاري العفاسي', quality: '320kbps', photo: 'https://static.quran.com/recitors/mishary-alafasy.jpg' },
  { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد', quality: '192kbps', photo: 'https://static.quran.com/recitors/abdul-basit.jpg' },
  { id: 'ar.abdullahbasfar', name: 'عبدالله بصفر', quality: '192kbps', photo: 'https://static.quran.com/recitors/abdullah-basfar.jpg' },
  { id: 'ar.hudhaify', name: 'علي الحذيفي', quality: '128kbps', photo: 'https://static.quran.com/recitors/ali-huthayfi.jpg' },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي', quality: '192kbps', photo: 'https://static.quran.com/recitors/minshawi.jpg' },
  { id: 'ar.husary', name: 'محمود خليل الحصري', quality: '192kbps', photo: 'https://static.quran.com/recitors/husary.jpg' },
  { id: 'ar.muhammadayyoub', name: 'محمد أيوب', quality: '128kbps', photo: 'https://static.quran.com/recitors/ayyoub.jpg' },
  { id: 'ar.shaatree', name: 'أبو بكر الشاطري', quality: '192kbps', photo: 'https://static.quran.com/recitors/shatree.jpg' },
  { id: 'ar.parhizgar', name: 'عبد الرحمن السديس', quality: '192kbps', photo: 'https://static.quran.com/recitors/parhizgar.jpg' },
  { id: 'ar.rifai', name: 'ياسر الدوسري', quality: '192kbps', photo: 'https://static.quran.com/recitors/rifai.jpg' },
  { id: 'ar.ajmi', name: 'أحمد العجمي', quality: '192kbps', photo: 'https://static.quran.com/recitors/ajmi.jpg' },
  { id: 'ar.muhaisiny', name: 'سعد الغامدي', quality: '192kbps', photo: 'https://static.quran.com/recitors/muhaisiny.jpg' }
];

const HADITH_AUDIO = [
  { id: 1, title: 'صحيح البخاري - كتاب الإيمان', duration: '45:30' },
  { id: 2, title: 'صحيح مسلم - كتاب الصلاة', duration: '38:15' },
  { id: 3, title: 'الأربعون النووية', duration: '52:20' },
  { id: 4, title: 'رياض الصالحين', duration: '65:45' }
];

const QURAN_STORIES = [
  { id: 1, title: 'قصة موسى عليه السلام', duration: '28:40' },
  { id: 2, title: 'قصة يوسف عليه السلام', duration: '35:20' },
  { id: 3, title: 'قصة أصحاب الكهف', duration: '22:15' },
  { id: 4, title: 'قصة مريم عليها السلام', duration: '18:30' }
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
    seek
  } = useGlobalQuranPlayer();

  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('quran');
  const [isSliding, setIsSliding] = useState(false);

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
  const selectedReciter = RECITERS.find(r => r.id === reciter);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isSliding ? -280 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50"
        dir="rtl"
      >
        <Card className="relative bg-gradient-to-r from-slate-950/98 via-slate-900/98 to-slate-950/98 backdrop-blur-2xl border-t-2 border-amber-500/50 shadow-2xl overflow-hidden">
          {/* خلفية إسلامية عصرية */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 5.858L5.858 30 30 54.142 54.142 30 30 5.858z' fill='%23fbbf24' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
          {/* Header - Always Visible */}
          <div className="relative px-4 py-3 flex items-center justify-between border-b border-amber-500/20 bg-gradient-to-r from-amber-950/20 to-transparent">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsSliding(!isSliding)}
              className="text-amber-300 hover:bg-amber-900/30 hover:text-amber-200"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${isSliding ? 'rotate-180' : ''}`} />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={togglePlay}
                className="text-amber-300 hover:bg-amber-900/30 hover:text-amber-200"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <div className="text-sm text-white">
                <p className="font-bold font-arabic text-amber-200">{selectedSurah?.name || 'مشغل القرآن الذكي'}</p>
                <p className="text-xs text-amber-300">
                  {selectedReciter?.name} • {selectedReciter?.quality}
                </p>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-amber-300 hover:bg-amber-900/30 hover:text-amber-200"
            >
              {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </div>

          {/* Full Player - Expandable */}
          {!isMinimized && (
            <div className="relative p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-gradient-to-b from-slate-950/50 to-slate-900/50">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-900/80 backdrop-blur border border-amber-500/20">
                  <TabsTrigger value="quran" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 data-[state=active]:text-white text-amber-300">
                    <BookOpen className="w-4 h-4 ml-2" />
                    قرآن
                  </TabsTrigger>
                  <TabsTrigger value="hadith" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white text-amber-300">
                    <Book className="w-4 h-4 ml-2" />
                    أحاديث
                  </TabsTrigger>
                  <TabsTrigger value="stories" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white text-amber-300">
                    <Mic className="w-4 h-4 ml-2" />
                    قصص
                  </TabsTrigger>
                  <TabsTrigger value="radio" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-cyan-700 data-[state=active]:text-white text-amber-300">
                    <Radio className="w-4 h-4 ml-2" />
                    راديو
                  </TabsTrigger>
                </TabsList>

                {/* القرآن الكريم */}
                <TabsContent value="quran" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Reciter Selection */}
                    <div>
                      <label className="text-sm text-amber-300 mb-2 flex items-center gap-2 font-bold">
                        <User className="w-4 h-4" />
                        القارئ - الجودة
                      </label>
                      <Select value={reciter} onValueChange={setReciter}>
                        <SelectTrigger className="bg-slate-900/80 border-amber-500/30 text-amber-100 hover:border-amber-500/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {RECITERS.map(r => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name} ({r.quality})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Surah Selection */}
                    <div>
                      <label className="text-sm text-amber-300 mb-2 flex items-center gap-2 font-bold">
                        <BookOpen className="w-4 h-4" />
                        السورة
                      </label>
                      <Select value={surahNumber.toString()} onValueChange={(v) => setSurahNumber(parseInt(v))}>
                        <SelectTrigger className="bg-slate-900/80 border-amber-500/30 text-amber-100 hover:border-amber-500/50">
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
                      <label className="text-sm text-amber-300 mb-2 block font-bold">من الآية</label>
                      <Input
                        type="number"
                        min="1"
                        max={selectedSurah?.verses || 286}
                        value={verseStart}
                        onChange={(e) => setVerseStart(parseInt(e.target.value) || 1)}
                        className="bg-slate-900/80 border-amber-500/30 text-amber-100 hover:border-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-amber-300 mb-2 block font-bold">إلى الآية</label>
                      <Input
                        type="number"
                        min={verseStart}
                        max={selectedSurah?.verses || 286}
                        value={verseEnd}
                        onChange={(e) => setVerseEnd(parseInt(e.target.value) || verseEnd)}
                        className="bg-slate-900/80 border-amber-500/30 text-amber-100 hover:border-amber-500/50"
                      />
                    </div>
                  </div>

                  {/* Play Button */}
                  <Button
                    onClick={() => play()}
                    className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white font-bold shadow-lg shadow-amber-900/50"
                  >
                    <Play className="w-5 h-5 ml-2" />
                    تشغيل بجودة عالية
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
                    <div className="flex justify-between text-xs text-amber-300 font-bold">
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
                      className="text-amber-300 hover:bg-amber-900/30"
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

                  {/* Speed Control */}
                  <div>
                    <label className="text-sm text-amber-300 mb-2 flex items-center gap-2 font-bold">
                      <Zap className="w-4 h-4" />
                      سرعة التشغيل
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0.75, 1, 1.25, 1.5].map(s => (
                        <Button
                          key={s}
                          variant={speed === s ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSpeed(s)}
                          className={speed === s ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : 'border-amber-500/30 text-amber-300 hover:bg-amber-900/20'}
                        >
                          {s}x
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Control */}
                  <div>
                    <label className="text-sm text-amber-300 mb-2 block font-bold">جودة الصوت</label>
                    <Select value={quality || 'medium'} onValueChange={setQuality}>
                      <SelectTrigger className="bg-slate-900/80 border-amber-500/30 text-amber-100 hover:border-amber-500/50">
                        <SelectValue placeholder="اختر الجودة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">منخفضة (64kbps)</SelectItem>
                        <SelectItem value="medium">متوسطة (128kbps)</SelectItem>
                        <SelectItem value="high">عالية (192kbps)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Start/End Points */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-amber-300 mb-2 block font-bold">نقطة البدء (ثانية)</label>
                      <Input
                        type="number"
                        min="0"
                        max={duration || 0}
                        value={typeof customStart === 'number' ? customStart : 0}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomStart(val ? parseFloat(val) : 0);
                        }}
                        className="bg-slate-900/80 border-amber-500/30 text-amber-100 hover:border-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-amber-300 mb-2 block font-bold">نقطة النهاية (ثانية)</label>
                      <Input
                        type="number"
                        min="0"
                        max={duration || 0}
                        value={customEnd ? String(customEnd) : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomEnd(val && val.trim() ? parseFloat(val) : null);
                        }}
                        className="bg-slate-900/80 border-amber-500/30 text-amber-100 hover:border-amber-500/50"
                        placeholder="بدون حد"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* الأحاديث */}
                <TabsContent value="hadith" className="space-y-3 mt-4">
                  {HADITH_AUDIO.map(hadith => (
                    <div key={hadith.id} className="bg-slate-900/60 border border-amber-500/20 rounded-lg p-4 hover:bg-slate-800/60 hover:border-amber-500/40 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Button size="icon" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-full shadow-lg shadow-amber-900/50">
                          <Play className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <p className="text-amber-100 font-bold text-sm">{hadith.title}</p>
                          <p className="text-amber-300 text-xs">{hadith.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* قصص القرآن */}
                <TabsContent value="stories" className="space-y-3 mt-4">
                  {QURAN_STORIES.map(story => (
                    <div key={story.id} className="bg-slate-900/60 border border-purple-500/20 rounded-lg p-4 hover:bg-slate-800/60 hover:border-purple-500/40 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Button size="icon" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-full shadow-lg shadow-purple-900/50">
                          <Play className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <p className="text-amber-100 font-bold text-sm">{story.title}</p>
                          <p className="text-purple-300 text-xs">{story.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* الراديو المباشر */}
                <TabsContent value="radio" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      <p className="text-white text-sm font-bold">🔴 بث مباشر 24/7</p>
                    </div>
                    <p className="text-red-100 text-xs">من المسجد الحرام والمسجد النبوي</p>
                  </div>

                  <Link to={createPageUrl('QuranRadio')}>
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 shadow-lg shadow-cyan-900/50">
                      <Radio className="w-5 h-5 ml-2" />
                      فتح الإذاعات المباشرة
                    </Button>
                  </Link>
                </div>
                </TabsContent>
              </Tabs>

              {/* Footer Links */}
              <div className="pt-4 mt-4 border-t border-amber-500/20">
                <div className="flex flex-wrap gap-4 justify-center text-xs">
                  <Link to={createPageUrl('StaticPageView?slug=privacy')} className="flex items-center gap-1 text-amber-300 hover:text-amber-100 transition-colors">
                    <Shield className="w-3 h-3" />
                    سياسة الخصوصية
                  </Link>
                  <Link to={createPageUrl('StaticPageView?slug=about')} className="flex items-center gap-1 text-amber-300 hover:text-amber-100 transition-colors">
                    <Info className="w-3 h-3" />
                    من نحن
                  </Link>
                  <span className="text-amber-400 font-bold">© حقوق الملكية محفوظة 2026</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}