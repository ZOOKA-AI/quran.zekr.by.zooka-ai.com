import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Award, TrendingUp, Zap, Crown, Target } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

const BADGES = [
  { name: 'القارئ المبتدئ', icon: '📖', points: 100, description: 'أول خطوة في رحلة القرآن' },
  { name: 'الحافظ', icon: '🎯', points: 500, description: 'ختم القرآن مرة واحدة' },
  { name: 'المثابر', icon: '⚡', points: 1000, description: '7 أيام متتالية من القراءة' },
  { name: 'المشارك النشط', icon: '💬', points: 250, description: '10 مشاركات في المجتمع' },
  { name: 'الملهم', icon: '✨', points: 500, description: '50 إعجاب على مشاركاتك' },
  { name: 'الختام الذهبي', icon: '👑', points: 2000, description: '5 ختمات كاملة' },
];

const LEVELS = [
  { level: 1, name: 'مبتدئ', minPoints: 0, color: 'from-gray-400 to-gray-600' },
  { level: 2, name: 'قارئ', minPoints: 100, color: 'from-green-400 to-green-600' },
  { level: 3, name: 'مجتهد', minPoints: 500, color: 'from-blue-400 to-blue-600' },
  { level: 4, name: 'محب للقرآن', minPoints: 1000, color: 'from-purple-400 to-purple-600' },
  { level: 5, name: 'حافظ', minPoints: 2500, color: 'from-amber-400 to-amber-600' },
  { level: 6, name: 'متقن', minPoints: 5000, color: 'from-pink-400 to-pink-600' },
  { level: 7, name: 'أسطورة', minPoints: 10000, color: 'from-red-400 to-red-600' },
];

export default function RewardsPage() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: userPoints } = useQuery({
    queryKey: ['userPoints', user?.email],
    queryFn: async () => {
      const points = await base44.entities.UserPoints.filter({ created_by: user.email });
      return points[0];
    },
    enabled: isAuthenticated,
  });

  const createUserPointsMutation = useMutation({
    mutationFn: () => base44.entities.UserPoints.create({
      total_points: 0,
      level: 1,
      badges: []
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPoints'] });
    },
  });

  useEffect(() => {
    if (isAuthenticated && !userPoints) {
      createUserPointsMutation.mutate();
    }
  }, [isAuthenticated, userPoints]);

  const currentLevel = LEVELS.reduce((acc, level) => {
    if ((userPoints?.total_points || 0) >= level.minPoints) return level;
    return acc;
  }, LEVELS[0]);

  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  const progressToNext = nextLevel 
    ? ((userPoints?.total_points || 0) - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints) * 100
    : 100;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center" dir="rtl">
        <Card className="p-12 text-center">
          <Trophy className="w-16 h-16 mx-auto text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">يرجى تسجيل الدخول</h2>
          <p className="text-gray-600">للوصول إلى نظام المكافآت والنقاط</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" dir="rtl">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-full mb-4">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">نظام المكافآت</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">إنجازاتك القرآنية</h1>
          <p className="text-purple-200 text-lg">واصل الطريق واجمع النقاط والأوسمة 🌟</p>
        </div>

        {/* Current Level Card */}
        <Card className={`p-8 mb-8 bg-gradient-to-br ${currentLevel.color} text-white shadow-2xl`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Crown className="w-10 h-10" />
              </div>
              <div>
                <p className="text-sm opacity-90">المستوى الحالي</p>
                <h2 className="text-4xl font-bold">{currentLevel.name}</h2>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm opacity-90">مجموع النقاط</p>
              <h3 className="text-5xl font-bold">{userPoints?.total_points || 0}</h3>
            </div>
          </div>
          
          {nextLevel && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>التقدم للمستوى التالي: {nextLevel.name}</span>
                <span>{Math.round(progressToNext)}%</span>
              </div>
              <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/80 rounded-full transition-all duration-500"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white">
            <Target className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{userPoints?.khatam_count || 0}</div>
            <div className="text-sm opacity-90">ختمة كاملة</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{userPoints?.shares_count || 0}</div>
            <div className="text-sm opacity-90">مشاركة</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <Zap className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{userPoints?.current_streak || 0}</div>
            <div className="text-sm opacity-90">يوم متتالي</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <Star className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{Math.floor((userPoints?.listening_hours || 0))} ساعة</div>
            <div className="text-sm opacity-90">استماع</div>
          </Card>
        </div>

        {/* Badges */}
        <Card className="p-8 bg-white/10 backdrop-blur-xl border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-400" />
            الأوسمة والإنجازات
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BADGES.map((badge) => {
              const earned = (userPoints?.badges || []).some(b => b.name === badge.name);
              return (
                <Card key={badge.name} className={`p-4 ${earned ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-400' : 'bg-white/5 border-white/10'}`}>
                  <div className="text-center">
                    <div className={`text-5xl mb-2 ${!earned && 'grayscale opacity-50'}`}>
                      {badge.icon}
                    </div>
                    <h3 className={`font-bold mb-1 ${earned ? 'text-amber-300' : 'text-white/50'}`}>
                      {badge.name}
                    </h3>
                    <p className={`text-xs mb-2 ${earned ? 'text-white/80' : 'text-white/40'}`}>
                      {badge.description}
                    </p>
                    <div className={`text-xs ${earned ? 'text-amber-400' : 'text-white/40'}`}>
                      {badge.points} نقطة
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>

        {/* All Levels */}
        <Card className="p-8 bg-white/10 backdrop-blur-xl border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-400" />
            جميع المستويات
          </h2>
          <div className="space-y-4">
            {LEVELS.map((level) => {
              const isCurrentLevel = level.level === currentLevel.level;
              const isCompleted = (userPoints?.total_points || 0) >= level.minPoints;
              return (
                <div 
                  key={level.level}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    isCurrentLevel 
                      ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 border-2 border-amber-400' 
                      : isCompleted 
                        ? 'bg-white/5' 
                        : 'bg-white/5 opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center text-white font-bold`}>
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{level.name}</h3>
                    <p className="text-white/60 text-sm">{level.minPoints.toLocaleString()} نقطة</p>
                  </div>
                  {isCurrentLevel && (
                    <div className="px-4 py-2 bg-amber-500 rounded-full text-white text-sm font-bold">
                      المستوى الحالي
                    </div>
                  )}
                  {isCompleted && !isCurrentLevel && (
                    <Star className="w-6 h-6 text-amber-400 fill-current" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}