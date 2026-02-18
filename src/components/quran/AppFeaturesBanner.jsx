import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { MessageCircle, Sparkles, Mic, BookOpen, Radio, Trophy, Wifi, Heart } from 'lucide-react';

export default function AppFeaturesBanner() {
  const features = [
    { 
      icon: Sparkles, 
      name: 'المساعد الذكي', 
      desc: 'ذكاء اصطناعي بصوت عربي',
      gradient: 'from-purple-500 to-indigo-600',
      link: 'Assistant',
      highlight: true
    },
    { 
      icon: MessageCircle, 
      name: 'واتساب مباشر', 
      desc: 'اسأل عن القرآن',
      gradient: 'from-green-500 to-emerald-600',
      action: 'whatsapp',
      highlight: true
    },
    { 
      icon: BookOpen, 
      name: 'تفسير شامل', 
      desc: 'تفسير ميسر ومفصل',
      gradient: 'from-emerald-500 to-teal-600',
      link: 'Quran'
    },
    { 
      icon: Mic, 
      name: 'تلاوات مباركة', 
      desc: 'أشهر القراء',
      gradient: 'from-amber-500 to-orange-600',
      link: 'Tilawa'
    },
    { 
      icon: Heart, 
      name: 'أذكار وأدعية', 
      desc: 'ورد يومي',
      gradient: 'from-pink-500 to-rose-600',
      link: 'Athkar'
    },
    { 
      icon: Radio, 
      name: 'راديو قرآن', 
      desc: 'بث مباشر 24/7',
      gradient: 'from-cyan-500 to-blue-600',
      link: 'QuranRadio'
    },
    { 
      icon: Trophy, 
      name: 'نظام نقاط', 
      desc: 'كافئ نفسك',
      gradient: 'from-yellow-500 to-amber-600',
      link: 'Rewards'
    },
    { 
      icon: Wifi, 
      name: 'بدون إنترنت', 
      desc: 'حمل واستمع',
      gradient: 'from-indigo-500 to-purple-600',
      link: 'Quran'
    }
  ];

  const handleWhatsApp = () => {
    const whatsappURL = base44.agents.getWhatsAppConnectURL('quran_assistant');
    window.open(whatsappURL, '_blank');
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 rounded-3xl p-6 max-w-5xl mx-auto shadow-2xl border-2 border-emerald-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full mb-3 shadow-lg">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-bold">تطبيق القرآن الذكي</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            تجربة قرآنية متكاملة
          </h2>
          <p className="text-lg text-gray-600 font-medium">رحلتك مع كتاب الله بذكاء اصطناعي وصوت عربي واضح</p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHighlight = feature.highlight;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                {feature.action === 'whatsapp' ? (
                  <button
                    onClick={handleWhatsApp}
                    className={`relative w-full p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg hover:shadow-2xl transition-all group ${
                      isHighlight ? 'ring-4 ring-yellow-400 ring-offset-2 animate-pulse' : ''
                    }`}
                  >
                    {isHighlight && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                        جديد!
                      </div>
                    )}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-sm font-bold mb-1">{feature.name}</h3>
                      <p className="text-xs opacity-90">{feature.desc}</p>
                    </div>
                  </button>
                ) : (
                  <Link
                    to={createPageUrl(feature.link)}
                    className={`relative block w-full p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg hover:shadow-2xl transition-all group ${
                      isHighlight ? 'ring-4 ring-yellow-400 ring-offset-2 animate-pulse' : ''
                    }`}
                  >
                    {isHighlight && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                        مميز!
                      </div>
                    )}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-sm font-bold mb-1">{feature.name}</h3>
                      <p className="text-xs opacity-90">{feature.desc}</p>
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-600 mb-3">
            🤲 اللهم اجعلنا من أهل القرآن وخاصته
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              متصل بالإنترنت
            </span>
            <span>•</span>
            <span>مجاني 100%</span>
            <span>•</span>
            <span>بدون إعلانات</span>
          </div>
        </motion.div>
      </div>
    </Card>
  );
}