import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BookMarked, Settings, Mail, Calendar, Edit2, Save, X, RefreshCw, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import IslamicBackground from '@/components/layout/IslamicBackground';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch (error) {
        return null;
      }
    },
  });

  const { data: bookmarks = [], isLoading: bookmarksLoading } = useQuery({
    queryKey: ['userBookmarks'],
    queryFn: () => base44.entities.Bookmark.list('-created_date', 50),
    initialData: [],
  });

  const updateUserMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      toast.success('تم تحديث الملف الشخصي');
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setIsEditing(false);
    },
  });

  const handleStartEdit = () => {
    setEditedName(user?.full_name || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    updateUserMutation.mutate({ full_name: editedName });
  };

  const handleSalesforceSync = async () => {
    setIsSyncing(true);
    try {
      const response = await base44.functions.invoke('syncToSalesforce', {});
      if (response.data.success) {
        toast.success('تمت المزامنة مع Salesforce بنجاح! ✓');
      } else {
        toast.error('فشلت المزامنة - تحقق من الإعدادات');
      }
    } catch (error) {
      toast.error('خطأ في المزامنة مع Salesforce');
    } finally {
      setIsSyncing(false);
    }
  };

  if (userLoading) {
    return (
      <IslamicBackground variant="default">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-4 text-amber-200">جاري التحميل...</p>
          </div>
        </div>
      </IslamicBackground>
    );
  }

  return (
    <IslamicBackground variant="default">
      {/* الرأس */}
      <div className="relative text-white pt-8">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-5 bg-gradient-to-br from-emerald-500/20 to-green-600/10 rounded-3xl backdrop-blur-sm border border-emerald-400/20">
                <User className="w-14 h-14 text-emerald-300" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-amber-100">الملف الشخصي</h1>
            <p className="text-indigo-200">إدارة حسابك وإعداداتك</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <Tabs defaultValue="info" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-14 bg-slate-900/60 backdrop-blur-xl border-emerald-500/20">
            <TabsTrigger value="info" className="text-lg">
              <User className="w-4 h-4 ml-2" />
              المعلومات الشخصية
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="text-lg">
              <BookMarked className="w-4 h-4 ml-2" />
              المفضلات ({bookmarks.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-lg">
              <Settings className="w-4 h-4 ml-2" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* معلومات شخصية */}
          <TabsContent value="info">
            <Card className="shadow-lg bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20">
              <CardHeader className="border-b border-emerald-500/20 bg-slate-800/50">
                <CardTitle className="flex items-center justify-between text-amber-200">
                  <span>معلوماتك الشخصية</span>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={handleStartEdit} className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20">
                      <Edit2 className="w-4 h-4 ml-2" />
                      تعديل
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-slate-300">
                      <User className="w-4 h-4 text-emerald-400" />
                      الاسم الكامل
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="h-12 border border-emerald-500/30 bg-slate-800/50 text-white"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-amber-100 p-3 bg-slate-800/50 rounded-lg">
                        {user?.full_name || 'غير محدد'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      البريد الإلكتروني
                    </Label>
                    <p className="text-lg font-semibold text-amber-100 p-3 bg-slate-800/50 rounded-lg">
                      {user?.email || 'غير متاح'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-slate-300">
                      <Badge className="bg-emerald-600 border-0">الدور</Badge>
                    </Label>
                    <p className="text-lg font-semibold text-amber-100 p-3 bg-slate-800/50 rounded-lg">
                      {user?.role === 'admin' ? 'مشرف' : 'مستخدم'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      تاريخ التسجيل
                    </Label>
                    <p className="text-lg font-semibold text-amber-100 p-3 bg-slate-800/50 rounded-lg">
                      {user?.created_date ? new Date(user.created_date).toLocaleDateString('ar-EG') : 'غير متاح'}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="w-4 h-4 ml-2" />
                      حفظ التغييرات
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="border-slate-700 text-slate-300">
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* المفضلات */}
          <TabsContent value="bookmarks">
            <Card className="shadow-lg bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20">
              <CardHeader className="border-b border-emerald-500/20 bg-slate-800/50">
                <CardTitle className="flex items-center justify-between text-amber-200">
                  <span>الآيات المحفوظة</span>
                  <Badge className="bg-emerald-600 border-0">{bookmarks.length} آية</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {bookmarksLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
                  </div>
                ) : bookmarks.length === 0 ? (
                  <div className="text-center py-12">
                    <BookMarked className="w-16 h-16 mx-auto text-emerald-400 mb-4" />
                    <p className="text-slate-400 mb-4">لا توجد آيات محفوظة بعد</p>
                    <Link to={createPageUrl('Quran')}>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        ابدأ بتصفح القرآن
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookmarks.slice(0, 10).map((bookmark) => (
                      <div
                        key={bookmark.id}
                        className="p-4 bg-slate-800/50 rounded-lg border border-emerald-500/30 hover:border-emerald-400/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-2">
                            <Badge className="bg-emerald-600 border-0">
                              سورة {bookmark.surah_number}
                            </Badge>
                            <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                              آية {bookmark.verse_number}
                            </Badge>
                          </div>
                          <Link to={createPageUrl(`SurahView?surah=${bookmark.surah_number}`)}>
                            <Button variant="ghost" size="sm" className="text-emerald-300 hover:bg-emerald-500/20">
                              عرض
                            </Button>
                          </Link>
                        </div>
                        {bookmark.note && (
                          <p className="text-slate-300 mb-2 text-sm bg-amber-500/10 p-3 rounded border border-amber-500/30">
                            {bookmark.note}
                          </p>
                        )}
                        {bookmark.tags && bookmark.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {bookmark.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {bookmarks.length > 10 && (
                      <div className="text-center pt-4">
                        <Link to={createPageUrl('Bookmarks')}>
                          <Button variant="outline" className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20">
                            عرض جميع المفضلات ({bookmarks.length})
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* الإعدادات */}
          <TabsContent value="settings">
            <Card className="shadow-lg bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20">
              <CardHeader className="border-b border-emerald-500/20 bg-slate-800/50">
                <CardTitle className="text-amber-200">الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h3 className="font-bold text-blue-300 mb-2">🔒 الأمان والخصوصية</h3>
                    <p className="text-sm text-blue-200">
                      جميع بياناتك محمية ومشفرة بأعلى معايير الأمان
                    </p>
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <h3 className="font-bold text-amber-300 mb-2">📱 التفضيلات</h3>
                    <p className="text-sm text-amber-200">
                      إعدادات إضافية ستكون متاحة قريباً بإذن الله
                    </p>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h3 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
                      <Cloud className="w-5 h-5" />
                      مزامنة Salesforce CRM
                    </h3>
                    <p className="text-sm text-blue-200 mb-4">
                      مزامنة تقدمك القرآني ونشاطاتك مع نظام Salesforce CRM
                    </p>
                    <Button
                      onClick={handleSalesforceSync}
                      disabled={isSyncing}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                          جاري المزامنة...
                        </>
                      ) : (
                        <>
                          <Cloud className="w-4 h-4 ml-2" />
                          مزامنة الآن
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <Button
                      variant="outline"
                      className="w-full text-red-400 border-red-500/30 hover:bg-red-500/20"
                      onClick={() => base44.auth.logout()}
                    >
                      تسجيل الخروج
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </IslamicBackground>
  );
}