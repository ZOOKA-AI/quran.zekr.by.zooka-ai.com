import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  MessageSquare, 
  Clock, 
  BookMarked, 
  Sparkles, 
  Mic, 
  Volume2,
  Bell,
  Heart,
  Moon,
  Sun
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'قراءة القرآن',
      description: 'تصفح وقراءة القرآن الكريم كاملاً مع التفسير والترجمة',
      icon: BookOpen,
      path: 'Quran',
      color: 'from-emerald-500 to-emerald-600',
      highlight: true
    },
    {
      title: 'التلاوة المرتلة',
      description: 'استمع لتلاوات مميزة لمشاهير القراء',
      icon: Volume2,
      path: 'Tilawa',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'المساعد الذكي',
      description: 'اسأل عن أي شيء يتعلق بالقرآن والسنة',
      icon: MessageSquare,
      path: 'Assistant',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'مواقيت الصلاة',
      description: 'تعرف على مواقيت الصلاة في منطقتك',
      icon: Clock,
      path: 'PrayerTimes',
      color: 'from-amber-500 to-amber-600'
    },
    {
      title: 'المحفوظات',
      description: 'احفظ آياتك المفضلة وارجع إليها متى شئت',
      icon: BookMarked,
      path: 'Bookmarks',
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'الخطوط والزخرفة',
      description: 'اكتشف جمال الخط العربي القرآني',
      icon: Sparkles,
      path: 'Calligraphy',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'القراء المشهورون',
      description: 'تعرف على أشهر القراء وتلاواتهم',
      icon: Mic,
      path: 'Reciters',
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'التذكيرات اليومية',
      description: 'احصل على تذكيرات يومية لتلاوة القرآن',
      icon: Bell,
      path: 'Notifications',
      color: 'from-rose-500 to-rose-600'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 opacity-70" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full mb-6 shadow-xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-emerald-800 mb-4">
              القرآن الكريم
            </h1>
            <p className="text-2xl text-emerald-600 mb-6 font-arabic leading-loose">
              ﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              تطبيق إسلامي متكامل لقراءة القرآن الكريم والاستماع إلى التلاوات والتفاعل مع المساعد الذكي
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-emerald-700">114</div>
                <div className="text-sm text-gray-600 mt-1">سورة</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-emerald-700">6236</div>
                <div className="text-sm text-gray-600 mt-1">آية</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-emerald-700">30</div>
                <div className="text-sm text-gray-600 mt-1">جزء</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardContent className="pt-6 text-center">
                <Heart className="w-8 h-8 text-rose-500 mx-auto mb-2" fill="currentColor" />
                <div className="text-sm text-gray-600">صدقة جارية</div>
              </CardContent>
            </Card>
          </div>

          {/* Main CTA */}
          <Link to={createPageUrl('Quran')}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <BookOpen className="ml-2 w-6 h-6" />
              ابدأ القراءة الآن
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          اكتشف ميزات التطبيق
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={createPageUrl(feature.path)}>
                <Card 
                  className={`
                    h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2
                    ${feature.highlight ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-white' : 'border-gray-200 hover:border-emerald-200'}
                  `}
                >
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Daily Wisdom Section */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex gap-4">
              <Sun className="w-8 h-8 text-amber-300 animate-pulse" />
              <Moon className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-6">فضل تلاوة القرآن</h3>
          <p className="text-xl font-arabic leading-loose mb-4">
            قال رسول الله ﷺ: "اقرأوا القرآن فإنه يأتي يوم القيامة شفيعاً لأصحابه"
          </p>
          <p className="text-emerald-200">رواه مسلم</p>
          
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-emerald-700/30 rounded-xl p-6 backdrop-blur-sm">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-emerald-200" />
              <h4 className="font-bold mb-2">اقرأ بتدبر</h4>
              <p className="text-sm text-emerald-100">تأمل في معاني الآيات</p>
            </div>
            <div className="bg-emerald-700/30 rounded-xl p-6 backdrop-blur-sm">
              <Heart className="w-8 h-8 mx-auto mb-3 text-rose-300" fill="currentColor" />
              <h4 className="font-bold mb-2">اعمل بما تقرأ</h4>
              <p className="text-sm text-emerald-100">القرآن منهج حياة</p>
            </div>
            <div className="bg-emerald-700/30 rounded-xl p-6 backdrop-blur-sm">
              <Bell className="w-8 h-8 mx-auto mb-3 text-amber-300" />
              <h4 className="font-bold mb-2">داوم على الورد</h4>
              <p className="text-sm text-emerald-100">اجعل القرآن رفيقك اليومي</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-cyan-50 to-emerald-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            ابدأ رحلتك القرآنية اليوم
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            انضم لملايين المسلمين حول العالم في تلاوة كتاب الله
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={createPageUrl('Quran')}>
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              >
                <BookOpen className="ml-2 w-5 h-5" />
                تصفح القرآن
              </Button>
            </Link>
            <Link to={createPageUrl('Assistant')}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8"
              >
                <MessageSquare className="ml-2 w-5 h-5" />
                المساعد الذكي
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}