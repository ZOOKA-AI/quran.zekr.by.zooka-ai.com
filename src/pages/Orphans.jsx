import React from 'react';
import { Heart, Users, Gift, Phone, Mail, CreditCard, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Orphans() {
  const donationMethods = [
    {
      name: 'Ziina زينة',
      icon: CreditCard,
      description: 'تبرع مباشر وآمن',
      link: 'https://pay.ziina.com/RoyalHaroonZLLC/6gIekkkfy',
      color: 'from-teal-500 to-cyan-600',
      isLink: true
    },
    {
      name: 'فودافون كاش',
      icon: Smartphone,
      description: '00201090193337',
      link: 'tel:00201090193337',
      color: 'from-red-500 to-pink-600',
      isLink: true
    },
    {
      name: 'e& اتصالات',
      icon: Phone,
      description: '+971 56 604 7579',
      link: 'tel:+971566047579',
      color: 'from-orange-500 to-amber-600',
      isLink: true
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">كفالة الأيتام</h1>
          <p className="text-xl text-gray-600 font-arabic">﴿ وَيُطْعِمُونَ الطَّعَامَ عَلَىٰ حُبِّهِ مِسْكِينًا وَيَتِيمًا وَأَسِيرًا ﴾</p>
        </div>

        {/* صدقة جارية */}
        <Card className="mb-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">🤲 صدقة جارية على روح المرحومة</h2>
            <p className="text-3xl font-arabic text-purple-900 mb-2">جزبية عبد الرحيم هارون علي</p>
            <p className="text-lg text-purple-700">وموتانا وموتى المسلمين أجمعين</p>
            <p className="text-purple-600 mt-2">اللهم ارحمهم واغفر لهم وأسكنهم فسيح جناتك</p>
          </CardContent>
        </Card>

        {/* طرق التبرع */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center">💝 طرق التبرع</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {donationMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <a 
                  key={index}
                  href={method.link}
                  target={method.name === 'Ziina زينة' ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className={`h-full bg-gradient-to-br ${method.color} text-white hover:scale-105 transition-transform cursor-pointer`}>
                    <CardContent className="p-6 text-center">
                      <Icon className="w-10 h-10 mx-auto mb-3" />
                      <h3 className="text-xl font-bold mb-2">{method.name}</h3>
                      <p className="text-white/90">{method.description}</p>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>

        {/* معلومات الشركة */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-amber-300 mb-4">🏢 من إنتاج</h3>
            <p className="text-lg font-bold mb-4">Royal Haroon Cleaning and Disinfection Services FZ-LLC</p>
            
            <div className="flex flex-col items-center gap-2 mt-6">
              <p className="text-amber-200 font-bold">📧 للتواصل:</p>
              <a href="mailto:info@zooka-ai.com" className="text-emerald-300 hover:text-white transition-colors">
                info@zooka-ai.com
              </a>
              <a href="mailto:info@royalcleanuae.com" className="text-emerald-300 hover:text-white transition-colors">
                info@royalcleanuae.com
              </a>
            </div>
            
            <p className="text-slate-400 text-sm mt-6">⚠️ جميع الحقوق محفوظة</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}