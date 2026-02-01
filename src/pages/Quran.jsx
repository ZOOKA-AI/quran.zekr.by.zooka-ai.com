import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, MessageSquare, Share2, Copy, Play, Menu, Filter, BookOpen, List } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const FEATURED_SURAHS = [
  { number: 1, name: 'الفاتحة', color: 'from-emerald-500 to-green-600' },
  { number: 2, name: 'البقرة', color: 'from-blue-500 to-indigo-600' },
  { number: 18, name: 'الكهف', color: 'from-purple-500 to-pink-600' },
  { number: 36, name: 'يس', color: 'from-amber-500 to-orange-600' },
  { number: 67, name: 'الملك', color: 'from-teal-500 to-cyan-600' },
  { number: 55, name: 'الرحمن', color: 'from-rose-500 to-red-600' },
];
import { toast } from 'sonner';
import SurahCard from '../components/quran/SurahCard';
import { useAuth } from '@/components/AuthProvider';

const SURAHS = [
  { number: 1, name: 'الفاتحة', arabic_name: 'ٱلْفَاتِحَة', transliteration: 'Al-Fatihah', verses_count: 7, revelation_place: 'Makkah', juz_start: 1 },
  { number: 2, name: 'البقرة', arabic_name: 'ٱلْبَقَرَة', transliteration: 'Al-Baqarah', verses_count: 286, revelation_place: 'Madinah', juz_start: 1 },
  { number: 3, name: 'آل عمران', arabic_name: 'آل عِمْرَان', transliteration: 'Ali \'Imran', verses_count: 200, revelation_place: 'Madinah', juz_start: 3 },
  { number: 4, name: 'النساء', arabic_name: 'ٱلنِّسَاء', transliteration: 'An-Nisa', verses_count: 176, revelation_place: 'Madinah', juz_start: 4 },
  { number: 5, name: 'المائدة', arabic_name: 'ٱلْمَائِدَة', transliteration: 'Al-Ma\'idah', verses_count: 120, revelation_place: 'Madinah', juz_start: 6 },
  { number: 6, name: 'الأنعام', arabic_name: 'ٱلْأَنْعَام', transliteration: 'Al-An\'am', verses_count: 165, revelation_place: 'Makkah', juz_start: 7 },
  { number: 7, name: 'الأعراف', arabic_name: 'ٱلْأَعْرَاف', transliteration: 'Al-A\'raf', verses_count: 206, revelation_place: 'Makkah', juz_start: 8 },
  { number: 8, name: 'الأنفال', arabic_name: 'ٱلْأَنْفَال', transliteration: 'Al-Anfal', verses_count: 75, revelation_place: 'Madinah', juz_start: 9 },
  { number: 9, name: 'التوبة', arabic_name: 'ٱلتَّوْبَة', transliteration: 'At-Tawbah', verses_count: 129, revelation_place: 'Madinah', juz_start: 10 },
  { number: 10, name: 'يونس', arabic_name: 'يُونُس', transliteration: 'Yunus', verses_count: 109, revelation_place: 'Makkah', juz_start: 11 },
  { number: 11, name: 'هود', arabic_name: 'هُود', transliteration: 'Hud', verses_count: 123, revelation_place: 'Makkah', juz_start: 11 },
  { number: 12, name: 'يوسف', arabic_name: 'يُوسُف', transliteration: 'Yusuf', verses_count: 111, revelation_place: 'Makkah', juz_start: 12 },
  { number: 18, name: 'الكهف', arabic_name: 'ٱلْكَهْف', transliteration: 'Al-Kahf', verses_count: 110, revelation_place: 'Makkah', juz_start: 15 },
  { number: 36, name: 'يس', arabic_name: 'يٓس', transliteration: 'Ya-Sin', verses_count: 83, revelation_place: 'Makkah', juz_start: 22 },
  { number: 67, name: 'الملك', arabic_name: 'ٱلْمُلْك', transliteration: 'Al-Mulk', verses_count: 30, revelation_place: 'Makkah', juz_start: 29 },
  { number: 112, name: 'الإخلاص', arabic_name: 'ٱلْإِخْلَاص', transliteration: 'Al-Ikhlas', verses_count: 4, revelation_place: 'Makkah', juz_start: 30 },
  { number: 113, name: 'الفلق', arabic_name: 'ٱلْفَلَق', transliteration: 'Al-Falaq', verses_count: 5, revelation_place: 'Makkah', juz_start: 30 },
  { number: 114, name: 'الناس', arabic_name: 'ٱلنَّاس', transliteration: 'An-Nas', verses_count: 6, revelation_place: 'Makkah', juz_start: 30 }
];

