import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, Clock, BookOpen, Heart, Sparkles, Moon, Sun, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const NOTIFICATIONS = [
  {
    id: 1,
    icon: Sun,
    title: '☀️ أذكار الصباح',
    body: 'ابدأ يومك بذكر الله، افتح التطبيق واقرأ أذكار الصباح الآن، فبها تحفظ وتكفى 🌸',
    time: '6:00 AM',
    type: 'adhkar',
    category: 'أذكار'
  },
  {
    id: 2,
    icon: Moon,
    title: '🌙 أذكار المساء',
    body: 'قبل أن تنام… دقائق مع أذكار المساء تمحو همّ اليوم وتجمع لك الأجر 🤍',
    time: '6:00 PM',
    type: 'adhkar',
    category: 'أذكار'
  },
  {
    id: 3,
    icon: BookOpen,
    title: '📖 آية اليوم',
    body: 'آية واحدة تستطيع أن تغيّر يومك، افتح التطبيق واقرأ آية اليوم بتدبر.',
    time: '9:00 AM',
    type: 'quran',
    category: 'قرآن'
  },
  {
    id: 4,
    icon: BookOpen,
    title: '🎯 تذكير بخطتك في ختم القرآن',
    body: 'لا تنسَ وردك من القرآن اليوم، استمر ولو صفحة واحدة… المهم أن لا ينقطع حبلك مع كتاب الله.',
    time: '8:00 PM',
    type: 'quran',
    category: 'قرآن'
  },
  {
    id: 5,
    icon: Sparkles,
    title: '🌿 جمعة مباركة',
    body: 'أكثر من الصلاة على النبي ﷺ وقراءة سورة الكهف، وادعُ لمن تحب… جمعة طيبة عليك 🤍',
    time: 'الجمعة 7:00 AM',
    type: 'friday',
    category: 'الجمعة'
  },
  {
    id: 6,
    icon: BookOpen,
    title: '🕌 تذكير بسورة الكهف',
    body: 'لا تنسَ قراءة سورة الكهف اليوم، فهي نورٌ ما بين الجمعتين.',
    time: 'الجمعة 9:00 AM',
    type: 'friday',
    category: 'الجمعة'
  },
  {
    id: 7,
    icon: Heart,
    title: '🤍 قل يا رب',
    body: 'لو ضاق صدرك… ارفع يديك وقل: يا رب. افتح التطبيق واختر دعاء يطمئن قلبك.',
    time: '12:00 PM',
    type: 'dua',
    category: 'دعاء'
  },
  {
    id: 8,
    icon: Heart,
    title: '🌧️ دعاء الكرب والهم',
    body: 'ما أصابك لم يكن ليخطئك… تعال نردد معًا أدعية تفريج الكرب من داخل التطبيق.',
    time: '3:00 PM',
    type: 'dua',
    category: 'دعاء'
  },
  {
    id: 9,
    icon: Sparkles,
    title: '🌟 سنة مهجورة',
    body: 'تعرّف اليوم على سنة نبوية قد لا يعرفها الكثير، واعمل بها لتُحبَّ إلى الله أكثر.',
    time: '10:00 AM',
    type: 'sunnah',
    category: 'سنة'
  },
  {
    id: 10,
    icon: Heart,
    title: '❤️ دقيقة استغفار',
    body: 'استغفر الله العظيم وأتوب إليه… كررها 100 مرة، وانظر لراحة قلبك بعدها.',
    time: '5:00 PM',
    type: 'istighfar',
    category: 'استغفار'
  },
  {
    id: 11,
    icon: Share2,
    title: 'شارك الأجر مع غيرك',
    body: 'أرسل التطبيق لصديق أو قريب، فالدال على الخير كفاعله. اضغط وشارك الرابط الآن 🌱',
    time: 'يومياً',
    type: 'sharing',
    category: 'مشاركة'
  },
  {
    id: 12,
    icon: Bell,
    title: 'ما رأيك في التطبيق؟',
    body: 'ساعدنا نحسّن تطبيقك الإسلامي برسالة بسيطة برأيك واقتراحاتك، رأيك يهمنا جدًا.',
    time: 'أسبوعياً',
    type: 'feedback',
    category: 'تقييم'
  },
  {
    id: 13,
    icon: Clock,
    title: '⏰ تذكير لطيف',
    body: 'بين مشاغل الحياة لا تنسَ قلبك… افتح التطبيق وخُذ دقيقة ذكرٍ وقراءةٍ وراحة.',
    time: '2:00 PM',
    type: 'reminder',
    category: 'تذكير'
  },
  {
    id: 14,
    icon: Sparkles,
    title: '🌺 لحظات مع الله',
    body: 'اجعل لك لحظات ثابتة كل يوم مع القرآن والذكر والدعاء، ونحن هنا لنذكّرك بها.',
    time: 'يومياً',
    type: 'reminder',
    category: 'تذكير'
  }
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');

  const filteredNotifications = filter === 'all' 
    ? NOTIFICATIONS 
    : NOTIFICATIONS.filter(n => n.type === filter);

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'adhkar', label: 'أذكار' },
    { id: 'quran', label: 'قرآن' },
    { id: 'friday', label: 'الجمعة' },
    { id: 'dua', label: 'دعاء' },
    { id: 'sunnah', label: 'سنة' }
  ];

  const handleShare = (notification) => {
    const text = `${notification.title}\n\n${notification.body}`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('تم النسخ! 📋');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <BellRing className="w-16 h-16 text-amber-300" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">الإشعارات والتذكيرات</h1>
            <p className="text-xl text-emerald-100">تذكيرات يومية لتبقى على صلة دائمة مع الله</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap justify-center">
          {categories.map(cat => (
            <Button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              variant={filter === cat.id ? 'default' : 'outline'}
              className={filter === cat.id 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'hover:bg-emerald-50'}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Notifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotifications.map(notification => {
            const Icon = notification.icon;
            return (
              <Card key={notification.id} className="bg-white hover:shadow-xl transition-all border-2 border-emerald-100 hover:border-emerald-300">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{notification.title}</h3>
                        <Badge className="bg-emerald-100 text-emerald-700">
                          {notification.category}
                        </Badge>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-3">
                        {notification.body}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{notification.time}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleShare(notification)}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}