import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Volume2, VolumeX, ChevronDown, ChevronUp, ChevronRight, BookOpen, User, Radio, Mic, Book, Shield, Info } from 'lucide-react';
import { useGlobalQuranPlayer } from './GlobalQuranPlayerContext';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

const RECITERS = [
  { id: 'ar.alafasy', name: 'مشاري العفاسي', quality: '320kbps' },
  { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد', quality: '192kbps' },
  { id: 'ar.abdullahbasfar', name: 'عبدالله بصفر', quality: '192kbps' },
  { id: 'ar.hudhaify', name: 'علي الحذيفي', quality: '128kbps' },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي', quality: '192kbps' },
  { id: 'ar.husary', name: 'محمود خليل الحصري', quality: '192kbps' },
  { id: 'ar.muhammadayyoub', name: 'محمد أيوب', quality: '128kbps' },
  { id: 'ar.shaatree', name: 'أبو بكر الشاطري', quality: '192kbps' },
  { id: 'ar.parhizgar', name: 'عبد الرحمن السديس', quality: '192kbps' },
  { id: 'ar.rifai', name: 'ياسر الدوسري', quality: '192kbps' },
  { id: 'ar.ajmi', name: 'أحمد العجمي', quality: '192kbps' },
  { id: 'ar.muhaisiny', name: 'سعد الغامدي', quality: '192kbps' }
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
        <Card className="bg-gradient-to-r from-emerald-900/98 to-teal-900/98 backdrop-blur-2xl border-t-2 border-amber-500/50 shadow-2xl">
          {/* Header - Always Visible */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsSliding(!isSliding)}
              className="text-white hover:bg-white/10"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${isSliding ? 'rotate-180' : ''}`} />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={togglePlay}
                className="text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <div className="text-sm text-white">
                <p className="font-bold">{selectedSurah?.name || 'مشغل القرآن الذكي'}</p>
                <p className="text-xs text-emerald-200">
                  {selectedReciter?.name} • {selectedReciter?.quality}
                </p>
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
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/10">
                  <TabsTrigger value="quran" className="data-[state=active]:bg-emerald-600">
                    <BookOpen className="w-4 h-4 ml-2" />
                    قرآن
                  </TabsTrigger>
                  <TabsTrigger value="hadith" className="data-[state=active]:bg-amber-600">
                    <Book className="w-4 h-4 ml-2" />
                    أحاديث
                  </TabsTrigger>
                  <TabsTrigger value="stories" className="data-[state=active]:bg-purple-600">
                    <Mic className="w-4 h-4 ml-2" />
                    قصص
                  </TabsTrigger>
                  <TabsTrigger value="radio" className="data-[state=active]:bg-cyan-600">
                    <Radio className="w-4 h-4 ml-2" />
                    راديو
                  </TabsTrigger>
                </TabsList>

                {/* القرآن الكريم */}
                <TabsContent value="quran" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Reciter Selection */}
                    <div>
                      <label className="text-sm text-emerald-200 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        القارئ - الجودة
                      </label>
                      <Select value={reciter} onValueChange={setReciter}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                </TabsContent>

                {/* الأحاديث */}
                <TabsContent value="hadith" className="space-y-3 mt-4">
                  {HADITH_AUDIO.map(hadith => (
                    <div key={hadith.id} className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Button size="icon" className="bg-amber-600 hover:bg-amber-700 rounded-full">
                          <Play className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <p className="text-white font-bold text-sm">{hadith.title}</p>
                          <p className="text-emerald-200 text-xs">{hadith.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* قصص القرآن */}
                <TabsContent value="stories" className="space-y-3 mt-4">
                  {QURAN_STORIES.map(story => (
                    <div key={story.id} className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Button size="icon" className="bg-purple-600 hover:bg-purple-700 rounded-full">
                          <Play className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <p className="text-white font-bold text-sm">{story.title}</p>
                          <p className="text-purple-200 text-xs">{story.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* الراديو */}
                <TabsContent value="radio" className="space-y-4 mt-4">
                  <Link to={createPageUrl('QuranRadio')}>
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                      <Radio className="w-5 h-5 ml-2" />
                      فتح راديو القرآن الكريم
                    </Button>
                  </Link>
                  <div className="bg-cyan-900/30 rounded-lg p-4 text-center">
                    <p className="text-cyan-200 text-sm">بث مباشر 24/7 من أفضل الإذاعات القرآنية</p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Footer Links */}
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-4 justify-center text-xs">
                  <Link to={createPageUrl('StaticPageView?slug=privacy')} className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors">
                    <Shield className="w-3 h-3" />
                    سياسة الخصوصية
                  </Link>
                  <Link to={createPageUrl('StaticPageView?slug=about')} className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors">
                    <Info className="w-3 h-3" />
                    من نحن
                  </Link>
                  <span className="text-emerald-200">© حقوق الملكية محفوظة 2026</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}