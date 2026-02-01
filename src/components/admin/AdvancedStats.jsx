import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, TrendingUp, Globe, Smartphone, Monitor, 
  DollarSign, PieChart, Activity, Award, Heart
} from 'lucide-react';

export default function AdvancedStats() {
  const { data: users = [] } = useQuery({
    queryKey: ['stats-users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: donations = [] } = useQuery({
    queryKey: ['stats-donations'],
    queryFn: () => base44.entities.Donation.list(),
  });

  const { data: analytics = [] } = useQuery({
    queryKey: ['stats-analytics'],
    queryFn: () => base44.entities.ContentAnalytics.list(),
  });

  const { data: visitors = [] } = useQuery({
    queryKey: ['stats-visitors'],
    queryFn: () => base44.entities.VisitorAnalytics.list(),
  });

  // المستخدمين الأكثر تفاعلاً
  const userActivity = users.map(user => {
    const userAnalytics = analytics.filter(a => a.created_by === user.email);
    return {
      ...user,
      totalActions: userAnalytics.length,
      plays: userAnalytics.filter(a => a.action === 'play').length,
      shares: userAnalytics.filter(a => a.action === 'share').length,
    };
  }).sort((a, b) => b.totalActions - a.totalActions).slice(0, 10);

  // تحليل مصادر الزيارات
  const referrerStats = visitors.reduce((acc, v) => {
    const source = v.referrer || 'مباشر';
    const simplifiedSource = source.includes('google') ? 'Google' :
      source.includes('facebook') ? 'Facebook' :
      source.includes('twitter') ? 'Twitter' :
      source.includes('whatsapp') ? 'WhatsApp' :
      source === 'مباشر' ? 'مباشر' : 'أخرى';
    acc[simplifiedSource] = (acc[simplifiedSource] || 0) + 1;
    return acc;
  }, {});

  // تحليل الأجهزة
  const deviceStats = visitors.reduce((acc, v) => {
    const device = v.device_type || 'غير معروف';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  // تقارير التبرعات
  const donationsByType = donations.reduce((acc, d) => {
    const type = d.donation_type || 'أخرى';
    if (!acc[type]) acc[type] = { count: 0, total: 0 };
    acc[type].count++;
    acc[type].total += d.amount || 0;
    return acc;
  }, {});

  const donationsByStatus = donations.reduce((acc, d) => {
    const status = d.status || 'معلق';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const totalDonationAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const completedAmount = donations
    .filter(d => d.status === 'مكتمل')
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* المستخدمين الأكثر تفاعلاً */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            المستخدمين الأكثر تفاعلاً
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userActivity.length === 0 ? (
            <p className="text-slate-400 text-center py-4">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              {userActivity.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-amber-700' : 'bg-slate-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.full_name || user.email}</p>
                      <p className="text-slate-400 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-emerald-400">{user.plays} تشغيل</span>
                    <span className="text-blue-400">{user.shares} مشاركة</span>
                    <Badge className="bg-purple-500">{user.totalActions} نشاط</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* تحليل مصادر الزيارات والأجهزة */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              مصادر الزيارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(referrerStats).length === 0 ? (
              <p className="text-slate-400 text-center py-4">لا توجد بيانات</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(referrerStats).sort((a, b) => b[1] - a[1]).map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-white">{source}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(count / visitors.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-slate-400 text-sm w-12 text-left">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-400" />
              أنواع الأجهزة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(deviceStats).length === 0 ? (
              <p className="text-slate-400 text-center py-4">لا توجد بيانات</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(deviceStats).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {device === 'mobile' ? <Smartphone className="w-4 h-4 text-purple-400" /> :
                       device === 'desktop' ? <Monitor className="w-4 h-4 text-blue-400" /> :
                       <Activity className="w-4 h-4 text-slate-400" />}
                      <span className="text-white capitalize">{device}</span>
                    </div>
                    <Badge className="bg-slate-600">{count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* تقارير التبرعات */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              التبرعات حسب النوع
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(donationsByType).length === 0 ? (
              <p className="text-slate-400 text-center py-4">لا توجد تبرعات</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(donationsByType).map(([type, data]) => (
                  <div key={type} className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{type}</span>
                      <span className="text-green-400 font-bold">{data.total} AED</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{data.count} تبرع</span>
                      <span>المتوسط: {Math.round(data.total / data.count)} AED</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              حالة التبرعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-emerald-400">{completedAmount} AED</p>
              <p className="text-slate-400">المكتملة من إجمالي {totalDonationAmount} AED</p>
            </div>
            
            {Object.keys(donationsByStatus).length === 0 ? (
              <p className="text-slate-400 text-center py-4">لا توجد بيانات</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(donationsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                    <Badge className={
                      status === 'مكتمل' ? 'bg-green-500' :
                      status === 'ملغي' ? 'bg-red-500' : 'bg-amber-500'
                    }>
                      {status}
                    </Badge>
                    <span className="text-white">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}