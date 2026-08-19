import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Send, Users, User, Clock, CheckCircle, Info, AlertTriangle, Gift } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationSender() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target_type: 'all',
    notification_type: 'info',
    target_emails: []
  });
  const [selectedEmail, setSelectedEmail] = useState('');
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['notification-users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => base44.entities.AdminNotification.list('-created_date', 20),
  });

  const sendMutation = useMutation({
    mutationFn: async (data) => {
      // حفظ الإشعار
      const notification = await base44.entities.AdminNotification.create({
        ...data,
        is_sent: true,
        sent_at: new Date().toISOString()
      });

      // إرسال بريد إلكتروني للمستهدفين
      const targetUsers = data.target_type === 'all' 
        ? users 
        : users.filter(u => data.target_emails.includes(u.email));

      for (const user of targetUsers) {
        try {
          await base44.integrations.Core.SendEmail({
            to: user.email,
            subject: data.title,
            body: `
              <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #059669;">${data.title}</h2>
                <p style="font-size: 16px; line-height: 1.8;">${data.message}</p>
                <hr style="margin: 20px 0; border-color: #e5e7eb;" />
                <p style="color: #6b7280; font-size: 12px;">تطبيق القرآن الكريم</p>
              </div>
            `
          });
        } catch {
          console.error('Error sending to', user.email);
        }
      }

      return notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-notifications']);
      setFormData({ title: '', message: '', target_type: 'all', notification_type: 'info', target_emails: [] });
      toast.success('تم إرسال الإشعار بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ في الإرسال');
    }
  });

  const handleAddEmail = () => {
    if (selectedEmail && !formData.target_emails.includes(selectedEmail)) {
      setFormData({ ...formData, target_emails: [...formData.target_emails, selectedEmail] });
      setSelectedEmail('');
    }
  };

  const handleRemoveEmail = (email) => {
    setFormData({ ...formData, target_emails: formData.target_emails.filter(e => e !== email) });
  };

  const handleSend = () => {
    if (!formData.title || !formData.message) {
      toast.error('يرجى ملء العنوان والرسالة');
      return;
    }
    if (formData.target_type === 'specific' && formData.target_emails.length === 0) {
      toast.error('يرجى اختيار مستخدم واحد على الأقل');
      return;
    }
    sendMutation.mutate(formData);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'promotion': return <Gift className="w-4 h-4 text-purple-400" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* نموذج إرسال الإشعار */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" />
            إرسال إشعار جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-sm mb-1 block">العنوان</label>
              <Input
                placeholder="عنوان الإشعار"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-1 block">نوع الإشعار</label>
              <Select 
                value={formData.notification_type} 
                onValueChange={(v) => setFormData({ ...formData, notification_type: v })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">معلومات</SelectItem>
                  <SelectItem value="success">نجاح</SelectItem>
                  <SelectItem value="warning">تحذير</SelectItem>
                  <SelectItem value="promotion">عرض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1 block">الرسالة</label>
            <Textarea
              placeholder="نص الرسالة..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1 block">الاستهداف</label>
            <Select 
              value={formData.target_type} 
              onValueChange={(v) => setFormData({ ...formData, target_type: v })}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    جميع المستخدمين
                  </div>
                </SelectItem>
                <SelectItem value="specific">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    مستخدمين محددين
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.target_type === 'specific' && (
            <div>
              <label className="text-slate-300 text-sm mb-1 block">اختر المستخدمين</label>
              <div className="flex gap-2 mb-2">
                <Select value={selectedEmail} onValueChange={setSelectedEmail}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white flex-1">
                    <SelectValue placeholder="اختر مستخدم" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.email}>
                        {user.full_name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddEmail} className="bg-emerald-600">إضافة</Button>
              </div>
              
              {formData.target_emails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.target_emails.map(email => (
                    <Badge 
                      key={email} 
                      className="bg-slate-600 cursor-pointer hover:bg-red-500"
                      onClick={() => handleRemoveEmail(email)}
                    >
                      {email} ✕
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button 
            onClick={handleSend} 
            disabled={sendMutation.isPending}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600"
          >
            {sendMutation.isPending ? 'جاري الإرسال...' : (
              <>
                <Send className="w-4 h-4 ml-2" />
                إرسال الإشعار
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* سجل الإشعارات */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            سجل الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-slate-400 text-center py-8">لا توجد إشعارات سابقة</p>
          ) : (
            <div className="space-y-3">
              {notifications.map(notif => (
                <div key={notif.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(notif.notification_type)}
                      <span className="text-white font-medium">{notif.title}</span>
                    </div>
                    <Badge className={notif.is_sent ? 'bg-green-500' : 'bg-amber-500'}>
                      {notif.is_sent ? 'تم الإرسال' : 'في الانتظار'}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{notif.message}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{notif.target_type === 'all' ? 'الكل' : `${notif.target_emails?.length || 0} مستخدم`}</span>
                    {notif.sent_at && (
                      <span>{new Date(notif.sent_at).toLocaleString('ar')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}