import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Mic, BookOpen, Star, Users, Sparkles } from 'lucide-react';
import IslamicBackground from '@/components/layout/IslamicBackground';

const RECITERS = [
  {
    id: 1,
    name: "الشيخ محمد رفعت",
    description: "أول من قرأ القرآن بالإذاعة المصرية، يلقب بقيثارة السماء، وصوته من أندر الأصوات في تلاوة القرآن.",
    era: "classic",
    famous: true,
    birthYear: 1882,
    icon: Mic
  },
  {
    id: 2,
    name: "الشيخ عبد الباسط عبد الصمد",
    description: "أشهر قراء القرآن في العالم الإسلامي، تميز بصوته العذب وأسلوبه الفريد في التلاوة.",
    era: "classic",
    famous: true,
    birthYear: 1927,
    icon: BookOpen
  },
  {
    id: 3,
    name: "الشيخ مصطفى إسماعيل",
    description: "من أعلام القراء في مصر والعالم الإسلامي، تميز بأدائه القوي ونبرات صوته المميزة.",
    era: "classic",
    famous: true,
    birthYear: 1905,
    icon: BookOpen
  },
  {
    id: 4,
    name: "الشيخ محمود خليل الحصري",
    description: "من أشهر قراء القرآن، وكان أول من سجل القرآن بصوته مرتلاً، وأول من نادى بإنشاء نقابة للقراء.",
    era: "classic",
    famous: true,
    birthYear: 1917,
    icon: Mic
  },
  {
    id: 5,
    name: "الشيخ محمد صديق المنشاوي",
    description: "من القراء البارزين، تميز بصوته الشجي وأدائه العاطفي في التلاوة.",
    era: "classic",
    famous: true,
    birthYear: 1920,
    icon: BookOpen
  },
  {
    id: 6,
    name: "الشيخ كامل يوسف البهتيمي",
    description: "من القراء المتميزين بصوته العميق وأدائه المؤثر، تتلمذ على يد الشيخ محمد رفعت.",
    era: "classic",
    famous: false,
    birthYear: 1922,
    icon: Users
  },
  {
    id: 7,
    name: "الشيخ أحمد الرزيقي",
    description: "من القراء المعاصرين البارزين، يتميز بأدائه العذب وصوته الجميل في التلاوة.",
    era: "modern",
    famous: true,
    birthYear: 1968,
    icon: Star
  },
  {
    id: 8,
    name: "الشيخ محمد جبريل",
    description: "من أشهر القراء المعاصرين، يتميز بأدائه القوي وصوته الجهوري في التلاوة.",
    era: "modern",
    famous: true,
    birthYear: 1964,
    icon: Star
  },
  {
    id: 9,
    name: "الشيخ محمود علي البنا",
    description: "من القراء المتميزين، عُين قارئاً لمسجد عمر مكرم ثم قارئاً لمسجد السيدة زينب.",
    era: "classic",
    famous: true,
    birthYear: 1926,
    icon: BookOpen
  },
  {
    id: 10,
    name: "الشيخ ناصر القطامي",
    description: "قارئ سعودي من أصل مصري، يتميز بأدائه العذب وتلاوته المؤثرة.",
    era: "modern",
    famous: false,
    birthYear: 1975,
    icon: Users
  },
  {
    id: 11,
    name: "الشيخ عبد الرحمن بن عوف",
    description: "من القراء المعاصرين المتميزين، يشتهر بأدائه الهادئ والعذب في التلاوة.",
    era: "modern",
    famous: false,
    birthYear: 1970,
    icon: Users
  },
  {
    id: 12,
    name: "الشيخ طه الفشني",
    description: "من القراء البارزين، تميز بصوته الشجي وأدائه المميز في التلاوة.",
    era: "classic",
    famous: false,
    birthYear: 1900,
    icon: BookOpen
  },
  {
    id: 13,
    name: "الشيخ عبد المجيد السريجي",
    description: "من القراء المتميزين بصوته العذب وأدائه الروحاني، تميز بتلاوته الخاشعة وأسلوبه المؤثر في قراءة القرآن.",
    era: "classic",
    famous: true,
    birthYear: 1929,
    icon: Star
  }
];

export default function RecitersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredReciters = RECITERS.filter(reciter => {
    const matchesSearch = reciter.name.includes(searchQuery) || 
                          reciter.description.includes(searchQuery);
    
    let matchesFilter = true;
    if (activeFilter === 'modern') {
      matchesFilter = reciter.era === 'modern';
    } else if (activeFilter === 'classic') {
      matchesFilter = reciter.era === 'classic';
    } else if (activeFilter === 'famous') {
      matchesFilter = reciter.famous === true;
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

        {/* شبكة المقرئين */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReciters.map(reciter => {
            const Icon = reciter.icon;
            return (
              <Card 
                key={reciter.id}
                className="bg-slate-900/60 backdrop-blur-xl border-amber-500/20 hover:border-amber-400/40 transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="h-40 bg-gradient-to-br from-amber-600/30 to-emerald-600/20 flex items-center justify-center">
                  <Icon className="w-14 h-14 text-amber-400" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-200 mb-3">
                    {reciter.name}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-4 text-sm">
                    {reciter.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <span className="text-slate-500 text-sm">{reciter.birthYear}</span>
                    {reciter.famous && (
                      <Badge className="bg-amber-500 text-slate-900 hover:bg-amber-400">
                        مشهور
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredReciters.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-xl">لم يتم العثور على نتائج</p>
          </div>
        )}
      </div>
    </IslamicBackground>
  );
}