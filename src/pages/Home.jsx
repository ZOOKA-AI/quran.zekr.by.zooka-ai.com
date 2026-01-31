import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Volume2, Clock, BookMarked, MessageSquare, Bell, Sparkles, Mic, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: 'قراءة القرآن الكريم',
      description: 'اقرأ القرآن الكريم كاملاً مع التفاسير المتعددة',
      link: 'Quran',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Volume2,
      title: 'الاستماع للتلاوات',
      description: 'استمع لأشهر القراء بصوت عالي الجودة',
      link: 'Tilawa',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Mic,
      title: 'المقرئون',
      description: 'اختر من بين أفضل القراء في العالم الإسلامي',
      link: 'Reciters',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: Clock,
      title: 'مواقيت الصلاة',
      description: 'تعرف على مواقيت الصلاة الدقيقة لموقعك',
      link: 'PrayerTimes',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      icon: BookMarked,
      title: 'المحفوظات',
      description: 'احفظ الآيات المفضلة وأضف ملاحظاتك الخاصة',
      link: 'Bookmarks',
      gradient: 'from-rose-500 to-red-600'
    },
    {
      icon: MessageSquare,
      title: 'المساعد الذكي',
      description: 'اسأل عن تفسير الآيات والمعاني',
      link: 'Assistant',
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      icon: Sparkles,
      title: 'الخطوط الإسلامية',
      description: 'استمتع بجمال الخط الإسلامي',
      link: 'Calligraphy',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: Bell,
      title: 'التذكيرات اليومية',
      description: 'احصل على آية اليوم والتذكيرات',
      link: 'Notifications',
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <h1 className="text-5xl md:text-6xl font-bold text-emerald-900 mb-4 font-arabic">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          تطبيق القرآن الكريم
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          تطبيق شامل للقرآن الكريم مع التلاوات والتفاسير ومواقيت الصلاة
        </p>
        <p className="text-lg text-emerald-700 font-semibold">
          🕌 صدقة جارية - مجاني بالكامل لوجه الله تعالى
        </p>
      </div>

      {/* Quick Start Card */}
      <Card className="mb-12 p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">ابدأ القراءة الآن</h3>
            <p className="text-gray-700">
              ابدأ رحلتك مع القرآن الكريم - قراءة، استماع، وتدبر
            </p>
          </div>
          <Link to={createPageUrl('Quran')}>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg">
              <BookOpen className="ml-2 h-6 w-6" />
              افتح المصحف
            </Button>
          </Link>
        </div>
      </Card>

      {/* Features Grid */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          مميزات التطبيق
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={createPageUrl(feature.link)}>
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center text-emerald-600 group-hover:text-emerald-700 font-semibold">
                      <span className="text-sm">انتقل</span>
                      <ArrowLeft className="h-4 w-4 mr-1 group-hover:mr-2 transition-all" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Daily Verse Section */}
      <Card className="mb-12 p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">آية اليوم</h3>
          <div className="bg-white/70 rounded-lg p-6 mb-4">
            <p className="text-3xl font-arabic text-gray-800 leading-loose mb-4">
              فَإِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرًا
            </p>
            <p className="text-lg text-gray-600 mb-2">
              "فإن مع العسر يسرا"
            </p>
            <p className="text-sm text-gray-500">
              سورة الشرح - آية 6
            </p>
          </div>
          <p className="text-gray-700 italic">
            "For indeed, with hardship comes ease"
          </p>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-900 mb-4">
            شارك الأجر
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            هذا التطبيق صدقة جارية مجانية بالكامل. شاركه مع من تحب لتنال الأجر والثواب
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="border-purple-300 hover:bg-purple-100"
              onClick={() => {
                const shareText = '🕌 تطبيق القرآن الكريم - مجاني بالكامل لوجه الله تعالى\n\nصدقة جارية - شارك الأجر معنا 🤲\n\n' + window.location.origin;
                if (navigator.share) {
                  navigator.share({ title: 'تطبيق القرآن الكريم', text: shareText });
                } else {
                  navigator.clipboard.writeText(shareText);
                  toast.success('تم نسخ الرابط! شاركه مع من تحب لتنال الأجر 🌟');
                }
              }}
            >
              شارك التطبيق
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-6">
            "مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ" - النبي محمد ﷺ
          </p>
        </div>
      </Card>
    </div>
  );
}