import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Mic, Sparkles, Loader2, ExternalLink, ImagePlus, Link as LinkIcon } from 'lucide-react';
import IslamicBackground from '@/components/layout/IslamicBackground';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import ShareButton from '@/components/share/ShareButton';
import { motion } from 'framer-motion';

export default function RecitersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  // جلب المقرئين من قاعدة البيانات
  const { data: reciters = [], isLoading } = useQuery({
    queryKey: ['reciters'],
    queryFn: () => base44.entities.Reciter.list('-popularity_score'),
  });

  // جلب المراجع لكل المقرئين
  const { data: references = [] } = useQuery({
    queryKey: ['reciter-references'],
    queryFn: () => base44.entities.Reference.filter({ entity_type: 'Reciter' }),
  });

  // صلاحيات بسيطة: إظهار الرفع للمشرف فقط
  useEffect(() => {
    (async () => {
      try {
        if (await base44.auth.isAuthenticated()) {
          const me = await base44.auth.me();
          setIsAdmin(me?.role === 'admin');
        }
      } catch {}
    })();
  }, []);

  const refsBySlug = references.reduce((acc, ref) => {
    const slug = ref.entity_slug;
    if (!slug) return acc;
    acc[slug] = acc[slug] || [];
    acc[slug].push(ref);
    return acc;
  }, {});

  const handleImageUpload = async (reciter, file) => {
    if (!file) return;
    setUploadingId(reciter.id);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.Reciter.update(reciter.id, { image_url: file_url });
      await base44.entities.Reference.create({
        entity_type: 'Reciter',
        entity_slug: reciter.slug,
        category: 'photo',
        title: 'App upload',
        url: file_url,
        provider: 'app_storage',
        license: 'uploaded-by-admin'
      });
    } finally {
      setUploadingId(null);
    }
  };

  const filteredReciters = reciters.filter(reciter => {
    const matchesSearch = reciter.name_arabic?.includes(searchQuery) || 
                          reciter.bio?.includes(searchQuery) ||
                          reciter.name_english?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === 'modern') {
      matchesFilter = reciter.is_active === true;
    } else if (activeFilter === 'classic') {
      matchesFilter = reciter.is_active === false;
    } else if (activeFilter === 'famous') {
      matchesFilter = reciter.is_featured === true;
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
    <IslamicBackground variant="emerald">
      {/* الرأس */}
      <div className="relative text-white pt-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-5 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-3xl backdrop-blur-sm border border-amber-400/20">
                <Mic className="w-14 h-14 text-amber-300" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-100">مكتبة المقرئين</h1>
            <p className="text-xl text-indigo-200 font-arabic">﴿ الَّذِينَ آتَيْنَاهُمُ الْكِتَابَ يَتْلُونَهُ حَقَّ تِلَاوَتِهِ ﴾</p>
            <p className="text-slate-300 mt-2">استكشف أشهر قراء القرآن الكريم</p>
          </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* قسم الشيخ الشعراوي */}
        <Card className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-400/30 shadow-2xl mb-12 backdrop-blur-xl">
          <div className="p-8 flex items-center gap-6 flex-col md:flex-row">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center flex-shrink-0 border-4 border-amber-500/50">
              <Sparkles className="w-14 h-14 text-white" />
            </div>
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-3xl font-bold text-amber-200 mb-3">
                الشيخ محمد متولي الشعراوي
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                إمام وداعية إسلامي مصري، اشتهر بتفسيره البسيط للقرآن الكريم. 
                عُرف بـ"إمام الدعاة" وترك إرثاً كبيراً من التفسيرات والدروس الدينية.
              </p>
            </div>
          </div>
          </Card>

        {/* مربع البحث */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مقرئ..."
            className="pr-12 h-14 text-lg bg-slate-900/60 border border-amber-500/30 text-white placeholder:text-slate-400 focus:border-amber-400"
          />
        </div>

        {/* أزرار الفلترة */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'modern', label: 'المعاصرون' },
            { id: 'classic', label: 'الكلاسيكيون' },
            { id: 'famous', label: 'الأشهر' }
          ].map(filter => (
            <Button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              variant="outline"
              className={`rounded-full px-6 py-3 transition-all ${
                activeFilter === filter.id
                  ? 'bg-amber-500 text-slate-900 border-amber-500 hover:bg-amber-400'
                  : 'bg-slate-900/60 text-amber-200 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
          </div>
        )}

        {/* شبكة المقرئين */}
        {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReciters.map(reciter => {
            return (
              <motion.div
                key={reciter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
              <Card 
                className="bg-slate-900/60 backdrop-blur-xl border-amber-500/20 hover:border-amber-400/40 transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="h-56 bg-gradient-to-br from-amber-900/40 to-emerald-900/30 relative overflow-hidden group">
                  {reciter.image_url ? (
                    <>
                      <img 
                        src={reciter.image_url} 
                        alt={reciter.name_arabic} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-70" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Mic className="w-16 h-16 text-amber-400/40" />
                    </div>
                  )}
                  {reciter.social_media?.youtube && (
                    <a 
                      href={reciter.social_media.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute bottom-3 left-3 bg-red-600/90 hover:bg-red-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span className="text-sm font-bold">يوتيوب</span>
                    </a>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-200 mb-2">
                    {reciter.name_arabic}
                  </h3>
                  <p className="text-slate-500 text-sm mb-2">{reciter.country}</p>
                  <p className="text-slate-400 leading-relaxed mb-4 text-sm line-clamp-3">
                    {reciter.bio}
                  </p>
                  <div className="space-y-4 pt-4 border-t border-slate-700">
                    {/* مصادر ومراجع */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-400">
                        {reciter.slug && refsBySlug[reciter.slug]?.length ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 px-3 text-amber-300 border-amber-500/40 bg-slate-900/40">
                                <LinkIcon className="w-3.5 h-3.5 ml-2" /> مراجع
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64">
                              {refsBySlug[reciter.slug].map((r) => (
                                <DropdownMenuItem key={r.id} asChild>
                                  <a href={r.url} target="_blank" rel="noreferrer" className="flex items-center justify-between">
                                    <span className="truncate">{r.title || r.provider || r.url}</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-slate-500">لا مراجع بعد</span>
                        )}
                      </div>

                      {isAdmin && (
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-amber-200">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(reciter, e.target.files?.[0])}
                          />
                          <Button size="sm" variant="outline" disabled={uploadingId===reciter.id} className="h-8 px-3 bg-slate-900/40 border-amber-500/40">
                            {uploadingId===reciter.id ? (
                              <Loader2 className="w-3.5 h-3.5 ml-2 animate-spin" />
                            ) : (
                              <ImagePlus className="w-3.5 h-3.5 ml-2" />
                            )}
                            تحديث الصورة
                          </Button>
                        </label>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm">{reciter.birth_year || ''}</span>
                      <div className="flex gap-2">
                        {reciter.recitation_style && (
                          <Badge variant="outline" className="border-amber-500/50 text-amber-300">
                            {reciter.recitation_style}
                          </Badge>
                        )}
                        {reciter.is_featured && (
                          <Badge className="bg-amber-500 text-slate-900 hover:bg-amber-400">
                            مميز
                          </Badge>
                        )}
                      </div>
                    </div>

                    <ShareButton
                      entityType="Reciter"
                      entityId={reciter.id}
                      title={reciter.name_arabic}
                      imageUrl={reciter.image_url}
                      variant="outline"
                      size="sm"
                    />
                  </div>
                </div>
              </Card>
              </motion.div>
            );
          })}
        </div>
        )}

        {!isLoading && filteredReciters.length === 0 && (
          <div className="text-center py-16">
            <Mic className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-xl">لم يتم العثور على نتائج</p>
          </div>
        )}
      </div>
    </IslamicBackground>
  );
}