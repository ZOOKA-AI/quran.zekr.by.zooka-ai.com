import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, FileCode, BookOpen, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const JSON_TEMPLATES = [
  {
    id: 1,
    title: '🌙 تذكير بذكر الله',
    code: `{
  "notification": {
    "title": "🌙 تذكير بذكر الله",
    "body": "لا تنسَ وردك من الأذكار اليوم، دقائق قليلة تفتح لك بابًا عظيمًا من الأجر 🤍"
  },
  "data": {
    "screen": "adhkar",
    "type": "daily_reminder"
  }
}`,
    category: 'أذكار'
  },
  {
    id: 2,
    title: '📖 حديث اليوم',
    code: `{
  "notification": {
    "title": "📖 حديث اليوم",
    "body": "قال رسول الله ﷺ: «أحب الأعمال إلى الله أدومها وإن قل» – لا تحرم نفسك من عملٍ ثابت ولو قليل."
  },
  "data": {
    "screen": "hadith",
    "type": "hadith_of_day"
  }
}`,
    category: 'حديث'
  },
  {
    id: 3,
    title: '✨ تحديث جديد',
    code: `{
  "notification": {
    "title": "✨ تحديث جديد في تطبيقك الإسلامي",
    "body": "أضفنا أذكارًا ودعوات جديدة، افتح التطبيق الآن واكتشفها 🌿"
  },
  "data": {
    "screen": "home",
    "type": "update"
  }
}`,
    category: 'تحديث'
  },
  {
    id: 4,
    title: '☀️ أذكار الصباح',
    code: `{
  "notification": {
    "title": "☀️ أذكار الصباح",
    "body": "ابدأ يومك بذكر الله، افتح التطبيق واقرأ أذكار الصباح الآن، فبها تحفظ وتكفى 🌸"
  },
  "data": {
    "screen": "morning_adhkar",
    "type": "morning_reminder"
  }
}`,
    category: 'أذكار'
  },
  {
    id: 5,
    title: '🕌 سورة الكهف',
    code: `{
  "notification": {
    "title": "🕌 تذكير بسورة الكهف",
    "body": "لا تنسَ قراءة سورة الكهف اليوم، فهي نورٌ ما بين الجمعتين."
  },
  "data": {
    "screen": "quran",
    "surah": 18,
    "type": "friday_reminder"
  }
}`,
    category: 'الجمعة'
  },
  {
    id: 6,
    title: '🤍 قل يا رب',
    code: `{
  "notification": {
    "title": "🤍 قل يا رب",
    "body": "لو ضاق صدرك… ارفع يديك وقل: يا رب. افتح التطبيق واختر دعاء يطمئن قلبك."
  },
  "data": {
    "screen": "dua",
    "type": "dua_reminder"
  }
}`,
    category: 'دعاء'
  }
];

export default function NotificationDocsPage() {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('تم النسخ! 📋');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <FileCode className="w-16 h-16 text-amber-300" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">📚 مستند توثيق الإشعارات</h1>
            <p className="text-xl text-purple-100">قوالب JSON جاهزة للاستخدام في Firebase / OneSignal / Base44</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Introduction */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 mb-12">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4 flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              كيفية الاستخدام
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                <strong>1️⃣ للاستخدام في Base44:</strong> انسخ الكود وألصقه في لوحة التحكم الخاصة بالإشعارات
              </p>
              <p className="text-lg">
                <strong>2️⃣ للاستخدام في Firebase Cloud Messaging:</strong> استخدم الكود في طلب HTTP POST إلى FCM API
              </p>
              <p className="text-lg">
                <strong>3️⃣ للاستخدام في OneSignal:</strong> انسخ حقول title و body في لوحة التحكم
              </p>
              <div className="bg-white rounded-lg p-4 mt-6 border border-emerald-300">
                <p className="font-bold text-emerald-700 mb-2">💡 نصيحة:</p>
                <p>يمكنك تعديل النصوص حسب احتياجك، لكن احتفظ بنفس التركيب الأساسي للـ JSON</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Templates Grid */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">قوالب JSON الجاهزة</h2>
          {JSON_TEMPLATES.map(template => (
            <Card key={template.id} className="bg-white border-2 border-gray-200 hover:border-purple-300 transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-gray-800">{template.title}</h3>
                    <Badge className="bg-purple-100 text-purple-700">{template.category}</Badge>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(template.code, template.id)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {copiedId === template.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        تم النسخ
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        نسخ الكود
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono" dir="ltr">
                    {template.code}
                  </pre>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 mt-12">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">📝 ملاحظات مهمة</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>حقل <code className="bg-white px-2 py-1 rounded text-sm">data</code> يُستخدم لتمرير معلومات إضافية للتطبيق</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>يمكنك إضافة أي حقول إضافية في <code className="bg-white px-2 py-1 rounded text-sm">data</code> حسب احتياجك</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>استخدم الإيموجي في العناوين لجعل الإشعارات أكثر جذباً</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>اجعل النص قصيراً ومباشراً (أقل من 100 حرف للعنوان، أقل من 200 للنص)</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}