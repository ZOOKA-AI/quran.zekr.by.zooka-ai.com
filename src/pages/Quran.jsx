import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Search, Play, Menu, Filter, Settings as SettingsIcon, Home, Star, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import PrayerTimesWidget from '../components/prayer/PrayerTimesWidget';
import WeatherWidget from '../components/weather/WeatherWidget';
import DailyContent from '../components/daily/DailyContent';
import DedicationCard from '../components/quran/DedicationCard';
import DailyVerseCard from '../components/quran/DailyVerseCard';
import AppFeaturesBanner from '../components/quran/AppFeaturesBanner';
import ExternalResourcesWidget from '../components/quran/ExternalResourcesWidget';
import QuickNavigation from '../components/home/QuickNavigation';
import FeaturedChannels from '@/components/channels/FeaturedChannels';
import FeaturedSurahs from '../components/home/FeaturedSurahs';
import AppSettingsPanel from '../components/settings/AppSettingsPanel';
import QuranStats from '../components/quran/QuranStats';

const SURAHS = [
  { number: 1, name: 'الفاتحة', arabic_name: 'ٱلْفَاتِحَة', verses_count: 7, revelation_place: 'Makkah' },
  { number: 2, name: 'البقرة', arabic_name: 'ٱلْبَقَرَة', verses_count: 286, revelation_place: 'Madinah' },
  { number: 3, name: 'آل عمران', arabic_name: 'آل عِمْرَان', verses_count: 200, revelation_place: 'Madinah' },
  { number: 4, name: 'النساء', arabic_name: 'ٱلنِّسَاء', verses_count: 176, revelation_place: 'Madinah' },
  { number: 5, name: 'المائدة', arabic_name: 'ٱلْمَائِدَة', verses_count: 120, revelation_place: 'Madinah' },
  { number: 6, name: 'الأنعام', arabic_name: 'ٱلْأَنْعَام', verses_count: 165, revelation_place: 'Makkah' },
  { number: 7, name: 'الأعراف', arabic_name: 'ٱلْأَعْرَاف', verses_count: 206, revelation_place: 'Makkah' },
  { number: 18, name: 'الكهف', arabic_name: 'ٱلْكَهْف', verses_count: 110, revelation_place: 'Makkah' },
  { number: 36, name: 'يس', arabic_name: 'يٓس', verses_count: 83, revelation_place: 'Makkah' },
  { number: 55, name: 'الرحمن', arabic_name: 'ٱلرَّحْمَٰن', verses_count: 78, revelation_place: 'Madinah' },
  { number: 67, name: 'الملك', arabic_name: 'ٱلْمُلْك', verses_count: 30, revelation_place: 'Makkah' },
  { number: 112, name: 'الإخلاص', arabic_name: 'ٱلْإِخْلَاص', verses_count: 4, revelation_place: 'Makkah' },
  { number: 113, name: 'الفلق', arabic_name: 'ٱلْفَلَق', verses_count: 5, revelation_place: 'Makkah' },
  { number: 114, name: 'الناس', arabic_name: 'ٱلنَّاس', verses_count: 6, revelation_place: 'Makkah' }
];

export default function QuranPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredSurahs = searchQuery
    ? SURAHS.filter(s => 
        s.name.includes(searchQuery) || 
        s.number.toString().includes(searchQuery)
      )
    : SURAHS;

  return (
    <div className="min-h-screen relative pb-32" dir="rtl">
      {/* خلفية روحانية */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1920&q=80)',
            filter: 'brightness(0.25)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/90 via-slate-900/95 to-slate-950/98" />
      </div>
      
      <div className="relative z-10">
        {/* الرأس */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 px-4"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">القرآن الكريم</h1>
          <p className="text-xl text-amber-200 font-arabic">﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾</p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4">
          {/* تبويبات رئيسية */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-amber-500/30">
              <TabsTrigger value="home" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <Home className="w-4 h-4 ml-2" />
                الرئيسية
              </TabsTrigger>
              <TabsTrigger value="surahs" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <BookOpen className="w-4 h-4 ml-2" />
                السور
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
                <SettingsIcon className="w-4 h-4 ml-2" />
                الإعدادات
              </TabsTrigger>
            </TabsList>

            {/* تبويب الرئيسية */}
            <TabsContent value="home" className="space-y-8 mt-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <DedicationCard />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <DailyVerseCard />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  التنقل السريع
                </h2>
                <QuickNavigation />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  السور المميزة
                </h2>
                <FeaturedSurahs />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="text-2xl font-bold text-amber-100 mb-4">إحصائيات القرآن الكريم</h2>
                <QuranStats />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h2 className="text-2xl font-bold text-amber-100 mb-4">🕌 مواقيت الصلاة والطقس</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2"><PrayerTimesWidget /></div>
                  <div><WeatherWidget /></div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <ExternalResourcesWidget />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <AppFeaturesBanner />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <DailyContent />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                <h2 className="text-2xl font-bold text-amber-100 mb-4">📺 القنوات الإسلامية المميزة</h2>
                <FeaturedChannels variant="grid" limit={6} />
              </motion.div>
            </TabsContent>

            {/* تبويب السور */}
            <TabsContent value="surahs" className="space-y-6 mt-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="relative max-w-2xl mx-auto mb-8">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                  <Input
                    placeholder="ابحث عن سورة برقمها أو اسمها..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-12 py-6 text-lg bg-slate-900/60 backdrop-blur-xl border-amber-500/30 text-white placeholder:text-white/50"
                  />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSurahs.map((surah, index) => (
                  <motion.div
                    key={surah.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link to={createPageUrl(`SurahView?surah=${surah.number}`)}>
                      <Card className="bg-slate-900/60 backdrop-blur-xl hover:bg-slate-800/70 transition-all cursor-pointer p-5 border-amber-500/20 group">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xl">
                            {surah.number}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-bold text-lg mb-1">{surah.name}</p>
                            <p className="text-emerald-300/80 text-sm">
                              {surah.verses_count} آية • {surah.revelation_place === 'Makkah' ? 'مكية' : 'مدنية'}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            className="bg-amber-500 hover:bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <Play className="w-5 h-5" />
                          </Button>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {filteredSurahs.length === 0 && (
                <Card className="p-12 text-center bg-slate-900/60 backdrop-blur-xl border-amber-500/20">
                  <BookOpen className="w-20 h-20 text-amber-400/50 mx-auto mb-4" />
                  <p className="text-white text-lg">لم يتم العثور على نتائج</p>
                </Card>
              )}
            </TabsContent>

            {/* تبويب الإعدادات */}
            <TabsContent value="settings" className="mt-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <AppSettingsPanel />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}