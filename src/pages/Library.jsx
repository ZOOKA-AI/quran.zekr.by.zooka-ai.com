import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookMarked, Heart, Clock, ListMusic, Plus, Play, Library as LibraryIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/components/AuthProvider';
import IslamicBackground from '@/components/layout/IslamicBackground';

export default function Library() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('bookmarks');

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.list('-created_date'),
    initialData: [],
    enabled: isAuthenticated,
  });

  const { data: recentListens = [] } = useQuery({
    queryKey: ['recent-listens'],
    queryFn: () => [],
    initialData: [],
  });

  return (
    <IslamicBackground variant="default">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* الرأس */}
        <div className="text-center mb-10 pt-8">
          <div className="mb-6">
            <div className="inline-block p-5 bg-gradient-to-br from-rose-500/20 to-pink-600/10 rounded-3xl backdrop-blur-sm border border-rose-400/20">
              <LibraryIcon className="w-14 h-14 text-rose-300" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-amber-100 mb-2">مكتبتي</h1>
          <p className="text-indigo-200">جميع محفوظاتك وقوائمك في مكان واحد</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900/60 border-rose-500/20 backdrop-blur-xl">
            <TabsTrigger value="bookmarks" className="gap-2">
              <BookMarked className="w-4 h-4" />
              المحفوظات
            </TabsTrigger>
            <TabsTrigger value="playlists" className="gap-2">
              <ListMusic className="w-4 h-4" />
              قوائمي
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="w-4 h-4" />
              المفضلة
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <Clock className="w-4 h-4" />
              الاستماع الأخير
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks" className="space-y-4">
            {!isAuthenticated ? (
              <Card className="bg-slate-900/60 backdrop-blur-xl border-rose-500/20 p-12 text-center">
                <BookMarked className="w-16 h-16 text-rose-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-amber-100 mb-2">سجّل الدخول لعرض محفوظاتك</h3>
                <p className="text-slate-400 mb-6">احفظ آياتك المفضلة واستمع إليها في أي وقت</p>
                <Button onClick={() => base44.auth.redirectToLogin()}>
                  تسجيل الدخول
                </Button>
              </Card>
            ) : bookmarks.length === 0 ? (
              <Card className="bg-slate-900/60 backdrop-blur-xl border-rose-500/20 p-12 text-center">
                <BookMarked className="w-16 h-16 text-rose-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-amber-100 mb-2">لا توجد محفوظات بعد</h3>
                <p className="text-slate-400 mb-6">ابدأ بحفظ آياتك المفضلة</p>
                <Link to={createPageUrl('Quran')}>
                  <Button className="bg-rose-600 hover:bg-rose-700">
                    تصفح القرآن
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarks.map(bookmark => (
                  <Link key={bookmark.id} to={createPageUrl(`SurahView?surah=${bookmark.surah_number}`)}>
                    <Card className="bg-slate-900/60 backdrop-blur-xl border-rose-500/20 hover:border-rose-400/40 transition-all p-4 group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-pink-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">{bookmark.surah_number}</span>
                          </div>
                          <div>
                            <p className="text-amber-100 font-bold">سورة {bookmark.surah_number}</p>
                            <p className="text-slate-400 text-sm">آية {bookmark.verse_number}</p>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          className="bg-rose-500 hover:bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                      {bookmark.note && (
                        <p className="text-slate-400 text-sm line-clamp-2">{bookmark.note}</p>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="playlists" className="space-y-4">
            <Card className="bg-slate-900/60 backdrop-blur-xl border-rose-500/20 p-12 text-center">
              <ListMusic className="w-16 h-16 text-rose-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-amber-100 mb-2">قوائم التشغيل</h3>
              <p className="text-slate-400 mb-6">قريباً - أنشئ قوائم تشغيل مخصصة للسور</p>
              <Button className="gap-2 bg-rose-600 hover:bg-rose-700">
                <Plus className="w-4 h-4" />
                إنشاء قائمة جديدة
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <Card className="bg-slate-900/60 backdrop-blur-xl border-rose-500/20 p-12 text-center">
              <Heart className="w-16 h-16 text-rose-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-amber-100 mb-2">السور المفضلة</h3>
              <p className="text-slate-400 mb-6">ضع علامة قلب على السور المفضلة لديك</p>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <Card className="bg-slate-900/60 backdrop-blur-xl border-rose-500/20 p-12 text-center">
              <Clock className="w-16 h-16 text-rose-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-amber-100 mb-2">استماعاتك الأخيرة</h3>
              <p className="text-slate-400">سجل الاستماع سيظهر هنا</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </IslamicBackground>
  );
}