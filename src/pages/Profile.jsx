import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Heart, BookOpen, Clock, Flame, Award, Share2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ProfilePage() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: userPoints } = useQuery({
    queryKey: ['userPoints'],
    queryFn: async () => {
      if (!user?.email) return null;
      const points = await base44.entities.UserPoints.filter({ created_by: user.email });
      return points[0] || null;
    },
    enabled: !!user?.email,
    initialData: null
  });

  const { data: bookmarks } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.filter({ created_by: user?.email }, '-created_date', 100),
    enabled: !!user?.email,
    initialData: []
  });

  const { data: listeningHistory } = useQuery({
    queryKey: ['listeningHistory'],
    queryFn: () => base44.entities.ListeningHistory.filter({ created_by: user?.email }, '-listening_time', 100),
    enabled: !!user?.email,
    initialData: []
  });

  const { data: userShares } = useQuery({
    queryKey: ['userShares'],
    queryFn: () => base44.entities.DailyShare.filter({ created_by: user?.email }, '-created_date', 50),
    enabled: !!user?.email,
    initialData: []
  });

  // Calculate listening hours by day
  const listeningByDay = {};
  listeningHistory.forEach(h => {
    const date = new Date(h.listening_time).toLocaleDateString('ar-SA');
    listeningByDay[date] = (listeningByDay[date] || 0) + (h.play_duration || 0) / 3600;
  });

  const listeningChartData = Object.entries(listeningByDay)
    .slice(-7)
    .map(([date, hours]) => ({ date, hours: parseFloat(hours.toFixed(2)) }));

  // Badges earned
  const badges = userPoints?.badges || [];

  // Top surahs by listening
  const surahStats = {};
  listeningHistory.forEach(h => {
    const surah = h.surah_number;
    if (!surahStats[surah]) {
      surahStats[surah] = { surah, hours: 0, listens: 0 };
    }
    surahStats[surah].hours += (h.play_duration || 0) / 3600;
    surahStats[surah].listens += 1;
  });

  const topSurahs = Object.values(surahStats)
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5)
    .map(s => ({ name: `السورة ${s.surah}`, hours: parseFloat(s.hours.toFixed(2)) }));

  const streakData = [
    { name: 'الأسبوع السابق', days: userPoints?.longest_streak || 0 },
    { name: 'السلسلة الحالية', days: userPoints?.current_streak || 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pt-8 pb-24 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header with User Info */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl p-8 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{user?.full_name || 'مستخدم'}</h1>
              <p className="text-emerald-50">{user?.email}</p>
              <div className="flex gap-4 mt-4">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  المستوى: {userPoints?.level || 1}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  الدور: {user?.role || 'مستخدم'}
                </Badge>
              </div>
            </div>
            <Trophy className="w-16 h-16 text-amber-300" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border-emerald-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي النقاط</p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{userPoints?.total_points || 0}</p>
                </div>
                <Award className="w-12 h-12 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ساعات الاستماع</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{(userPoints?.listening_hours || 0).toFixed(1)}</p>
                </div>
                <Clock className="w-12 h-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">عدد الختمات</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{userPoints?.khatam_count || 0}</p>
                </div>
                <BookOpen className="w-12 h-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">السلسلة الحالية</p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">{userPoints?.current_streak || 0}</p>
                </div>
                <Flame className="w-12 h-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Listening History Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                سجل الاستماع (آخر 7 أيام)
              </CardTitle>
              <CardDescription>عدد ساعات الاستماع يومياً</CardDescription>
            </CardHeader>
            <CardContent>
              {listeningChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={listeningChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-45} height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} ساعة`} />
                    <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">لا يوجد سجل استماع</div>
              )}
            </CardContent>
          </Card>

          {/* Top Surahs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                أكثر السور استماعاً
              </CardTitle>
              <CardDescription>حسب الساعات المستماعة</CardDescription>
            </CardHeader>
            <CardContent>
              {topSurahs.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topSurahs}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} ساعة`} />
                    <Bar dataKey="hours" fill="#059669" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">لا يوجد بيانات</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Streaks & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Streaks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                السلاسل والإنجازات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">السلسلة الحالية</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{userPoints?.current_streak || 0} أيام</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">أطول سلسلة</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{userPoints?.longest_streak || 0} أيام</p>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                الأوسمة المكتسبة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {badges.map((badge, idx) => (
                    <div key={idx} className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="text-2xl mb-2">{badge.icon || '🏆'}</div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">{badge.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">لم تكتسب أي أوسمة بعد</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                المحفوظات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">{bookmarks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">آية ومرجع محفوظ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600" />
                المشاركات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{userShares.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">على وسائل التواصل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                التعليقات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{userPoints?.comments_count || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">تعليق شارك</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to={createPageUrl('Bookmarks')}>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Heart className="w-4 h-4 ml-2" />
              عرض المحفوظات
            </Button>
          </Link>
          <Link to={createPageUrl('Community')}>
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 ml-2" />
              المجتمع
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}