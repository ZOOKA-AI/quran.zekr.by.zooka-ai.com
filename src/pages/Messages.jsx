import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mail, Heart, BookOpen, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';
import IslamicBackground from '@/components/layout/IslamicBackground';

export default function MessagesPage() {
  const [newMessage, setNewMessage] = useState({ recipient_email: '', message_type: 'reminder', subject: '', content: '' });
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: receivedMessages = [] } = useQuery({
    queryKey: ['receivedMessages', user?.email],
    queryFn: () => base44.entities.DawahMessage.filter({ recipient_email: user.email }),
    enabled: isAuthenticated,
    initialData: [],
  });

  const { data: sentMessages = [] } = useQuery({
    queryKey: ['sentMessages', user?.email],
    queryFn: () => base44.entities.DawahMessage.filter({ created_by: user.email }),
    enabled: isAuthenticated,
    initialData: [],
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data) => base44.entities.DawahMessage.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sentMessages'] });
      setNewMessage({ recipient_email: '', message_type: 'reminder', subject: '', content: '' });
      toast.success('تم إرسال الرسالة بنجاح! 💌');
    },
  });

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }
    if (!newMessage.recipient_email || !newMessage.content) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }
    sendMessageMutation.mutate(newMessage);
  };

  const messageTypeColors = {
    reminder: 'from-blue-500 to-indigo-600',
    dawah: 'from-emerald-500 to-green-600',
    encouragement: 'from-purple-500 to-pink-600',
    dua: 'from-amber-500 to-orange-600',
  };

  const messageTypeIcons = {
    reminder: <BookOpen className="w-5 h-5" />,
    dawah: <Sparkles className="w-5 h-5" />,
    encouragement: <Heart className="w-5 h-5" />,
    dua: <Heart className="w-5 h-5" />,
  };

  if (!isAuthenticated) {
    return (
      <IslamicBackground variant="default">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-12 text-center bg-slate-900/60 backdrop-blur-xl border border-blue-500/20">
            <Mail className="w-16 h-16 mx-auto text-blue-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-amber-100">يرجى تسجيل الدخول</h2>
            <p className="text-slate-400">للوصول إلى الرسائل الدعوية</p>
          </Card>
        </div>
      </IslamicBackground>
    );
  }

  return (
    <IslamicBackground variant="default">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* الرأس */}
        <div className="text-center mb-12 pt-8">
          <div className="mb-6">
            <div className="inline-block p-5 bg-gradient-to-br from-blue-500/20 to-indigo-600/10 rounded-3xl backdrop-blur-sm border border-blue-400/20">
              <Mail className="w-14 h-14 text-blue-300" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-amber-100 mb-3">الرسائل الدعوية</h1>
          <p className="text-xl text-indigo-200 font-arabic">﴿ وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ ﴾</p>
          <p className="text-slate-300 mt-2">شارك الخير والتذكير مع إخوانك المسلمين 🤲</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* إرسال رسالة */}
          <Card className="p-6 bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 h-fit">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-200">
              <Send className="w-5 h-5 text-blue-400" />
              إرسال رسالة جديدة
            </h3>
            <div className="space-y-4">
              <Input
                placeholder="البريد الإلكتروني للمستلم"
                value={newMessage.recipient_email}
                onChange={(e) => setNewMessage({ ...newMessage, recipient_email: e.target.value })}
                className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-slate-400"
              />
              <select
                value={newMessage.message_type}
                onChange={(e) => setNewMessage({ ...newMessage, message_type: e.target.value })}
                className="w-full p-3 border border-blue-500/30 rounded-lg bg-slate-800/50 text-white"
              >
                <option value="reminder">تذكير</option>
                <option value="dawah">دعوة</option>
                <option value="encouragement">تشجيع</option>
                <option value="dua">دعاء</option>
              </select>
              <Input
                placeholder="الموضوع"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-slate-400"
              />
              <Textarea
                placeholder="نص الرسالة..."
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                className="min-h-[150px] bg-slate-800/50 border-blue-500/30 text-white placeholder:text-slate-400"
              />
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-sm text-amber-200">
                  ⚠️ <strong>ملاحظة:</strong> يرجى التأكد من محتوى الرسالة ومراعاة الأدب الإسلامي والاحترام
                </p>
              </div>
              <Button
                onClick={handleSendMessage}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={sendMessageMutation.isPending}
              >
                <Send className="w-4 h-4 ml-2" />
                إرسال الرسالة
              </Button>
            </div>
          </Card>

          {/* الرسائل الواردة */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-amber-200">
              <Mail className="w-5 h-5 text-blue-400" />
              الرسائل الواردة ({receivedMessages.length})
            </h3>
            {receivedMessages.length === 0 ? (
              <Card className="p-12 text-center bg-slate-900/60 backdrop-blur-xl border border-blue-500/20">
                <Mail className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                <p className="text-slate-400">لا توجد رسائل واردة</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {receivedMessages.map((msg) => (
                  <Card key={msg.id} className={`p-4 bg-gradient-to-br ${messageTypeColors[msg.message_type]} text-white border-0`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        {messageTypeIcons[msg.message_type]}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{msg.subject || 'رسالة دعوية'}</p>
                        <p className="text-sm opacity-90">من: {msg.created_by}</p>
                      </div>
                    </div>
                    <p className="text-white/90 leading-relaxed">{msg.content}</p>
                    <p className="text-xs opacity-75 mt-2">
                      {new Date(msg.created_date).toLocaleString('ar')}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* الرسائل المرسلة */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-amber-200">
            <Send className="w-5 h-5 text-blue-400" />
            الرسائل المرسلة ({sentMessages.length})
          </h3>
          {sentMessages.length === 0 ? (
            <Card className="p-12 text-center bg-slate-900/60 backdrop-blur-xl border border-blue-500/20">
              <Send className="w-16 h-16 mx-auto text-blue-400 mb-4" />
              <p className="text-slate-400">لم ترسل أي رسائل بعد</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {sentMessages.map((msg) => (
                <Card key={msg.id} className="p-4 bg-slate-900/60 backdrop-blur-xl border border-blue-500/20">
                  <div className="flex items-start gap-3 mb-2">