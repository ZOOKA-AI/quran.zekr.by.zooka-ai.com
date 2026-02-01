import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Github, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function IntegrationGuide() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ! 📋');
  };

  const repoUrl = 'https://github.com/ZOOKA-AI/quran.zekr.by.zooka-ai.com.git';

  const pilotPrompt = `مرحباً، أريد دمج مستودع GitHub التالي مع التطبيق الحالي على Base44:

🔗 الرابط: ${repoUrl}

📋 الخطوات المطلوبة:

1. فحص محتوى المستودع (الملفات والمجلدات)
2. تحديد الملفات الجديدة التي لا توجد في البناء الحالي
3. دمج الملفات الجديدة دون حذف أي شيء موجود
4. التحقق من التبعيات (npm packages) وإضافة الناقص
5. اختبار التطبيق بعد الدمج

⚠️ ملاحظات مهمة:
- لا تحذف أي ملفات موجودة
- احتفظ بالوظائف الحالية
- ادمج فقط الإضافات الجديدة
- تحقق من عدم وجود تعارضات في الأسماء

📂 الملفات المتوقعة:
- entities/*.json (كيانات البيانات)
- pages/*.js (صفحات التطبيق)
- components/**/*.jsx (مكونات React)
- functions/*.js (دوال خلفية)
- Layout.js (تخطيط التطبيق)

🎯 الهدف النهائي:
تطبيق قرآن كريم متكامل يجمع بين المزايا الحالية والإضافات من المستودع.`;

  const detailedPrompt = `المستودع: ${repoUrl}

أحتاج مساعدتك في:

1️⃣ فتح المستودع وقراءة:
   - هيكل المجلدات
   - قائمة الملفات الرئيسية
   - محتوى package.json

2️⃣ مقارنة مع البناء الحالي:
   - ما الملفات الجديدة؟
   - ما الملفات المحدثة؟
   - هل هناك تبعيات جديدة؟

3️⃣ خطة الدمج:
   أ) الكيانات الجديدة
   ب) الصفحات الإضافية
   ج) المكونات المحسنة
   د) الدوال الخلفية
   هـ) التبعيات الناقصة

4️⃣ التنفيذ:
   - ابدأ بالكيانات
   - ثم الصفحات
   - بعدها المكونات
   - أخيراً الدوال والتبعيات

5️⃣ الاختبار:
   - تحقق من عمل كل ميزة
   - تأكد من عدم وجود أخطاء
   - راجع الأداء

⚠️ قواعد الدمج:
✅ أضف فقط - لا تحذف
✅ احتفظ بالوظائف الحالية
✅ استخدم find_replace للتعديلات
✅ أنشئ ملفات جديدة للمزايا الجديدة
❌ لا تستبدل الملفات كاملة
❌ لا تغير الوظائف الموجودة`;

  const steps = [
    {
      title: 'المرحلة 1: فحص المستودع',
      icon: <Github className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      tasks: [
        'افتح رابط المستودع من GitHub',
        'راجع بنية المجلدات والملفات',
        'اقرأ محتوى package.json',
        'حدد الملفات الرئيسية'
      ]
    },
    {
      title: 'المرحلة 2: المقارنة',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      tasks: [
        'قارن الكيانات الموجودة',
        'قارن الصفحات والمكونات',
        'حدد الملفات الجديدة',
        'حدد التبعيات الجديدة'
      ]
    },
    {
      title: 'المرحلة 3: التنفيذ',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      tasks: [
        'أضف الكيانات الجديدة',
        'أضف الصفحات والمكونات',
        'أضف الدوال الخلفية',
        'ثبت التبعيات الناقصة'
      ]
    },
    {
      title: 'المرحلة 4: الاختبار',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-amber-500 to-amber-600',
      tasks: [
        'اختبر كل ميزة جديدة',
        'تحقق من عمل الميزات القديمة',
        'راجع Console للأخطاء',
        'اختبر على أجهزة مختلفة'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12" dir="rtl">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4">
            <Github className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            دليل دمج المستودع من GitHub
          </h1>
          <p className="text-xl text-gray-600">
            دليل شامل لدمج مستودع ZOOKA-AI مع التطبيق الحالي
          </p>
        </div>

        {/* Repo Info */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 معلومات المستودع</h2>
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">الرابط:</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-gray-100 px-4 py-2 rounded-lg text-sm">
                {repoUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(repoUrl)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">ZOOKA-AI</p>
              <p className="text-sm text-gray-600">المطور</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">Quran</p>
              <p className="text-sm text-gray-600">المشروع</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">Base44</p>
              <p className="text-sm text-gray-600">المنصة</p>
            </div>
          </div>
        </Card>

        {/* Prompts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Basic Prompt */}
          <Card className="p-6 bg-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">🎯 برومبت أساسي</h3>
              <Button
                size="sm"
                onClick={() => copyToClipboard(pilotPrompt)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Copy className="w-4 h-4 ml-2" />
                نسخ
              </Button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto">
              {pilotPrompt}
            </pre>
          </Card>

          {/* Detailed Prompt */}
          <Card className="p-6 bg-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">📝 برومبت مفصل</h3>
              <Button
                size="sm"
                onClick={() => copyToClipboard(detailedPrompt)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Copy className="w-4 h-4 ml-2" />
                نسخ
              </Button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto">
              {detailedPrompt}
            </pre>
          </Card>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            خطوات التكامل
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, idx) => (
              <Card key={idx} className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 bg-gradient-to-r ${step.color} rounded-xl text-white`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <ul className="space-y-2">
                  {step.tasks.map((task, taskIdx) => (
                    <li key={taskIdx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{task}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ ملاحظات مهمة جداً</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-green-700 mb-2">✅ افعل:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• أضف الملفات الجديدة فقط</li>
                <li>• احتفظ بالوظائف الحالية</li>
                <li>• استخدم find_replace للتعديلات</li>
                <li>• اختبر بعد كل إضافة</li>
                <li>• أنشئ نسخة احتياطية</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-red-700 mb-2">❌ لا تفعل:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• لا تحذف ملفات موجودة</li>
                <li>• لا تستبدل الملفات كاملة</li>
                <li>• لا تغير الوظائف القديمة</li>
                <li>• لا تتجاهل الأخطاء</li>
                <li>• لا تدمج دون اختبار</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Quick Commands */}
        <Card className="mt-8 p-6 bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ أوامر سريعة</h2>
          <div className="space-y-3">
            {[
              { title: 'استنساخ المستودع', cmd: `git clone ${repoUrl}` },
              { title: 'الدخول للمجلد', cmd: 'cd quran.zekr.by.zooka-ai.com' },
              { title: 'فحص الملفات', cmd: 'ls -la' },
              { title: 'فحص التبعيات', cmd: 'cat package.json' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <code className="flex-1 text-sm text-gray-800">{item.cmd}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(item.cmd)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">تم إنشاء هذا الدليل بواسطة Base44 AI</p>
          <p className="text-sm">الإصدار 1.0 • 2026-02-01</p>
        </div>
      </div>
    </div>
  );
}