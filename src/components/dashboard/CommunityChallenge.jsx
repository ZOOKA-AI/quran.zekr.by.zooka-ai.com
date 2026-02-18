import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, BookOpen, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunityChallenge() {
  const [liveCount, setLiveCount] = useState(1247);
  const [completingNow, setCompletingNow] = useState(89);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 5));
      setCompletingNow(prev => Math.max(50, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const topSurahs = [
    { name: 'الكهف', readers: 523, icon: '📖' },
    { name: 'يس', readers: 412, icon: '✨' },
    { name: 'الرحمن', readers: 389, icon: '💚' }
  ];

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(45deg, rgba(99, 102, 241, 0.3) 25%, transparent 25%, transparent 75%, rgba(99, 102, 241, 0.3) 75%, rgba(99, 102, 241, 0.3)), linear-gradient(45deg, rgba(99, 102, 241, 0.3) 25%, transparent 25%, transparent 75%, rgba(99, 102, 241, 0.3) 75%, rgba(99, 102, 241, 0.3))',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px',
          }}
        />
      </div>

      <CardContent className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">تحدي المجتمع</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">نقرأ معاً الآن</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse px-3 py-1">
            🔴 مباشر
          </Badge>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            key={liveCount}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="p-4 bg-white/60 dark:bg-black/30 rounded-xl border border-indigo-200 dark:border-indigo-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">يقرؤون الآن</span>
            </div>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {liveCount.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            key={completingNow}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="p-4 bg-white/60 dark:bg-black/30 rounded-xl border border-purple-200 dark:border-purple-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">يختمون اليوم</span>
            </div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {completingNow.toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Top Read Surahs */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-gray-800 dark:text-gray-200">أكثر السور قراءة الآن</span>
          </div>
          
          <div className="space-y-2">
            {topSurahs.map((surah, index) => (
              <motion.div
                key={surah.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/60 dark:bg-black/30 rounded-lg border border-indigo-100 dark:border-indigo-800"
              >
                <div className="flex items-center gap-3">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    #{index + 1}
                  </Badge>
                  <span className="text-2xl">{surah.icon}</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{surah.name}</span>
                </div>
                <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                  <Users className="w-4 h-4" />
                  <span className="font-bold">{surah.readers}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-300 dark:border-indigo-700"
        >
          <p className="text-sm text-center font-arabic text-gray-800 dark:text-gray-200">
            💫 انضم إلى المجتمع واقرأ معهم • كل حرف بحسنة والحسنة بعشر أمثالها
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}