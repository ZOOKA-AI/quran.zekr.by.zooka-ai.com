import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Mic, BookOpen, Star, Users, Sparkles, Loader2 } from 'lucide-react';
import IslamicBackground from '@/components/layout/IslamicBackground';

export default function RecitersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // جلب المقرئين من قاعدة البيانات
  const { data: reciters = [], isLoading } = useQuery({
    queryKey: ['reciters'],
    queryFn: () => base44.entities.Reciter.list('-popularity_score'),
  });

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
              <Card 
                key={reciter.id}
                className="bg-slate-900/60 backdrop-blur-xl border-amber-500/20 hover:border-amber-400/40 transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="h-40 bg-gradient-to-br from-amber-600/30 to-emerald-600/20 flex items-center justify-center overflow-hidden">
                  {reciter.image_url ? (
                    <img src={reciter.image_url} alt={reciter.name_arabic} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <Mic className="w-14 h-14 text-amber-400" />
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
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
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
                </div>
              </Card>
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