import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, Clock, Save, Sun, Moon, BookOpen, Heart } from 'lucide-react';
import { toast } from 'sonner';

const NOTIFICATION_TYPES = [
  {
    id: 'morning_adhkar',
    icon: Sun,
    title: 'أذكار الصباح',
    defaultTime: '06:00',
    enabled: true
  },
  {
    id: 'quran_reading',
    icon: BookOpen,
    title: 'تذكير القراءة اليومية',
    defaultTime: '09:00',
    enabled: true
  },
  {
    id: 'afternoon_dua',
    icon: Heart,
    title: 'دعاء منتصف اليوم',
    defaultTime: '12:00',
    enabled: true
  },
  {
    id: 'evening_adhkar',
    icon: Moon,
    title: 'أذكار المساء',
    defaultTime: '18:00',
    enabled: true
  },
  {
    id: 'night_reminder',
    icon: Moon,
    title: 'تذكير ما قبل النوم',
    defaultTime: '22:00',
    enabled: false
  }
];

export default function NotificationSettingsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATION_TYPES);

  const toggleNotification = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
    toast.success('تم تحديث الإعدادات ✓');
  };

  const updateTime = (id, time) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, defaultTime: time } : n
    ));
  };

  const saveSettings = () => {
    // Save to local storage or backend
    localStorage.setItem('notification_settings', JSON.stringify(notifications));
    toast.success('تم حفظ الإعدادات بنجاح! ✓');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Settings className="w-16 h-16 text-amber-300" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">⚙️ إعدادات الإشعارات</h1>
            <p className="text-xl text-emerald-100">تحكم في أوقات ونوعية التذكيرات اليومية</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 mb-8">
          <div className="p-6">
            <h3 className="text-xl font-bold text-blue-800 mb-2 flex items-center gap-2">
              <Bell className="w-6 h-6" />
              كيف تعمل التذكيرات؟
            </h3>
            <p className="text-gray-700 leading-relaxed">
              ستصلك تذكيرات لطيفة في الأوقات المحددة لمساعدتك على الاستمرار في أعمالك اليومية من قراءة القرآن والأذكار والأدعية. 
              يمكنك تفعيل أو إيقاف أي تذكير، وتغيير الوقت المناسب لك.
            </p>
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map(notification => {
            const Icon = notification.icon;
            return (
              <Card key={notification.id} className={`border-2 transition-all ${
                notification.enabled 
                  ? 'bg-white border-emerald-200 hover:border-emerald-400' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        notification.enabled 
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
                          : 'bg-gray-300'
                      }`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{notification.title}</h3>
                          {notification.enabled && (
                            <Badge className="bg-emerald-100 text-emerald-700">مفعّل</Badge>
                          )}
                        </div>
                        
                        {notification.enabled && (
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <Input
                              type="time"
                              value={notification.defaultTime}
                              onChange={(e) => updateTime(notification.id, e.target.value)}
                              className="w-32 h-8 text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleNotification(notification.id)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        notification.enabled ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          notification.enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={saveSettings}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-8 py-6 text-lg"
          >
            <Save className="w-5 h-5 ml-2" />
            حفظ الإعدادات
          </Button>
        </div>

        {/* Additional Tips */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 mt-8">
          <div className="p-6">
            <h3 className="text-xl font-bold text-amber-800 mb-3">💡 نصائح</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>اختر أوقات تكون فيها متفرغاً نسبياً للاستفادة القصوى من التذكيرات</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>يمكنك تفعيل إشعارات المتصفح للحصول على التذكيرات حتى عند إغلاق التطبيق</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>ابدأ بتذكير أو اثنين، ثم زِد تدريجياً حتى لا تشعر بالضغط</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}