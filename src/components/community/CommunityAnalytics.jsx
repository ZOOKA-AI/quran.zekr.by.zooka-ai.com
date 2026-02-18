import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, BookOpen, TrendingUp, Award, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function CommunityAnalytics() {
  const { data: groups } = useQuery({
    queryKey: ['readingGroups'],
    queryFn: () => base44.entities.ReadingGroup.list('-created_date', 100),
    initialData: []
  });

  const { data: discussions } = useQuery({
    queryKey: ['discussions'],
    queryFn: () => base44.entities.Discussion.list('-created_date', 100),
    initialData: []
  });

  const { data: comments } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.DiscussionComment.list('-created_date', 100),
    initialData: []
  });

  const { data: shares } = useQuery({
    queryKey: ['shares'],
    queryFn: () => base44.entities.Share.list('-created_date', 100),
    initialData: []
  });

  // Calculate statistics
  const stats = {
    totalGroups: groups.length,
    totalMembers: groups.reduce((sum, g) => sum + (g.members_count || 0), 0),
    totalDiscussions: discussions.length,
    totalComments: comments.length,
    totalShares: shares.length,
    activeGroups: groups.filter(g => g.is_active).length
  };

  // Discussion types distribution
  const discussionTypes = discussions.reduce((acc, d) => {
    acc[d.discussion_type] = (acc[d.discussion_type] || 0) + 1;
    return acc;
  }, {});

  const discussionTypeData = Object.entries(discussionTypes).map(([type, count]) => ({
    name: type === 'verse' ? 'آيات' : type === 'hadith' ? 'أحاديث' : type === 'dua' ? 'أدعية' : 'عام',
    value: count
  }));

  const COLORS = ['#059669', '#3b82f6', '#8b5cf6', '#64748b'];

  // Top groups by members
  const topGroups = [...groups]
    .sort((a, b) => (b.members_count || 0) - (a.members_count || 0))
    .slice(0, 5)
    .map(g => ({
      name: g.name.length > 20 ? g.name.substring(0, 20) + '...' : g.name,
      members: g.members_count || 0
    }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">إحصائيات المجتمع</h2>
        <p className="text-gray-600">نظرة شاملة على نشاط وتفاعل المجتمع</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              المجموعات النشطة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.activeGroups}</div>
            <p className="text-emerald-100 text-sm mt-1">من أصل {stats.totalGroups} مجموعة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              النقاشات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalDiscussions}</div>
            <p className="text-blue-100 text-sm mt-1">{stats.totalComments} تعليق</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              إجمالي الأعضاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalMembers}</div>
            <p className="text-purple-100 text-sm mt-1">في جميع المجموعات</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Groups Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              أكثر المجموعات نشاطاً
            </CardTitle>
            <CardDescription>حسب عدد الأعضاء</CardDescription>
          </CardHeader>
          <CardContent>
            {topGroups.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topGroups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="members" fill="#059669" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                لا توجد بيانات كافية
              </div>
            )}
          </CardContent>
        </Card>

        {/* Discussion Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              توزيع النقاشات
            </CardTitle>
            <CardDescription>حسب النوع</CardDescription>
          </CardHeader>
          <CardContent>
            {discussionTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={discussionTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {discussionTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                لا توجد نقاشات بعد
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalShares}</div>
                <div className="text-sm text-gray-600">مشاركة على وسائل التواصل</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {discussions.length > 0 ? (discussions.reduce((sum, d) => sum + (d.likes_count || 0), 0) / discussions.length).toFixed(1) : 0}
                </div>
                <div className="text-sm text-gray-600">متوسط الإعجابات لكل نقاش</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {groups.filter(g => {
                    const created = new Date(g.created_date);
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return created > weekAgo;
                  }).length}
                </div>
                <div className="text-sm text-gray-600">مجموعات جديدة هذا الأسبوع</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}