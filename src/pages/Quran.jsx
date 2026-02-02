import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Search, Play, Menu, Filter, Settings as SettingsIcon, Home, Star, Sparkles, ChevronLeft, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
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
import AdvancedSettingsPanel from '../components/settings/AdvancedSettingsPanel';
import PerformanceMonitor from '../components/settings/PerformanceMonitor';
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

  const { data: dbSurahs = [] } = useQuery({
    queryKey: ['surahs'],
    queryFn: async () => {
      return await base44.entities.Surah.list();
    }
  });

  const allSurahs = dbSurahs.length > 0 ? dbSurahs : SURAHS;

  const filteredSurahs = searchQuery
    ? allSurahs.filter(s => 
        (s.name || s.name_arabic || '').includes(searchQuery) || 
        s.number.toString().includes(searchQuery)
      )
    : allSurahs;

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
          <div className="sticky top-0 z-20 backdrop-blur-2xl bg-slate-950/80 border-b border-slate-800/50 -mx-4 px-4 py-4 mb-8">
            <div className="flex items-center gap-4 max-w-7xl mx-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                <Input
                  placeholder="ابحث عن سورة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:bg-slate-800"
                />
              </div>
              <Button size="icon" className="rounded-full bg-slate-800 hover:bg-slate-700">
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-amber-500/30">
              <TabsTrigger value="home" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <Home className="w-4 h-4 ml-2" />
                الرئيسية
              </TabsTrigger>
              <TabsTrigger value="surahs" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <BookOpen className="w-4 h-4 ml-2" />
                المكتبة
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
            <TabsContent value="surahs" className="mt-8">
              {!searchQuery ? (
                <div className="space-y-12">
                  {/* بدء الاستماع */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-2xl font-bold text-amber-100 mb-6">بدء الاستماع</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allSurahs.slice(0, 4).map((surah, index) => (
                        <motion.div
                          key={surah.number}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link to={createPageUrl(`SurahView?surah=${surah.number}`)}>
                            <Card className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50 backdrop-blur-xl transition-all p-4 group cursor-pointer">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                                  {surah.number}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-bold text-lg truncate mb-1">{surah.name}</p>
                                  <p className="text-amber-300/80 text-sm">{surah.verses_count} آية</p>
                                </div>
                                <Button
                                  size="icon"
                                  className="bg-amber-500 hover:bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Play className="w-5 h-5" />
                                </Button>
                              </div>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* ابدأ مع تلك السور */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-amber-100">ابدأ مع تلك السور</h2>
                      <Button variant="ghost" className="text-amber-300 hover:text-white">
                        المزيد
                        <ChevronLeft className="w-4 h-4 mr-2" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[0, 1, 17, 35, 54, 66, 111, 112].map((index, idx) => {
                        const surah = allSurahs[index];
                        return surah ? (
                          <motion.div
                            key={surah.number}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <Link to={createPageUrl(`SurahView?surah=${surah.number}`)}>
                              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 hover:from-slate-700/60 hover:to-slate-800/60 border-slate-700/50 transition-all overflow-hidden group p-0">
                                <div className="aspect-square bg-gradient-to-br from-amber-600 to-orange-700 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
                                  <div className="text-5xl font-bold mb-2 z-10">{surah.number}</div>
                                  <div className="text-center z-10">
                                    <p className="font-bold text-sm mb-1">{surah.name}</p>
                                    <p className="text-xs opacity-80">{surah.verses_count} آية</p>
                                  </div>
                                </div>
                              </Card>
                            </Link>
                          </motion.div>
                        ) : null;
                      })}
                    </div>
                  </motion.div>

                  {/* توصيتنا لك اليوم */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h2 className="text-2xl font-bold text-amber-100 mb-6">توصيتنا لك اليوم</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allSurahs.slice(0, 2).map((surah, index) => (
                        <motion.div
                          key={surah.number}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link to={createPageUrl(`SurahView?surah=${surah.number}`)}>
                            <Card className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 hover:from-purple-800/60 hover:to-indigo-800/60 border-purple-500/20 backdrop-blur-xl transition-all overflow-hidden cursor-pointer">
                              <div className="aspect-video bg-gradient-to-br from-purple-600 to-indigo-700 flex flex-col items-center justify-center p-6 relative overflow-hidden group">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-white transition-opacity" />
                                <div className="z-10 text-center">
                                  <div className="text-6xl font-bold text-white mb-3">{surah.number}</div>
                                  <p className="text-2xl font-bold text-white mb-2">{surah.name}</p>
                                  <p className="text-amber-200">{surah.verses_count} آية</p>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* مكتبتك الصوتية */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <h2 className="text-2xl font-bold text-amber-100 mb-6">مكتبتك الصوتية</h2>
                    <div className="space-y-1 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-slate-900/50">
                      {allSurahs.map((surah, index) => (
                        <motion.div
                          key={surah.number}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.01 }}
                        >
                          <Link to={createPageUrl(`SurahView?surah=${surah.number}`)}>
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-all group cursor-pointer">
                              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                                {surah.number}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{surah.name}</p>
                                <p className="text-amber-300/60 text-sm">{surah.verses_count} آية</p>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400 hover:text-amber-300"
                              >
                                <Play className="w-5 h-5" />
                              </Button>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                /* نتائج البحث */
                <div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="relative mb-8">
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                      <Input
                        placeholder="ابحث عن سورة برقمها أو اسمها..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="pr-12 py-6 text-lg bg-slate-900/60 backdrop-blur-xl border-amber-500/30 text-white placeholder:text-white/50"
                      />
                    </div>
                    <p className="text-amber-200 mb-6">نتائج البحث ({filteredSurahs.length})</p>
                  </motion.div>

                  {filteredSurahs.length > 0 ? (
                    <div className="space-y-2">
                      {filteredSurahs.map((surah, index) => (
                        <motion.div
                          key={surah.number}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link to={createPageUrl(`SurahView?surah=${surah.number}`)}>
                            <Card className="bg-slate-800/30 hover:bg-slate-700/50 border-slate-700/50 transition-all p-4 group cursor-pointer">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                  {surah.number}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-bold text-lg truncate mb-1">{surah.name}</p>
                                  <p className="text-amber-300/80 text-sm">
                                    {surah.verses_count} آية • {surah.revelation_type === 'مكية' ? 'مكية' : 'مدنية'}
                                  </p>
                                </div>
                                <Button
                                  size="icon"
                                  className="bg-amber-500 hover:bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Play className="w-5 h-5" />
                                </Button>
                              </div>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center bg-slate-900/60 backdrop-blur-xl border-amber-500/20">
                      <BookOpen className="w-20 h-20 text-amber-400/50 mx-auto mb-4" />
                      <p className="text-white text-lg">لم يتم العثور على نتائج</p>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            {/* تبويب الإعدادات */}
            <TabsContent value="settings" className="mt-8 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-bold text-indigo-100 mb-6">مراقبة الأداء</h2>
                <PerformanceMonitor />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-2xl font-bold text-indigo-100 mb-6">الإعدادات المتقدمة</h2>
                <AdvancedSettingsPanel />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-2xl font-bold text-indigo-100 mb-6">إعدادات التطبيق</h2>
                <AppSettingsPanel />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}