import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Leaderboard({ limit = 10 }) {
  const [timeframe, setTimeframe] = useState('alltime'); // alltime, monthly, weekly

  const { data: allUserPoints } = useQuery({
    queryKey: ['allUserPoints'],
    queryFn: () => base44.entities.UserPoints.list('-total_points', 100),
    initialData: []
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: () => base44.entities.ActivityLog.list('-timestamp', 100),
    initialData: []
  });

  // Filter leaderboard based on timeframe
  const getFilteredLeaderboard = () => {
    const now = new Date();
    const filtered = allUserPoints.filter(user => {
      if (!user.created_by) return false;
      
      if (timeframe === 'weekly') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const userActivity = recentActivity.filter(
          a => a.user_email === user.created_by && new Date(a.timestamp) > weekAgo
        );
        return userActivity.length > 0;
      } else if (timeframe === 'monthly') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const userActivity = recentActivity.filter(
          a => a.user_email === user.created_by && new Date(a.timestamp) > monthAgo
        );
        return userActivity.length > 0;
      }
      return true;
    });

    return filtered.sort((a, b) => (b.total_points || 0) - (a.total_points || 0)).slice(0, limit);
  };

  const leaderboard = getFilteredLeaderboard();

  const getMedalColor = (position) => {
    if (position === 0) return 'from-amber-400 to-amber-600'; // Gold
    if (position === 1) return 'from-slate-300 to-slate-500'; // Silver
    if (position === 2) return 'from-orange-400 to-orange-600'; // Bronze
    return 'from-blue-400 to-blue-600'; // Regular
  };

  const getMedalIcon = (position) => {
    if (position === 0) return <Trophy className="w-6 h-6 text-amber-600" />;
    if (position === 1) return <Medal className="w-6 h-6 text-slate-500" />;
    if (position === 2) return <Award className="w-6 h-6 text-orange-600" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">🏆 ترتيب المتصدرين</h2>
          <p className="text-gray-600 dark:text-gray-400">أفضل الأعضاء في المجتمع</p>
        </div>
        
        <div className="flex gap-2">
          {['alltime', 'monthly', 'weekly'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeframe === tf
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'
              }`}
            >
              {tf === 'alltime' ? 'الكل' : tf === 'monthly' ? 'شهري' : 'أسبوعي'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`bg-gradient-to-r ${getMedalColor(index)} ${
              index < 3 ? 'border-2' : ''
            } ${index === 0 ? 'border-amber-500' : index === 1 ? 'border-slate-400' : index === 2 ? 'border-orange-500' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Position Badge */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getMedalColor(index)} flex items-center justify-center text-white text-lg font-bold`}>
                      {index + 1}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <p className={`font-bold text-lg ${index < 3 ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                        {user.created_by?.split('@')[0] || 'مستخدم'}
                      </p>
                      <p className={`text-sm ${index < 3 ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                        المستوى {user.level || 1}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${index < 3 ? 'text-white' : 'text-emerald-700 dark:text-emerald-300'}`}>
                        {user.total_points || 0}
                      </p>
                      <p className={`text-xs ${index < 3 ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'}`}>
                        نقطة
                      </p>
                    </div>

                    {/* Badge */}
                    {getMedalIcon(index) && (
                      <div className="ml-4">
                        {getMedalIcon(index)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="mt-4 flex gap-4 border-t border-white/20 pt-3">
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${index < 3 ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'}`}>
                      ⏱️ {(user.listening_hours || 0).toFixed(1)} ساعة
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${index < 3 ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'}`}>
                      📖 {user.khatam_count || 0} ختمة
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${index < 3 ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'}`}>
                      🏆 {user.badges?.length || 0} وسام
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا يوجد متصدرين بعد</h3>
            <p className="text-gray-500">ابدأ الاستماع والقراءة لتظهر هنا! 🎯</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}