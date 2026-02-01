import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Bell, Clock, BookOpen, Sun, Moon, Sunrise, Volume2, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    morningReminder: true,
    morningTime: '06:00',
    eveningReminder: true,
    eveningTime: '18:00',
    fridayKahf: true,
    dailyVerse: true,
    soundEnabled: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('quran-notification-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('quran-notification-settings', JSON.stringify(settings));
    toast.success('تم حفظ الإعدادات بنجاح! ✅');
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('تم تفعيل الإشعارات! 🔔');
      } else {
        toast.error('تم رفض إذن الإشعارات');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50" dir="rtl">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full mb-4">
            <Bell className="w-5 h-5" />
            <span className="font-bold">إعدادات الإشعارات</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">تذكيرات الورد اليومي</h1>
          <p className="text-gray-600">اضبط تذكيراتك للمحافظة على ورد القرآن 🤲</p>
        </div>

        {/* Permission Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">تفعيل الإشعارات</h3>
                <p className="text-emerald-100 text-sm">اسمح للتطبيق بإرسال تذكيرات</p>
              </div>
            </div>
            <Button onClick={requestNotificationPermission} variant="secondary" className="bg-white text-emerald-700">
              تفعيل
            </Button>
          </div>
        </Card>

        {/* Morning Reminder */}
        <Card className="p-6 mb-4 bg-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Sunrise className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">أذكار الصباح والورد</h3>
                <p className="text-gray-500 text-sm">تذكير يومي صباحي</p>
              </div>
            </div>
            <Switch
              checked={settings.morningReminder}
              onCheckedChange={(checked) => setSettings({ ...settings, morningReminder: checked })}
            />
          </div>
          {settings.morningReminder && (
            <div className="flex items-center gap-3 mr-16">
              <Clock className="w-5 h-5 text-gray-400" />
              <Input
                type="time"
                value={settings.morningTime}
                onChange={(e) => setSettings({ ...settings, morningTime: e.target.value })}
                className="w-32"
              />
            </div>
          )}
        </Card>

        {/* Evening Reminder */}
        <Card className="p-6 mb-4 bg-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">أذكار المساء والورد</h3>
                <p className="text-gray-500 text-sm">تذكير يومي مسائي</p>
              </div>
            </div>
            <Switch
              checked={settings.eveningReminder}
              onCheckedChange={(checked) => setSettings({ ...settings, eveningReminder: checked })}
            />
          </div>
          {settings.eveningReminder && (
            <div className="flex items-center gap-3 mr-16">
              <Clock className="w-5 h-5 text-gray-400" />
              <Input
                type="time"
                value={settings.eveningTime}
                onChange={(e) => setSettings({ ...settings, eveningTime: e.target.value })}
                className="w-32"
              />
            </div>
          )}
        </Card>

        {/* Friday Kahf */}
        <Card className="p-6 mb-4 bg-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">تذكير سورة الكهف</h3>
                <p className="text-gray-500 text-sm">كل يوم جمعة</p>
              </div>
            </div>
            <Switch
              checked={settings.fridayKahf}
              onCheckedChange={(checked) => setSettings({ ...settings, fridayKahf: checked })}
            />
          </div>
        </Card>

        {/* Daily Verse */}
        <Card className="p-6 mb-4 bg-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">آية اليوم</h3>
                <p className="text-gray-500 text-sm">آية عشوائية يومياً</p>
              </div>
            </div>
            <Switch
              checked={settings.dailyVerse}
              onCheckedChange={(checked) => setSettings({ ...settings, dailyVerse: checked })}
            />
          </div>
        </Card>

        {/* Sound */}
        <Card className="p-6 mb-8 bg-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">صوت الإشعارات</h3>
                <p className="text-gray-500 text-sm">تشغيل صوت مع الإشعارات</p>
              </div>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, soundEnabled: checked })}
            />
          </div>
        </Card>

        {/* Save Button */}
        <Button onClick={saveSettings} className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 h-14 text-lg">
          حفظ الإعدادات
        </Button>

        {/* Offline Download Section */}
        <Card className="p-6 mt-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">التحميل للاستماع بدون إنترنت</h3>
              <p className="text-slate-400 text-sm">حمّل السور للاستماع بدون اتصال</p>
            </div>
          </div>
          <p className="text-slate-300 text-sm mb-4">
            يمكنك تحميل أي سورة من صفحة التلاوة بالضغط على زر التحميل بجانب المشغل
          </p>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
            الذهاب للتلاوات
          </Button>
        </Card>
      </div>
    </div>
  );
}