export default function QuranPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [greeting, setGreeting] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('صباح الخير');
    else if (hour < 18) setGreeting('مساء الخير');
    else setGreeting('مساء الخير');
  }, []);

  const handleShare = () => {
    const appUrl = window.location.origin;
    const shareText = '🕌 تطبيق القرآن الكريم - مجاني بالكامل لوجه الله تعالى\n\nصدقة جارية - شارك الأجر معنا 🤲\n\n' + appUrl;
    
    if (navigator.share) {
      navigator.share({
        title: 'تطبيق القرآن الكريم',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('تم نسخ الرابط! شاركه مع من تحب لتنال الأجر 🌟');
    }
  };

  const handleCopyLink = () => {
    const appUrl = window.location.origin;
    navigator.clipboard.writeText(appUrl);
    toast.success('تم نسخ رابط التطبيق! 📋');
  };

  // Memoized filtering للأداء العالي
  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return SURAHS;
    
    const query = searchQuery.toLowerCase();
    return SURAHS.filter(surah => 
      surah.name.includes(searchQuery) || 
      surah.transliteration.toLowerCase().includes(query) ||
      surah.number.toString().includes(searchQuery)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" dir="rtl">
      
      {/* Header - Spotify Style */}
      <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-purple-600/10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-xl">
                    <Filter className="w-6 h-6 text-emerald-600" />
                    القائمة الرئيسية
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-6">
                  {/* Search Section */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <Search className="w-5 h-5 text-emerald-600" />
                      البحث
                    </h3>
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث عن سورة..."
                        className="pr-10"
                      />
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                      روابط سريعة
                    </h3>
                    <div className="space-y-2">
                      <Link to={createPageUrl('Tilawa')} onClick={() => setSidebarOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          🎧 التلاوات
                        </Button>
                      </Link>
                      <Link to={createPageUrl('Library')} onClick={() => setSidebarOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          📚 مكتبتي
                        </Button>
                      </Link>
                      <Link to={createPageUrl('Calligraphy')} onClick={() => setSidebarOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          ✨ الخطوط
                        </Button>
                      </Link>
                      <Link to={createPageUrl('Assistant')} onClick={() => setSidebarOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          🤖 المساعد الذكي
                        </Button>
                      </Link>
                      <Link to={createPageUrl('Reciters')} onClick={() => setSidebarOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          🎤 المقرئين
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Featured Surahs */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <List className="w-5 h-5 text-emerald-600" />
                      سور مميزة
                    </h3>
                    <div className="space-y-2">
                      {FEATURED_SURAHS.map(surah => (
                        <Link key={surah.number} to={createPageUrl(`SurahView?surah=${surah.number}`)} onClick={() => setSidebarOpen(false)}>
                          <div className={`p-3 bg-gradient-to-br ${surah.color} rounded-lg text-white hover:opacity-90 transition-opacity cursor-pointer`}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-black/20 rounded flex items-center justify-center text-sm font-bold">
                                {surah.number}
                              </div>
                              <span className="font-bold">{surah.name}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Share Actions */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-emerald-600" />
                      مشاركة التطبيق
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-emerald-50 hover:bg-emerald-100 border-emerald-300"
                        onClick={() => {
                          handleShare();
                          setSidebarOpen(false);
                        }}
                      >
                        <Share2 className="w-4 h-4 ml-2" />
                        مشاركة التطبيق
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-amber-50 hover:bg-amber-100 border-amber-300"
                        onClick={() => {
                          handleCopyLink();
                          setSidebarOpen(false);
                        }}
                      >
                        <Copy className="w-4 h-4 ml-2" />
                        نسخ الرابط
                      </Button>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-800">📊 إحصائيات</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-emerald-700">114</div>
                        <div className="text-xs text-emerald-600">سورة</div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-amber-700">30</div>
                        <div className="text-xs text-amber-600">جزء</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-700">6236</div>
                        <div className="text-xs text-blue-600">آية</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-700">10</div>
                        <div className="text-xs text-purple-600">مقرئ</div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <h1 className="text-2xl font-bold text-white">
              {greeting} {isAuthenticated && user?.full_name && `، ${user.full_name}`}
            </h1>
            <div className="w-10"></div>
          </div>
          
          <div className="text-center">
            <p className="text-slate-300 text-lg">استمع إلى القرآن الكريم</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Access Cards - Spotify Style */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {FEATURED_SURAHS.slice(0, 6).map(surah => (
              <Link key={surah.number} to={createPageUrl(`SurahView?surah=${surah.number}`)}>
                <Card className={`bg-gradient-to-br ${surah.color} hover:scale-105 transition-all cursor-pointer group overflow-hidden h-24`}>
                  <div className="p-4 h-full flex items-center gap-4 relative">
                    <div className="w-16 h-16 bg-black/20 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                      {surah.number}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-lg">{surah.name}</p>
                    </div>
                    <Button
                      size="icon"
                      className="bg-emerald-500 hover:bg-emerald-400 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity absolute left-4"
                    >
                      <Play className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>



        {/* Browse by Category */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">تصفح حسب الفئة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to={createPageUrl('Tilawa')}>
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 hover:scale-105 transition-all cursor-pointer p-6 h-40">
                <h3 className="text-white font-bold text-xl">التلاوات 🎧</h3>
              </Card>
            </Link>
            <Link to={createPageUrl('Library')}>
              <Card className="bg-gradient-to-br from-pink-600 to-rose-600 hover:scale-105 transition-all cursor-pointer p-6 h-40">
                <h3 className="text-white font-bold text-xl">مكتبتي 📚</h3>
              </Card>
            </Link>
            <Link to={createPageUrl('Calligraphy')}>
              <Card className="bg-gradient-to-br from-amber-600 to-orange-600 hover:scale-105 transition-all cursor-pointer p-6 h-40">
                <h3 className="text-white font-bold text-xl">الخطوط ✨</h3>
              </Card>
            </Link>
            <Link to={createPageUrl('Assistant')}>
              <Card className="bg-gradient-to-br from-teal-600 to-cyan-600 hover:scale-105 transition-all cursor-pointer p-6 h-40">
                <h3 className="text-white font-bold text-xl">المساعد 🤖</h3>
              </Card>
            </Link>
          </div>
        </div>

        {/* All Surahs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">جميع السور</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs.map(surah => (
              <Link key={surah.number} to={createPageUrl(`SurahView?surah=${surah.number}`)}>
                <Card className="bg-slate-800/50 hover:bg-slate-700/50 transition-all cursor-pointer p-4 border-slate-700 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {surah.number}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold">{surah.name}</p>
                      <p className="text-slate-400 text-sm">{surah.verses_count} آية • {surah.revelation_place === 'Makkah' ? 'مكية' : 'مدنية'}</p>
                    </div>
                    <Button
                      size="icon"
                      className="bg-emerald-500 hover:bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filteredSurahs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 text-xl">لم يتم العثور على نتائج</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}