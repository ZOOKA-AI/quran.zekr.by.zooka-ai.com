import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BookMarked, Settings, Mail, Calendar, Edit2, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
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

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-block p-4 bg-white/10 rounded-full backdrop-blur-sm mb-4">
              <User className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold mb-2">الملف الشخصي</h1>
            <p className="text-emerald-100">إدارة حسابك وإعداداتك</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Tabs defaultValue="info" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-14">
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

          {/* Personal Info Tab */}
          <TabsContent value="info">
            <Card className="shadow-lg border-2 border-emerald-100">
              <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-white">
                <CardTitle className="flex items-center justify-between">
                  <span>معلوماتك الشخصية</span>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={handleStartEdit}>
                      <Edit2 className="w-4 h-4 ml-2" />
                      تعديل
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      الاسم الكامل
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="h-12 border-2"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                        {user?.full_name || 'غير محدد'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      البريد الإلكتروني
                    </Label>
                    <p className="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                      {user?.email || 'غير متاح'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Badge className="bg-emerald-600">الدور</Badge>
                    </Label>
                    <p className="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                      {user?.role === 'admin' ? 'مشرف' : 'مستخدم'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      تاريخ التسجيل
                    </Label>
                    <p className="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                      {user?.created_date ? new Date(user.created_date).toLocaleDateString('ar-EG') : 'غير متاح'}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="w-4 h-4 ml-2" />
                      حفظ التغييرات
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks">
            <Card className="shadow-lg border-2 border-emerald-100">
              <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-white">
                <CardTitle className="flex items-center justify-between">
                  <span>الآيات المحفوظة</span>
                  <Badge className="bg-emerald-600">{bookmarks.length} آية</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {bookmarksLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
                  </div>
                ) : bookmarks.length === 0 ? (
                  <div className="text-center py-12">
                    <BookMarked className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">لا توجد آيات محفوظة بعد</p>
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
                        className="p-4 bg-gradient-to-r from-emerald-50 to-white rounded-lg border border-emerald-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-2">
                            <Badge className="bg-emerald-600">
                              سورة {bookmark.surah_number}
                            </Badge>
                            <Badge variant="outline">
                              آية {bookmark.verse_number}
                            </Badge>
                          </div>
                          <Link to={createPageUrl(`SurahView?surah=${bookmark.surah_number}`)}>
                            <Button variant="ghost" size="sm">
                              عرض
                            </Button>
                          </Link>
                        </div>
                        {bookmark.note && (
                          <p className="text-gray-700 mb-2 text-sm bg-amber-50 p-3 rounded border border-amber-100">
                            {bookmark.note}
                          </p>
                        )}
                        {bookmark.tags && bookmark.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {bookmark.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
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
                          <Button variant="outline">
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

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="shadow-lg border-2 border-emerald-100">
              <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-white">
                <CardTitle>الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-bold text-blue-900 mb-2">🔒 الأمان والخصوصية</h3>
                    <p className="text-sm text-blue-800 mb-4">
                      جميع بياناتك محمية ومشفرة بأعلى معايير الأمان
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="font-bold text-amber-900 mb-2">📱 التفضيلات</h3>
                    <p className="text-sm text-amber-800">
                      إعدادات إضافية ستكون متاحة قريباً بإذن الله
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
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
    </div>
  );
}