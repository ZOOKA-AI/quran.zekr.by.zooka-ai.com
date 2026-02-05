import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Bell, Clock, BookOpen, Sun, Moon, Sunrise, Volume2, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// توليد قائمة الأوقات
const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      const time = `${hour}:${minute}`;
      const period = h < 12 ? 'ص' : 'م';
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const label = `${displayHour}:${minute} ${period}`;
      options.push({ value: time, label });
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

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
  const [notificationStatus, setNotificationStatus] = useState('unknown');
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // كشف نظام iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);

    // تحميل الإعدادات المحفوظة
    const saved = localStorage.getItem('quran-notification-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing settings:', e);
      }
    }

    // فحص حالة الإشعارات
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = () => {
    if (!('Notification' in window)) {
      setNotificationStatus('unsupported');
    } else if (Notification.permission === 'granted') {
      setNotificationStatus('granted');
    } else if (Notification.permission === 'denied') {
      setNotificationStatus('denied');
    } else {
      setNotificationStatus('default');
    }
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('quran-notification-settings', JSON.stringify(newSettings));
  };

  const saveSettings = () => {
    localStorage.setItem('quran-notification-settings', JSON.stringify(settings));
    toast.success('تم حفظ الإعدادات بنجاح! ✅');
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('متصفحك لا يدعم الإشعارات');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      checkNotificationStatus();
      
      if (permission === 'granted') {
        toast.success('تم تفعيل الإشعارات! 🔔');
        // إرسال إشعار تجريبي
        new Notification('القرآن الكريم', {
          body: 'تم تفعيل الإشعارات بنجاح 🤲',
          icon: '/icon-192x192.png'
        });
      } else if (permission === 'denied') {
        toast.error('تم رفض إذن الإشعارات - يمكنك تغييرها من إعدادات المتصفح');
      }
    } catch (error) {
      toast.error('حدث خطأ في طلب الإذن');
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

        {/* iOS Notice */}
        {isIOS && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">ملاحظة لمستخدمي iOS</h3>
                <p className="text-amber-100 text-sm leading-relaxed">
                  للحصول على الإشعارات على iPhone أو iPad:
                </p>
                <ol className="text-amber-100 text-sm mt-2 space-y-1 list-decimal mr-4">
                  <li>اضغط على زر المشاركة (أسفل الشاشة)</li>
                  <li>اختر "إضافة إلى الشاشة الرئيسية"</li>
                  <li>افتح التطبيق من الشاشة الرئيسية</li>
                  <li>سيُطلب منك السماح بالإشعارات</li>
                </ol>
              </div>
            </div>
          </Card>
        )}

        {/* Permission Card */}
        <Card className={`p-6 mb-6 ${
          notificationStatus === 'granted' 
            ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
            : notificationStatus === 'denied'
            ? 'bg-gradient-to-r from-red-500 to-rose-600'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
        } text-white`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                {notificationStatus === 'granted' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Bell className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {notificationStatus === 'granted' && 'الإشعارات مفعلة ✓'}
                  {notificationStatus === 'denied' && 'الإشعارات مرفوضة'}
                  {notificationStatus === 'default' && 'تفعيل الإشعارات'}
                  {notificationStatus === 'unsupported' && 'غير مدعوم'}
                  {notificationStatus === 'unknown' && 'تفعيل الإشعارات'}
                </h3>
                <p className="text-white/80 text-sm">
                  {notificationStatus === 'granted' && 'ستصلك التذكيرات في مواعيدها'}
                  {notificationStatus === 'denied' && 'غيّر الإعدادات من المتصفح'}
                  {notificationStatus === 'default' && 'اسمح للتطبيق بإرسال تذكيرات'}
                  {notificationStatus === 'unsupported' && 'متصفحك لا يدعم الإشعارات'}
                </p>
              </div>
            </div>
            {notificationStatus !== 'granted' && notificationStatus !== 'unsupported' && (
              <Button 
                onClick={requestNotificationPermission} 
                variant="secondary" 
                className="bg-white text-gray-800 hover:bg-gray-100"
              >
                {notificationStatus === 'denied' ? 'إعادة المحاولة' : 'تفعيل'}
              </Button>
            )}
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
              <Select 
                value={settings.morningTime} 
                onValueChange={(value) => updateSetting('morningTime', value)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="اختر الوقت" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select 
                value={settings.eveningTime} 
                onValueChange={(value) => updateSetting('eveningTime', value)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="اختر الوقت" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <Link to={createPageUrl('Tilawa')}>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              الذهاب للتلاوات
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}