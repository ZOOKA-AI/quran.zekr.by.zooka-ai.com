import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DeleteAccount() {
  const [confirmed, setConfirmed] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirmed) {
      toast.error('يرجى تأكيد حذف الحساب');
      return;
    }

    setDeleting(true);
    try {
      const user = await base44.auth.me();
      await base44.entities.User.delete(user.id);
      await base44.auth.logout();
      toast.success('تم حذف حسابك بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الحساب');
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-red-50 to-white" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowRight className="w-5 h-5 ml-2" />
          العودة
        </Button>

        <Card className="border-red-200 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">حذف الحساب</h1>
                <p className="text-gray-600">إجراء دائم لا يمكن التراجع عنه</p>
              </div>
            </div>

            <Alert className="mb-6 border-red-300 bg-red-50">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <AlertDescription className="text-red-800 mr-2">
                <strong>تحذير:</strong> حذف حسابك سيؤدي إلى:
                <ul className="list-disc mr-6 mt-2 space-y-1">
                  <li>حذف جميع بياناتك الشخصية نهائياً</li>
                  <li>فقدان جميع المفضلات والإشارات المرجعية</li>
                  <li>إلغاء جميع الاشتراكات والخدمات</li>
                  <li>عدم القدرة على استرجاع أي معلومات</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-4 mb-6">
              <h3 className="font-bold text-gray-900">البدائل المتاحة:</h3>
              <div className="space-y-3">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong>تعطيل الإشعارات:</strong> يمكنك إيقاف جميع الإشعارات من الإعدادات
                  </p>
                </Card>
                <Card className="p-4 bg-green-50 border-green-200">
                  <p className="text-sm text-gray-700">
                    <strong>الخصوصية:</strong> راجع إعدادات الخصوصية لديك للتحكم في بياناتك
                  </p>
                </Card>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-start gap-3 mb-6">
                <Checkbox
                  id="confirm"
                  checked={confirmed}
                  onCheckedChange={setConfirmed}
                  className="mt-1"
                />
                <label htmlFor="confirm" className="text-sm text-gray-700 cursor-pointer">
                  أفهم أن حذف حسابي إجراء نهائي ولا يمكن التراجع عنه. أوافق على حذف جميع بياناتي بشكل دائم.
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={!confirmed || deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? (
                    <>جاري الحذف...</>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 ml-2" />
                      حذف حسابي نهائياً
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          هل تواجه مشكلة؟ <a href="mailto:info@zooka-ai.com" className="text-blue-600 hover:underline">تواصل مع الدعم</a>
        </p>
      </div>
    </div>
  );
}