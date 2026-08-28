import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Award, Crown, Target, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import FeaturedChannels from '@/components/channels/FeaturedChannels';

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
    mutationFn: () => base44.entities.UserPoints.create({ total_points: 0, level: 1, badges: [] }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userPoints'] }),
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
      <div className="min-h-screen relative flex items-center justify-center" dir="rtl">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/90 via-orange-950/95 to-slate-950/98" />
        </div>
        <Card className="relative z-10 p-12 text-center bg-slate-900/60 backdrop-blur-xl border-amber-500/30 shadow-2xl">
          <Trophy className="w-20 h-20 mx-auto text-amber-400 mb-4" />
          <h2 className="text-3xl font-bold mb-3 text-amber-200">يرجى تسجيل الدخول</h2>
          <p className="text-slate-400 text-lg">للوصول إلى نظام المكافآت والنقاط</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-24" dir="rtl">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/90 via-yellow-950/95 to-slate-950/98" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">إنجازاتك القرآنية</h1>
          <p className="text-xl text-amber-200 font-arabic">﴿ وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ ﴾</p>
          <p className="text-slate-300 mt-2">واصل الطريق واجمع النقاط والأوسمة 🌟</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className={`p-8 mb-8 bg-gradient-to-br ${currentLevel.color} text-white shadow-2xl border-0 overflow-hidden relative`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl">
                  <Crown className="w-12 h-12" />
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">المستوى الحالي</p>
                  <h2 className="text-5xl font-bold">{currentLevel.name}</h2>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm opacity-90 mb-1">مجموع النقاط</p>
                <h3 className="text-6xl font-bold">{userPoints?.total_points || 0}</h3>
              </div>
            </div>
            
            {nextLevel && (
              <div className="mt-6 relative z-10">
                <div className="flex justify-between text-sm mb-2 opacity-90">
                  <span>التقدم للمستوى التالي: {nextLevel.name}</span>
                  <span className="font-bold">{Math.round(progressToNext)}%</span>
                </div>
                <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white/90 rounded-full transition-all duration-500"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Target, label: 'ختمة كاملة', value: userPoints?.khatam_count || 0, color: 'from-emerald-500 to-green-600', delay: 0.2 },
            { icon: TrendingUp, label: 'مشاركة', value: userPoints?.shares_count || 0, color: 'from-blue-500 to-indigo-600', delay: 0.25 },
            { icon: Zap, label: 'يوم متتالي', value: userPoints?.current_streak || 0, color: 'from-purple-500 to-pink-600', delay: 0.3 },
            { icon: Star, label: 'ساعة استماع', value: Math.floor(userPoints?.listening_hours || 0), color: 'from-amber-500 to-orange-600', delay: 0.35 }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stat.delay }}>
              <Card className={`p-6 bg-gradient-to-br ${stat.color} text-white border-0 shadow-xl hover:scale-105 transition-transform`}>
                <stat.icon className="w-10 h-10 mb-3 opacity-90" />
                <div className="text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-8 bg-slate-900/60 backdrop-blur-xl border-amber-500/30 mb-8 shadow-xl">
            <h2 className="text-3xl font-bold text-amber-200 mb-6 flex items-center gap-3">
              <Award className="w-8 h-8" />
              الأوسمة والإنجازات
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {BADGES.map((badge, index) => {
                const earned = (userPoints?.badges || []).some(b => b.name === badge.name);
                return (
                  <motion.div
                    key={badge.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <Card className={`p-6 transition-all hover:scale-105 ${earned ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/30 border-2 border-amber-400 shadow-xl' : 'bg-slate-800/40 border-slate-700/50'}`}>
                      <div className="text-center">
                        <div className={`text-6xl mb-3 ${!earned && 'grayscale opacity-40'}`}>
                          {badge.icon}
                        </div>
                        <h3 className={`font-bold text-lg mb-2 ${earned ? 'text-amber-300' : 'text-slate-500'}`}>
                          {badge.name}
                        </h3>
                        <p className={`text-xs mb-3 ${earned ? 'text-white/80' : 'text-slate-600'}`}>
                          {badge.description}
                        </p>
                        <div className={`text-sm font-bold ${earned ? 'text-amber-400' : 'text-slate-600'}`}>
                          {badge.points} نقطة
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="p-8 bg-slate-900/60 backdrop-blur-xl border-amber-500/30 shadow-xl">
            <h2 className="text-3xl font-bold text-amber-200 mb-6 flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              جميع المستويات
            </h2>
            <div className="space-y-4">
              {LEVELS.map((level, index) => {
                const isCurrentLevel = level.level === currentLevel.level;
                const isCompleted = (userPoints?.total_points || 0) >= level.minPoints;
                return (
                  <motion.div
                    key={level.level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    className={`flex items-center gap-6 p-6 rounded-2xl transition-all ${
                      isCurrentLevel 
                        ? 'bg-gradient-to-r from-amber-500/40 to-orange-500/40 border-2 border-amber-400 shadow-xl' 
                        : isCompleted 
                          ? 'bg-slate-800/40 border border-slate-700' 
                          : 'bg-slate-800/20 border border-slate-700/50 opacity-50'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                      {level.level}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-xl mb-1">{level.name}</h3>
                      <p className="text-slate-400">{level.minPoints.toLocaleString()} نقطة</p>
                    </div>
                    {isCurrentLevel && (
                      <div className="px-6 py-3 bg-amber-500 rounded-full text-white font-bold shadow-lg">
                        المستوى الحالي
                      </div>
                    )}
                    {isCompleted && !isCurrentLevel && (
                      <Star className="w-8 h-8 text-amber-400 fill-current" />
                    )}
                  </motion.div>
                );
              })}
              </div>
              </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="mt-8">
              <h2 className="text-2xl font-bold text-amber-200 mb-6">📺 قنوات تحفيزية إسلامية</h2>
              <FeaturedChannels variant="horizontal" limit={6} />
              </motion.div>
              </div>
              </div>
              );
              }