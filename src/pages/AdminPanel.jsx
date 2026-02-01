import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Lock, Users, Heart, DollarSign, BarChart3, 
  Plus, Trash2, Edit, Eye, Search, RefreshCw,
  TrendingUp, UserCheck, Baby, Gift
} from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_PASSWORD = '3219@';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('stats');
  const queryClient = useQueryClient();

  // التحقق من كلمة السر
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('تم تسجيل الدخول بنجاح');
    } else {
      toast.error('كلمة السر غير صحيحة');
    }
  };

  // جلب البيانات
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => base44.entities.User.list(),
    enabled: isAuthenticated,
  });

  const { data: orphans = [] } = useQuery({
    queryKey: ['admin-orphans'],
    queryFn: () => base44.entities.Orphan.list(),
    enabled: isAuthenticated,
  });

  const { data: donations = [] } = useQuery({
    queryKey: ['admin-donations'],
    queryFn: () => base44.entities.Donation.list(),
    enabled: isAuthenticated,
  });

  const { data: analytics = [] } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => base44.entities.ContentAnalytics.list(),
    enabled: isAuthenticated,
  });

  // حذف يتيم
  const deleteOrphanMutation = useMutation({
    mutationFn: (id) => base44.entities.Orphan.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orphans']);
      toast.success('تم الحذف بنجاح');
    },
  });

  // حذف تبرع
  const deleteDonationMutation = useMutation({
    mutationFn: (id) => base44.entities.Donation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-donations']);
      toast.success('تم الحذف بنجاح');
    },
  });

  // الإحصائيات
  const stats = {
    totalUsers: users.length,
    totalOrphans: orphans.length,
    sponsoredOrphans: orphans.filter(o => o.is_sponsored).length,
    totalDonations: donations.length,
    totalAmount: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
    completedDonations: donations.filter(d => d.status === 'مكتمل').length,
    totalPlays: analytics.reduce((sum, a) => sum + (a.action === 'play' ? 1 : 0), 0),
  };

  // صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4" dir="rtl">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">لوحة التحكم</CardTitle>
            <p className="text-slate-400">أدخل كلمة السر للوصول</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="كلمة السر"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Button 
              onClick={handleLogin} 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600"
            >
              دخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
            <p className="text-slate-400">إدارة التطبيق والبيانات</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
            className="border-red-500/50 text-red-400"
          >
            تسجيل الخروج
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm">المستخدمين</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-600/20 to-pink-700/20 border-pink-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                  <Baby className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-pink-200 text-sm">الأيتام</p>
                  <p className="text-2xl font-bold text-white">{stats.totalOrphans}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-700/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-green-200 text-sm">التبرعات</p>
                  <p className="text-2xl font-bold text-white">{stats.totalDonations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-600/20 to-amber-700/20 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-amber-200 text-sm">إجمالي المبالغ</p>
                  <p className="text-2xl font-bold text-white">{stats.totalAmount} AED</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-800 border-slate-700 mb-6">
            <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="orphans">الأيتام</TabsTrigger>
            <TabsTrigger value="donations">التبرعات</TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    ملخص النشاط
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">مرات التشغيل</span>
                    <span className="text-white font-bold">{stats.totalPlays}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">الأيتام المكفولين</span>
                    <span className="text-white font-bold">{stats.sponsoredOrphans}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">التبرعات المكتملة</span>
                    <span className="text-white font-bold">{stats.completedDonations}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    كفالة الأيتام
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className="text-5xl font-bold text-pink-400 mb-2">
                      {stats.sponsoredOrphans}/{stats.totalOrphans}
                    </div>
                    <p className="text-slate-400">يتيم مكفول</p>
                    <div className="w-full bg-slate-700 rounded-full h-3 mt-4">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full"
                        style={{ width: `${stats.totalOrphans ? (stats.sponsoredOrphans / stats.totalOrphans) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">قائمة المستخدمين ({users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.full_name || 'بدون اسم'}</p>
                          <p className="text-slate-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <Badge className={user.role === 'admin' ? 'bg-amber-500' : 'bg-slate-600'}>
                        {user.role || 'user'}
                      </Badge>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-center text-slate-400 py-8">لا يوجد مستخدمين</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orphans Tab */}
          <TabsContent value="orphans">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">قائمة الأيتام ({orphans.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orphans.map(orphan => (
                    <div key={orphan.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                          <Baby className="w-5 h-5 text-pink-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{orphan.name}</p>
                          <p className="text-slate-400 text-sm">{orphan.age} سنة - {orphan.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={orphan.is_sponsored ? 'bg-green-500' : 'bg-slate-600'}>
                          {orphan.is_sponsored ? 'مكفول' : 'غير مكفول'}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteOrphanMutation.mutate(orphan.id)}
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {orphans.length === 0 && (
                    <p className="text-center text-slate-400 py-8">لا يوجد أيتام مسجلين</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">قائمة التبرعات ({donations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {donations.map(donation => (
                    <div key={donation.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Gift className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{donation.donor_name || 'متبرع مجهول'}</p>
                          <p className="text-slate-400 text-sm">{donation.donation_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 font-bold">{donation.amount} {donation.currency}</span>
                        <Badge className={
                          donation.status === 'مكتمل' ? 'bg-green-500' :
                          donation.status === 'ملغي' ? 'bg-red-500' : 'bg-amber-500'
                        }>
                          {donation.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteDonationMutation.mutate(donation.id)}
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {donations.length === 0 && (
                    <p className="text-center text-slate-400 py-8">لا يوجد تبرعات</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}