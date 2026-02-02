import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookMarked, Heart, Clock, ListMusic, Plus, Play, Library as LibraryIcon, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';

export default function Library() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('bookmarks');

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.list('-created_date'),
    initialData: [],
    enabled: isAuthenticated,
  });

  return (
    <div className="min-h-screen relative pb-24" dir="rtl">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/90 via-pink-950/95 to-slate-950/98" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <LibraryIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">مكتبتي الإسلامية</h1>
          <p className="text-rose-200 text-lg">جميع محفوظاتك وقوائمك في مكان واحد</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-rose-500/30">
            <TabsTrigger value="bookmarks" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white">
              <BookMarked className="w-4 h-4 ml-2" />
              المحفوظات
            </TabsTrigger>
            <TabsTrigger value="playlists" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <ListMusic className="w-4 h-4 ml-2" />
              قوائمي
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Heart className="w-4 h-4 ml-2" />
              المفضلة
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Clock className="w-4 h-4 ml-2" />
              الأخير
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks">
            {!isAuthenticated ? (
              <Card className="bg-slate-900/60 backdrop-blur-xl border-rose-500/30 p-16 text-center shadow-2xl">
                <BookMarked className="w-24 h-24 text-rose-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-rose-200 mb-3">سجّل الدخول لعرض محفوظاتك</h3>
                <p className="text-slate-400 text-lg mb-8">احفظ آياتك المفضلة واستمع إليها في أي وقت</p>
                <Button size="lg" onClick={() => base44.auth.redirectToLogin()} className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-lg">
                  تسجيل الدخول
                </Button>
              </Card>
            ) : bookmarks.length === 0 ? (
              <Card className="bg-slate-900/60 backdrop-blur-xl border-rose-500/30 p-16 text-center shadow-2xl">
                <BookMarked className="w-24 h-24 text-rose-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-rose-200 mb-3">لا توجد محفوظات بعد</h3>
                <p className="text-slate-400 text-lg mb-8">ابدأ بحفظ آياتك المفضلة من صفحات القرآن</p>
                <Link to={createPageUrl('Quran')}>
                  <Button size="lg" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-lg">
                    <BookMarked className="w-5 h-5 ml-2" />
                    تصفح القرآن الكريم
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((bookmark, index) => (
                  <motion.div
                    key={bookmark.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={createPageUrl(`SurahView?surah=${bookmark.surah_number}`)}>
                      <Card className="bg-slate-900/60 backdrop-blur-xl border-rose-500/30 hover:border-rose-400/60 transition-all hover:-translate-y-2 hover:shadow-2xl p-6 group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-rose-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">{bookmark.surah_number}</span>
                            </div>
                            <div>
                              <p className="text-rose-200 font-bold text-lg">سورة {bookmark.surah_number}</p>
                              <p className="text-slate-400">آية {bookmark.verse_number}</p>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            className="bg-rose-500 hover:bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Play className="w-5 h-5" />
                          </Button>
                        </div>
                        {bookmark.note && (
                          <p className="text-slate-400 text-sm line-clamp-2 bg-slate-800/40 p-3 rounded-lg">{bookmark.note}</p>
                        )}
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="playlists">
            <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30 p-16 text-center shadow-2xl">
              <ListMusic className="w-24 h-24 text-purple-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-purple-200 mb-3">قوائم التشغيل</h3>
              <p className="text-slate-400 text-lg mb-8">قريباً - أنشئ قوائم تشغيل مخصصة للسور والتلاوات</p>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg">
                <Plus className="w-5 h-5 ml-2" />
                إنشاء قائمة جديدة
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="bg-slate-900/60 backdrop-blur-xl border-pink-500/30 p-16 text-center shadow-2xl">
              <Heart className="w-24 h-24 text-pink-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-pink-200 mb-3">السور والتلاوات المفضلة</h3>
              <p className="text-slate-400 text-lg">ضع علامة قلب على المحتوى المفضل لديك</p>
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-500/30 p-16 text-center shadow-2xl">
              <Clock className="w-24 h-24 text-amber-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-amber-200 mb-3">استماعاتك الأخيرة</h3>
              <p className="text-slate-400 text-lg">سجل الاستماع والقراءة سيظهر هنا</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}