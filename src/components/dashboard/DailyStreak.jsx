import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DailyStreak({ streakDays = 7, currentJuz = 5, totalJuz = 30 }) {
  const progressPercentage = (currentJuz / totalJuz) * 100;

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-2 border-orange-200 dark:border-orange-800 shadow-xl overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(251, 146, 60, 0.4) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <CardContent className="p-6 relative z-10">
        {/* Streak Counter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Flame className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">{streakDays}</span>
                <span className="text-lg text-orange-700 dark:text-orange-300">يوماً</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">🔥 الورد اليومي المتتالي</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-base shadow-lg">
            <Award className="w-4 h-4 ml-1" />
            نشيط
          </Badge>
        </div>

        {/* Progress to Khatmah */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-gray-800 dark:text-gray-200">تقدم الختمة</span>
            </div>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              الجزء {currentJuz} من {totalJuz}
            </span>
          </div>
          
          <Progress value={progressPercentage} className="h-3 bg-gray-200 dark:bg-gray-700" />
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>تم إكمال {Math.round(progressPercentage)}%</span>
            <span>متبقي {totalJuz - currentJuz} جزء</span>
          </div>
        </div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-white/50 dark:bg-black/30 rounded-lg border border-orange-200 dark:border-orange-800"
        >
          <p className="text-sm text-center text-gray-700 dark:text-gray-300 font-arabic">
            ✨ استمر! أنت على بُعد {totalJuz - currentJuz} جزء من ختم القرآن الكريم
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}