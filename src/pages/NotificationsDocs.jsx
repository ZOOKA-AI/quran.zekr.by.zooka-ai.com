import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, FileJson, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const JSON_TEMPLATES = [
  {
    id: 1,
    name: 'تذكير بذكر الله',
    code: `{
  "notification": {
    "title": "🌙 تذكير بذكر الله",
    "body": "لا تنسَ وردك من الأذكار اليوم، دقائق قليلة تفتح لك بابًا عظيمًا من الأجر 🤍"
  },
  "data": {
    "screen": "adhkar",
    "type": "daily_reminder"
  }
}`
  },
  {
    id: 2,
    name: 'حديث اليوم',
    code: `{
  "notification": {
    "title": "📖 حديث اليوم",
    "body": "قال رسول الله ﷺ: «أحب الأعمال إلى الله أدومها وإن قل» – لا تحرم نفسك من عملٍ ثابت ولو قليل."
  },
  "data": {
    "screen": "hadith",
    "type": "hadith_of_day"
  }
}`
  },
  {
    id: 3,
    name: 'تحديث جديد',
    code: `{
  "notification": {
    "title": "✨ تحديث جديد في تطبيقك الإسلامي",
    "body": "أضفنا أذكارًا ودعوات جديدة، افتح التطبيق الآن واكتشفها 🌿"
  },
  "data": {
    "screen": "home",
    "type": "update"
  }
}`
  }
];

const NOTIFICATION_TEXTS = [
  {
    category: '🙏 أذكار الصباح والمساء',
    items: [
      {
        title: '☀️ أذكار الصباح',
        body: 'ابدأ يومك بذكر الله، افتح التطبيق واقرأ أذكار الصباح الآن، فبها تحفظ وتكفى 🌸'
      },
      {
        title: '🌙 أذكار المساء',
        body: 'قبل أن تنام… دقائق مع أذكار المساء تمحو همّ اليوم وتجمع لك الأجر 🤍'
      }
    ]
  },
  {
    category: '📖 القرآن والختمة',
    items: [
      {
        title: '📖 آية اليوم',
        body: 'آية واحدة تستطيع أن تغيّر يومك، افتح التطبيق واقرأ آية اليوم بتدبر.'
      },
      {
        title: '🎯 تذكير بخطتك في ختم القرآن',
        body: 'لا تنسَ وردك من القرآن اليوم، استمر ولو صفحة واحدة… المهم أن لا ينقطع حبلك مع كتاب الله.'
      }
    ]
  },
  {
    category: '🕋 الجمعة',
    items: [
      {
        title: '🌿 جمعة مباركة',
        body: 'أكثر من الصلاة على النبي ﷺ وقراءة سورة الكهف، وادعُ لمن تحب… جمعة طيبة عليك 🤍'
      },
      {
        title: '🕌 تذكير بسورة الكهف',
        body: 'لا تنسَ قراءة سورة الكهف اليوم، فهي نورٌ ما بين الجمعتين.'
      }
    ]
  },
  {
    category: '🤲 أدعية وتفريج هم',
    items: [
      {
        title: '🤍 قل يا رب',
        body: 'لو ضاق صدرك… ارفع يديك وقل: يا رب. افتح التطبيق واختر دعاء يطمئن قلبك.'
      },
      {
        title: '🌧️ دعاء الكرب والهم',
        body: 'ما أصابك لم يكن ليخطئك… تعال نردد معًا أدعية تفريج الكرب من داخل التطبيق.'
      }
    ]
  }
];

export default function NotificationsDocsPage() {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('تم النسخ! 📋');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <BookOpen className="w-16 h-16 text-amber-300" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">توثيق نظام الإشعارات</h1>
            <p className="text-xl text-emerald-100">قوالب وأكواد جاهزة للاستخدام</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* JSON Templates */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FileJson className="w-8 h-8 text-emerald-600" />
            <h2 className="text-3xl font-bold text-gray-800">قوالب JSON جاهزة</h2>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            استخدم هذه القوالب مع Firebase / OneSignal / أو داخل لوحة التحكم في Base44
          </p>
          
          <div className="grid grid-cols-1 gap-6">
            {JSON_TEMPLATES.map(template => (
              <Card key={template.id} className="bg-white border-2 border-emerald-100">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-emerald-600 text-white text-base px-4 py-1">
                      {template.name}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(template.code, `json-${template.id}`)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copiedId === `json-${template.id}` ? 'تم النسخ!' : 'نسخ الكود'}
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{template.code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Text Templates */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-8 h-8 text-emerald-600" />
            <h2 className="text-3xl font-bold text-gray-800">باقة نصوص الإشعارات</h2>
          </div>
          
          <div className="space-y-8">
            {NOTIFICATION_TEXTS.map((section, idx) => (
              <Card key={idx} className="bg-white border-2 border-emerald-100">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-emerald-700 mb-4">{section.category}</h3>
                  <div className="space-y-4">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="border-r-4 border-emerald-300 pr-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-bold text-lg text-gray-800 mb-1">
                              العنوان: {item.title}
                            </div>
                            <div className="text-gray-600">
                              النص: {item.body}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(`${item.title}\n${item.body}`, `text-${idx}-${itemIdx}`)}
                            className="hover:bg-emerald-50 ml-4"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Usage Guide */}
        <Card className="mt-12 bg-gradient-to-r from-emerald-50 to-amber-50 border-2 border-emerald-200">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">📚 كيفية الاستخدام</h3>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p className="flex items-start gap-2">
                <span className="font-bold text-emerald-600">1️⃣</span>
                <span>لو Base44 يطلب منك عنوان الإشعار (Title) و النص (Body): انسخ من القائمة مباشرة.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-emerald-600">2️⃣</span>
                <span>لو يطلب "كود" بصيغة JSON: خُد أحد القوالب في القسم الأول، وعدّل title و body بالنص اللي يعجبك.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-emerald-600">3️⃣</span>
                <span>يمكنك ضبط الإشعارات حسب مواقيت الصلاة أو جدول زمني معين لمدينتك.</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}