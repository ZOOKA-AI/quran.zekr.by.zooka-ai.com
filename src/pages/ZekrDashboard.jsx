import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import DailyStreak from '@/components/dashboard/DailyStreak';
import MoodNavigator from '@/components/dashboard/MoodNavigator';
import FloatingAudioPlayer from '@/components/dashboard/FloatingAudioPlayer';
import CommunityChallenge from '@/components/dashboard/CommunityChallenge';

export default function ZekrDashboard() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleMoodSelect = (mood) => {
    console.log('Selected mood:', mood);
    // Here you can implement filtering logic
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`} dir="rtl">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${
              darkMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'
            }`}>
              Zekr AI Dashboard
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              تجربتك اليومية مع القرآن الكريم ✨
            </p>
          </motion.div>

          {/* Dark Mode Toggle */}
          <Button
            onClick={toggleDarkMode}
            size="lg"
            className={`rounded-full w-14 h-14 ${
              darkMode 
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
            } shadow-xl`}
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <DailyStreak streakDays={12} currentJuz={8} totalJuz={30} />
          </motion.div>

          {/* Community Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CommunityChallenge />
          </motion.div>
        </div>

        {/* Mood Navigator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MoodNavigator onMoodSelect={handleMoodSelect} />
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-8 p-6 rounded-2xl border-2 text-center ${
            darkMode 
              ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
              : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'
          }`}
        >
          <p className={`text-lg font-arabic ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            ﴿ اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ﴾
          </p>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            منصة Zekr AI • تجربة قرآنية ذكية ومتجددة
          </p>
        </motion.div>
      </div>

      {/* Floating Audio Player */}
      <FloatingAudioPlayer />
    </div>
  );
}