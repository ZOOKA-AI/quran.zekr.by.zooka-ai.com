import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Bookmark, Clock, TrendingUp, Sparkles, Music, BookOpen, Headphones } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/components/AuthProvider';

const FEATURED_SURAHS = [
  { number: 1, name: 'الفاتحة', color: 'from-emerald-500 to-green-600' },
  { number: 2, name: 'البقرة', color: 'from-blue-500 to-indigo-600' },
  { number: 18, name: 'الكهف', color: 'from-purple-500 to-pink-600' },
  { number: 36, name: 'يس', color: 'from-amber-500 to-orange-600' },
  { number: 67, name: 'الملك', color: 'from-teal-500 to-cyan-600' },
];

const POPULAR_RECITERS = [
  { id: 'mishari', name: 'مشاري العفاسي', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
  { id: 'sudais', name: 'السديس', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300' },
  { id: 'husary', name: 'الحصري', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' },
  { id: 'minshawi', name: 'المنشاوي', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300' },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('صباح الخير');
    else if (hour < 18) setGreeting('مساء الخير');
    else setGreeting('مساء الخير');
  }, []);

  const { data: recentBookmarks = [] } = useQuery({
    queryKey: ['recent-bookmarks'],
    queryFn: () => base44.entities.Bookmark.list('-created_date', 3),
    initialData: [],
    enabled: isAuthenticated,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" dir="rtl">
      {/* Hero Section - Spotify-style */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-purple-600/20" />
        <div className="max-w-7xl mx-auto px-6 py-12 relative">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {greeting} {isAuthenticated && user?.full_name && `، ${user.full_name}`}
            </h1>
            <p className="text-slate-300 text-lg">ماذا تريد أن تستمع اليوم؟</p>
          </div>

          {/* Quick Actions - Spotify Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
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

          {/* Recent Bookmarks */}
          {isAuthenticated && recentBookmarks.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">آخر المحفوظات</h2>
                <Link to={createPageUrl('Bookmarks')}>
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    عرض الكل
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentBookmarks.map(bookmark => (
                  <Link key={bookmark.id} to={createPageUrl(`SurahView?surah=${bookmark.surah_number}`)}>
                    <Card className="bg-slate-800/50 hover:bg-slate-700/50 transition-all cursor-pointer p-4 border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                          <Bookmark className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-bold">سورة {bookmark.surah_number}</p>
                          <p className="text-slate-400 text-sm">آية {bookmark.verse_number}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Popular Reciters */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">القراء المشهورون</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {POPULAR_RECITERS.map(reciter => (
                <Link key={reciter.id} to={createPageUrl('Reciters')}>
                  <Card className="bg-slate-800/50 hover:bg-slate-700/50 transition-all cursor-pointer p-4 border-slate-700 group">
                    <div className="relative">
                      <div className="aspect-square rounded-full overflow-hidden mb-4 bg-gradient-to-br from-emerald-600 to-green-600">
                        <img src={reciter.image} alt={reciter.name} className="w-full h-full object-cover" />
                      </div>
                      <Button
                        size="icon"
                        className="bg-emerald-500 hover:bg-emerald-400 rounded-full shadow-lg absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="text-white font-bold text-center">{reciter.name}</p>
                    <p className="text-slate-400 text-sm text-center">قارئ</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Browse Categories */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">تصفح حسب الفئات</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to={createPageUrl('Quran')}>
                <Card className="bg-gradient-to-br from-red-600 to-pink-600 hover:scale-105 transition-all cursor-pointer p-6 h-40 relative overflow-hidden">
                  <BookOpen className="w-16 h-16 text-white/20 absolute -bottom-4 -left-4 rotate-12" />
                  <h3 className="text-white font-bold text-xl mb-2">القرآن الكريم</h3>
                  <p className="text-white/80 text-sm">114 سورة</p>
                </Card>
              </Link>
              <Link to={createPageUrl('Tilawa')}>
                <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 hover:scale-105 transition-all cursor-pointer p-6 h-40 relative overflow-hidden">
                  <Headphones className="w-16 h-16 text-white/20 absolute -bottom-4 -left-4 rotate-12" />
                  <h3 className="text-white font-bold text-xl mb-2">التلاوات</h3>
                  <p className="text-white/80 text-sm">8 قراء مشهورين</p>
                </Card>
              </Link>
              <Link to={createPageUrl('Calligraphy')}>
                <Card className="bg-gradient-to-br from-amber-600 to-orange-600 hover:scale-105 transition-all cursor-pointer p-6 h-40 relative overflow-hidden">
                  <Sparkles className="w-16 h-16 text-white/20 absolute -bottom-4 -left-4 rotate-12" />
                  <h3 className="text-white font-bold text-xl mb-2">الخطوط الإسلامية</h3>
                  <p className="text-white/80 text-sm">صور جميلة</p>
                </Card>
              </Link>
              <Link to={createPageUrl('PrayerTimes')}>
                <Card className="bg-gradient-to-br from-teal-600 to-cyan-600 hover:scale-105 transition-all cursor-pointer p-6 h-40 relative overflow-hidden">
                  <Clock className="w-16 h-16 text-white/20 absolute -bottom-4 -left-4 rotate-12" />
                  <h3 className="text-white font-bold text-xl mb-2">مواقيت الصلاة</h3>
                  <p className="text-white/80 text-sm">حسب موقعك</p>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}