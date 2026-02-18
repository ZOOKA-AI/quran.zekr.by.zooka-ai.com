import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Zap, Cloud, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOODS = [
  {
    id: 'anxiety',
    label: 'أشعر بالقلق',
    icon: Cloud,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    textColor: 'text-blue-700 dark:text-blue-300',
    verses: [
      { surah: 'الشرح', text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا' },
      { surah: 'الرعد', text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ' }
    ]
  },
  {
    id: 'peace',
    label: 'أحتاج لسكينة',
    icon: Heart,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    verses: [
      { surah: 'الرحمن', text: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ' },
      { surah: 'النور', text: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ' }
    ]
  },
  {
    id: 'motivation',
    label: 'أريد تحفيزاً',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    textColor: 'text-orange-700 dark:text-orange-300',
    verses: [
      { surah: 'العصر', text: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ' },
      { surah: 'الانشراح', text: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا' }
    ]
  }
];

export default function MoodNavigator({ onMoodSelect }) {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    onMoodSelect?.(mood);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">كيف تشعر اليوم؟</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MOODS.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood?.id === mood.id;
              
              return (
                <Button
                  key={mood.id}
                  onClick={() => handleMoodClick(mood)}
                  className={`h-auto py-4 px-4 ${
                    isSelected 
                      ? `bg-gradient-to-r ${mood.color} text-white shadow-lg scale-105` 
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  } transition-all duration-300`}
                  variant={isSelected ? "default" : "outline"}
                >
                  <div className="flex flex-col items-center gap-2 w-full">
                    <Icon className="w-8 h-8" />
                    <span className="font-bold text-sm">{mood.label}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className={`${selectedMood.bgColor} border-2`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={`bg-gradient-to-r ${selectedMood.color} text-white`}>
                    آيات مقترحة
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {selectedMood.verses.map((verse, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/60 dark:bg-black/30 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <Badge variant="outline" className="mb-2">{verse.surah}</Badge>
                      <p className={`text-xl font-arabic leading-loose ${selectedMood.textColor}`}>
                        {verse.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}