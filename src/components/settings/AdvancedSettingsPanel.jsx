import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Settings, Keyboard, Shield, Bell, Zap, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const KEYBOARD_SHORTCUTS = {
  play_pause: 'Space',
  next_surah: 'ArrowRight',
  prev_surah: 'ArrowLeft',
  volume_up: 'ArrowUp',
  volume_down: 'ArrowDown'
};

export default function AdvancedSettingsPanel() {
  const [settings, setSettings] = useState({});
  const [shortcuts, setShortcuts] = useState(KEYBOARD_SHORTCUTS);
  const [listeningKey, setListeningKey] = useState(null);
  const queryClient = useQueryClient();
  const user = base44.auth.me();

  // جلب المعينات
  const { data: userPrefs } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: async () => {
      try {
        const u = await user;
        const prefs = await base44.entities.UserPreferences.filter({ user_id: u.id });
        return prefs?.[0] || {};
      } catch {
        return {};
      }
    }
  });

  // جلب السجلات
  const { data: systemLogs = [] } = useQuery({
    queryKey: ['system-logs'],
    queryFn: async () => {
      try {
        return await base44.entities.SystemLog.filter({}, '-created_date', 50);
      } catch {
        return [];
      }
    }
  });

  // تحديث المعينات
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings) => {
      const u = await user;
      if (userPrefs?.id) {
        return await base44.entities.UserPreferences.update(userPrefs.id, newSettings);
      } else {
        return await base44.entities.UserPreferences.create({
          user_id: u.id,
          ...newSettings
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      toast.success('تم حفظ المعينات بنجاح');
    }
  });

  useEffect(() => {
    if (userPrefs) {
      setSettings(userPrefs);
      if (userPrefs.keyboard_shortcuts) {
        setShortcuts(userPrefs.keyboard_shortcuts);
      }
    }
  }, [userPrefs]);

  const handleKeyCapture = (shortcutKey) => {
    return (e) => {
      e.preventDefault();
      const key = e.code || e.key;
      setShortcuts(prev => ({
        ...prev,
        [shortcutKey]: key
      }));
      setListeningKey(null);
      toast.success(`تم تحديث الاختصار إلى ${key}`);
    };
  };

  const handleSaveSettings = () => {
    const updated = {
      ...settings,
      keyboard_shortcuts: shortcuts
    };
    updateSettingsMutation.mutate(updated);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-900/80 border border-slate-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-emerald-600">
            <Settings className="w-4 h-4 ml-2" />
            عام
          </TabsTrigger>
          <TabsTrigger value="shortcuts" className="data-[state=active]:bg-blue-600">
            <Keyboard className="w-4 h-4 ml-2" />
            اختصارات
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-purple-600">
            <Shield className="w-4 h-4 ml-2" />
            خصوصية
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-yellow-600">
            <Bell className="w-4 h-4 ml-2" />
            إشعارات
          </TabsTrigger>
        </TabsList>

        {/* تبويب عام */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-slate-900/60 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-emerald-200">الإعدادات العامة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* حجم الخط */}
                <div className="space-y-3">
                  <label className="text-white font-medium">حجم الخط</label>
                  <Slider
                    value={[settings.font_size || 16]}
                    onValueChange={(val) => setSettings({...settings, font_size: val[0]})}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-slate-400">{settings.font_size || 16}px</p>
                </div>

                {/* نمط الخط */}
                <div className="space-y-3">
                  <label className="text-white font-medium">نمط الخط</label>
                  <Select value={settings.font_style || 'uthmani'}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uthmani">عثماني</SelectItem>
                      <SelectItem value="indopak">هندو-باكستاني</SelectItem>
                      <SelectItem value="simplified">مبسط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* جودة الصوت */}
                <div className="space-y-3">
                  <label className="text-white font-medium">جودة الصوت</label>
                  <Select value={settings.audio_quality || '192kbps'}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="128kbps">128 Kbps (سريع)</SelectItem>
                      <SelectItem value="192kbps">192 Kbps (متوازن)</SelectItem>
                      <SelectItem value="320kbps">320 Kbps (عالي الجودة)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* التشغيل التلقائي */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <label className="text-white font-medium">التشغيل التلقائي</label>
                  <Switch
                    checked={settings.auto_play || false}
                    onCheckedChange={(checked) => setSettings({...settings, auto_play: checked})}
                  />
                </div>

                {/* التحديث التلقائي */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <label className="text-white font-medium">التحديث التلقائي</label>
                  <Switch
                    checked={settings.auto_update_enabled !== false}
                    onCheckedChange={(checked) => setSettings({...settings, auto_update_enabled: checked})}
                  />
                </div>

                {/* تخزين مؤقت API */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <label className="text-white font-medium">تخزين مؤقت للـ API</label>
                  <Switch
                    checked={settings.api_cache_enabled !== false}
                    onCheckedChange={(checked) => setSettings({...settings, api_cache_enabled: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* تبويب الاختصارات */}
        <TabsContent value="shortcuts" className="space-y-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-slate-900/60 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-blue-200">اختصارات لوحة المفاتيح</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(shortcuts).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                    onKeyDown={listeningKey === key ? handleKeyCapture(key) : null}
                  >
                    <label className="text-white font-medium">
                      {key === 'play_pause' && 'تشغيل / إيقاف مؤقت'}
                      {key === 'next_surah' && 'السورة التالية'}
                      {key === 'prev_surah' && 'السورة السابقة'}
                      {key === 'volume_up' && 'زيادة مستوى الصوت'}
                      {key === 'volume_down' && 'تقليل مستوى الصوت'}
                    </label>
                    <Button
                      variant={listeningKey === key ? 'default' : 'outline'}
                      onClick={() => setListeningKey(listeningKey === key ? null : key)}
                      className={listeningKey === key ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      <Badge className="mr-2 bg-slate-700">{value}</Badge>
                      {listeningKey === key ? 'استمع...' : 'تغيير'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* تبويب الخصوصية */}
        <TabsContent value="privacy" className="space-y-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-slate-900/60 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-purple-200">إعدادات الخصوصية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <label className="text-white font-medium">مشاركة إحصائيات الاستماع</label>
                  <Switch
                    checked={settings.privacy_settings?.share_listening_stats || false}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      privacy_settings: {...(settings.privacy_settings || {}), share_listening_stats: checked}
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <label className="text-white font-medium">مشاركة الإشارات المرجعية</label>
                  <Switch
                    checked={settings.privacy_settings?.share_bookmarks || false}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      privacy_settings: {...(settings.privacy_settings || {}), share_bookmarks: checked}
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <label className="text-white font-medium">السماح بالتوصيات</label>
                  <Switch
                    checked={settings.privacy_settings?.allow_recommendations !== false}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      privacy_settings: {...(settings.privacy_settings || {}), allow_recommendations: checked}
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* تبويب الإشعارات */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-slate-900/60 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-yellow-200">إعدادات الإشعارات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <label className="text-white font-medium">تفعيل الإشعارات</label>
                  <Switch
                    checked={settings.notifications_enabled !== false}
                    onCheckedChange={(checked) => setSettings({...settings, notifications_enabled: checked})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-white font-medium">وقت التذكير اليومي</label>
                  <Input
                    type="time"
                    value={settings.daily_reminder_time || '09:00'}
                    onChange={(e) => setSettings({...settings, daily_reminder_time: e.target.value})}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* زر الحفظ */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
        <Button
          onClick={handleSaveSettings}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Save className="w-4 h-4 ml-2" />
          حفظ المعينات
        </Button>
        <Button
          variant="outline"
          className="border-slate-600"
          onClick={() => setSettings(userPrefs || {})}
        >
          <RotateCcw className="w-4 h-4 ml-2" />
          إعادة تعيين
        </Button>
      </motion.div>

      {/* السجلات النظام */}
      {systemLogs.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-slate-900/60 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-200">
                <Zap className="w-5 h-5" />
                سجلات النظام
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto">
              {systemLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="p-3 bg-slate-800/50 rounded-lg text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{log.action}</span>
                    <Badge className={log.status === 'success' ? 'bg-green-600' : 'bg-red-600'}>
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-xs">
                    {new Date(log.created_date).toLocaleString('ar-SA')}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}