import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Video,
  Mail,
  Heart,
  Share2,
  MessageSquare,
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';

const PLATFORM_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  whatsapp: MessageCircle,
  tiktok: Video,
  telegram: Mail,
};

const PLATFORM_COLORS = {
  instagram: 'bg-pink-500',
  facebook: 'bg-blue-600',
  twitter: 'bg-blue-400',
  whatsapp: 'bg-green-500',
  tiktok: 'bg-black',
  telegram: 'bg-blue-500',
};

export default function ShareLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const { data: shares = [], isLoading } = useQuery({
    queryKey: ['shares'],
    queryFn: async () => {
      const allShares = await base44.entities.Share.list();
      return allShares || [];
    },
  });

  const filteredShares = shares
    .filter((share) => {
      const matchesSearch =
        share.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        share.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        share.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesPlatform =
        filterPlatform === 'all' ||
        share.platforms?.includes(filterPlatform);

      return matchesSearch && matchesPlatform;
    })
    .sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.created_date) - new Date(a.created_date);
      if (sortBy === 'trending')
        return (b.like_count || 0) + (b.share_count || 0) -
               ((a.like_count || 0) + (a.share_count || 0));
      if (sortBy === 'popular') return (b.share_count || 0) - (a.share_count || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">📚 مكتبة المشاركات</h1>
          <p className="text-slate-400 text-lg">
            اكتشف أفضل المحتوى الإسلامي المشارك على جميع المنصات
          </p>
        </motion.div>

        {/* البحث والفلاترات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8"
        >
          <div className="space-y-4">
            {/* شريط البحث */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مشاركات..."
                className="bg-slate-900 border-slate-600 text-white pl-10 pr-4"
              />
            </div>

            {/* الفلاترات */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* اختيار المنصة */}
              <div>
                <label className="text-white font-bold text-sm mb-2 block">
                  المنصة
                </label>
                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-2 text-right"
                >
                  <option value="all">جميع المنصات</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="tiktok">TikTok</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                </select>
              </div>

              {/* الترتيب */}
              <div>
                <label className="text-white font-bold text-sm mb-2 block">
                  الترتيب
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-2 text-right"
                >
                  <option value="latest">الأحدث</option>
                  <option value="trending">التريندينج</option>
                  <option value="popular">الأكثر مشاركة</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* حالة التحميل */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
              <p className="text-slate-400">جاري تحميل المشاركات...</p>
            </div>
          </div>
        )}

        {/* قائمة المشاركات */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShares.length > 0 ? (
              filteredShares.map((share, index) => {
                const isNew = new Date(share.created_date) > new Date(Date.now() - 24 * 60 * 60 * 1000);

                return (
                  <motion.div
                    key={share.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-slate-800/80 border-slate-700 overflow-hidden hover:border-emerald-500/50 transition-all group">
                      {/* الصورة */}
                      {share.image_url && (
                        <div className="relative aspect-video bg-slate-900 overflow-hidden">
                          <img
                            src={share.image_url}
                            alt={share.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {isNew && (
                            <Badge className="absolute top-2 right-2 bg-emerald-600">
                              جديد
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* المحتوى */}
                      <div className="p-4 space-y-3">
                        {/* العنوان */}
                        <h3 className="text-white font-bold text-lg line-clamp-2">
                          {share.title}
                        </h3>

                        {/* النص */}
                        <p className="text-slate-300 text-sm line-clamp-3">
                          {share.content}
                        </p>

                        {/* الوسوم */}
                        {share.tags && share.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {share.tags.slice(0, 3).map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="border-slate-600 text-slate-300 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* المنصات */}
                        <div className="flex gap-2 flex-wrap">
                          {share.platforms &&
                            share.platforms.slice(0, 4).map((platform) => {
                              const Icon = PLATFORM_ICONS[platform];
                              return (
                                <div
                                  key={platform}
                                  className={`${PLATFORM_COLORS[platform]} w-8 h-8 rounded-full flex items-center justify-center`}
                                >
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                              );
                            })}
                        </div>

                        {/* الإحصائيات */}
                        <div className="border-t border-slate-700 pt-3 flex gap-4 text-xs text-slate-400">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {share.like_count || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            {share.share_count || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {share.comment_count || 0}
                          </div>
                        </div>

                        {/* زر التفاعل */}
                        <Button
                          variant="outline"
                          className="w-full border-slate-600 text-slate-300 hover:border-emerald-600 hover:text-emerald-400"
                        >
                          <Share2 className="w-4 h-4 ml-2" />
                          مشاركة
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400 text-lg">لا توجد مشاركات تطابق البحث</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}