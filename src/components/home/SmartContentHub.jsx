import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Video, Music, Mic, Moon, Download, Wifi, WifiOff, 
  Play, Heart, Share2, BookOpen, Radio, Sparkles,
  MessageCircle, Star, TrendingUp, Clock
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function SmartContentHub() {
  const [activeTab, setActiveTab] = useState('videos');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // مراقبة حالة الإنترنت
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // جلب المحتوى
  const { data: videos = [] } = useQuery({
    queryKey: ['featured-videos'],
    queryFn: async () => {
      return await base44.entities.Video.filter({ is_featured: true });
    },
    enabled: isOnline
  });

  const { data: ibtihaalat = [] } = useQuery({
    queryKey: ['featured-ibtihaalat'],
    queryFn: async () => {
      return await base44.entities.Ibtihaal.filter({}, '-plays_count', 6);
    },
    enabled: isOnline
  });

  const { data: tawasheeh = [] } = useQuery({
    queryKey: ['featured-tawasheeh'],
    queryFn: async () => {
      return await base44.entities.Tawasheeh.filter({}, '-plays_count', 6);
    },
    enabled: isOnline
  });

  const { data: athkar = [] } = useQuery({
    queryKey: ['morning-athkar'],
    queryFn: async () => {
      return await base44.entities.Athkar.filter({ category: 'أذكار الصباح' });
    },
    enabled: isOnline
  });

  const handleDownloadForOffline = async (item, type) => {
    toast.info('سيتم إضافة التحميل للاستماع بدون نت قريباً');
  };

  return (
    <div className="space-y-6">
      {/* حالة الاتصال */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50"
      >
        <div className="flex items-center gap-3">
          {isOnline ? (
            <>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <Wifi className="w-5 h-5 text-green-400" />
              <span className="text-white font-bold">متصل • التحديث التلقائي مفعل</span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <WifiOff className="w-5 h-5 text-amber-400" />
              <span className="text-white font-bold">بدون نت • المحتوى المحمل متاح</span>
            </>
          )}
        </div>
        <Button 
          size="sm" 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => window.location.reload()}
        >
          <Download className="w-4 h-4 ml-2" />
          تحديث
        </Button>
      </motion.div>

      {/* المحتوى التفاعلي */}
      <Card className="bg-slate-900/60 backdrop-blur-2xl border-slate-700/50 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 bg-slate-800/80 border-b border-slate-700">
            <TabsTrigger value="videos" className="data-[state=active]:bg-red-600">
              <Video className="w-4 h-4 ml-2" />
              فيديوهات
            </TabsTrigger>
            <TabsTrigger value="ibtihaalat" className="data-[state=active]:bg-purple-600">
              <Mic className="w-4 h-4 ml-2" />
              ابتهالات
            </TabsTrigger>
            <TabsTrigger value="tawasheeh" className="data-[state=active]:bg-amber-600">
              <Music className="w-4 h-4 ml-2" />
              تواشيح
            </TabsTrigger>
            <TabsTrigger value="ramadan" className="data-[state=active]:bg-indigo-600">
              <Moon className="w-4 h-4 ml-2" />
              رمضان
            </TabsTrigger>
          </TabsList>

          {/* الفيديوهات */}
          <TabsContent value="videos" className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  فيديوهات قرآنية مميزة
                </h3>
                <Link to={createPageUrl('Channels')}>
                  <Button size="sm" variant="outline" className="text-white border-slate-600">
                    المزيد
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.slice(0, 4).map((video, idx) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative"
                  >
                    <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden relative">
                      {video.thumbnail_url && (
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button size="icon" className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700">
                          <Play className="w-8 h-8" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-bold line-clamp-2">{video.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-300">{video.views_count || 0} مشاهدة</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {videos.length === 0 && isOnline && (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">لا توجد فيديوهات متاحة حالياً</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* الابتهالات */}
          <TabsContent value="ibtihaalat" className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  استماع حي للابتهالات
                </h3>
                <Link to={createPageUrl('Ibtihaalat')}>
                  <Button size="sm" variant="outline" className="text-white border-slate-600">
                    المزيد
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                {ibtihaalat.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-slate-800/50 hover:bg-slate-700/50 rounded-xl p-4 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <Button 
                        size="icon" 
                        className="bg-purple-600 hover:bg-purple-700 rounded-full flex-shrink-0"
                      >
                        <Play className="w-5 h-5" />
                      </Button>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold truncate">{item.title}</p>
                        <p className="text-slate-400 text-sm">{item.mubtahil_name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-amber-400 hover:text-amber-300"
                          onClick={() => handleDownloadForOffline(item, 'ibtihaal')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <span className="text-slate-500 text-xs">{item.plays_count || 0}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* التواشيح */}
          <TabsContent value="tawasheeh" className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-amber-500" />
                  تواشيح وأناشيد دينية
                </h3>
                <Link to={createPageUrl('Tawasheeh')}>
                  <Button size="sm" variant="outline" className="text-white border-slate-600">
                    المزيد
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tawasheeh.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-4 border border-amber-600/20 hover:border-amber-600/40 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt={item.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold truncate">{item.title}</p>
                        <p className="text-amber-300 text-sm">{item.artist}</p>
                        <p className="text-slate-500 text-xs">{item.duration_text}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          size="icon" 
                          className="bg-amber-600 hover:bg-amber-700 rounded-full"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-slate-400"
                          onClick={() => handleDownloadForOffline(item, 'tawasheeh')}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* رمضان */}
          <TabsContent value="ramadan" className="p-6">
            <div className="space-y-6">
              <div className="text-center py-8">
                <Moon className="w-20 h-20 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">محتوى رمضاني خاص</h3>
                <p className="text-slate-400 mb-6">برامج، أحاديث، ودروس رمضانية</p>
                <Link to={createPageUrl('Ramadan')}>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Star className="w-4 h-4 ml-2" />
                    استكشف المحتوى الرمضاني
                  </Button>
                </Link>
              </div>

              {/* أذكار سريعة */}
              {athkar.length > 0 && (
                <div className="bg-indigo-900/20 rounded-xl p-6 border border-indigo-600/20">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    أذكار الصباح
                  </h4>
                  <div className="space-y-3">
                    {athkar.slice(0, 3).map((dhikr, idx) => (
                      <motion.div
                        key={dhikr.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-800/30 rounded-lg p-4"
                      >
                        <p className="text-white font-arabic text-lg leading-loose mb-2">{dhikr.text}</p>
                        {dhikr.count > 1 && (
                          <span className="text-indigo-300 text-sm">• {dhikr.count} مرات</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* روابط سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to={createPageUrl('QuranRadio')}>
          <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 hover:from-cyan-800/60 hover:to-blue-800/60 border-cyan-600/30 p-4 text-center transition-all cursor-pointer">
            <Radio className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-white font-bold text-sm">إذاعة قرآن</p>
            <p className="text-cyan-300 text-xs">24/7 مباشر</p>
          </Card>
        </Link>

        <Link to={createPageUrl('Reciters')}>
          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 hover:from-purple-800/60 hover:to-pink-800/60 border-purple-600/30 p-4 text-center transition-all cursor-pointer">
            <Mic className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-white font-bold text-sm">القراء</p>
            <p className="text-purple-300 text-xs">أشهر المقرئين</p>
          </Card>
        </Link>

        <Link to={createPageUrl('Assistant')}>
          <Card className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 hover:from-indigo-800/60 hover:to-blue-800/60 border-indigo-600/30 p-4 text-center transition-all cursor-pointer">
            <MessageCircle className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <p className="text-white font-bold text-sm">المساعد الذكي</p>
            <p className="text-indigo-300 text-xs">بصوت عربي</p>
          </Card>
        </Link>

        <Link to={createPageUrl('Athkar')}>
          <Card className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 hover:from-emerald-800/60 hover:to-teal-800/60 border-emerald-600/30 p-4 text-center transition-all cursor-pointer">
            <Clock className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-white font-bold text-sm">الأذكار</p>
            <p className="text-emerald-300 text-xs">يومية ومنوعة</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}