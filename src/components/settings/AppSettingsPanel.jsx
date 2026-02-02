import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings, Sun, Moon, Type, Volume2, Bell, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function AppSettingsPanel() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    theme: 'auto',
    language: 'ar',
    font_type: 'uthmani',
    font_size: 18,
    translation_enabled: true,
    translation_language: 'english',
    tafsir_enabled: false,
    audio_autoplay: false,
    default_reciter: 'ar.alafasy',
    notifications_enabled: true
  });

  // جلب الإعدادات
  const { data: savedSettings } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) return null;
      const user = await base44.auth.me();
      const results = await base44.entities.AppSettings.filter({ user_id: user.id });
      return results[0] || null;
    }
  });

  useEffect(() => {
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, [savedSettings]);

  // حفظ الإعدادات
  const saveMutation = useMutation({
    mutationFn: async (newSettings) => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        toast.error('يرجى تسجيل الدخول لحفظ الإعدادات');
        return;
      }
      const user = await base44.auth.me();
      
      if (savedSettings) {
        await base44.entities.AppSettings.update(savedSettings.id, newSettings);
      } else {
        await base44.entities.AppSettings.create({ ...newSettings, user_id: user.id });
      }
      toast.success('تم حفظ الإعدادات بنجاح');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    }
  });

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveMutation.mutate(newSettings);
  };

  return (
    <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-500/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-amber-400" />
        <h2 className="text-2xl font-bold text-white">إعدادات التطبيق</h2>
      </div>

      <div className="space-y-6">
        {/* السمة */}
        <div className="space-y-2">
          <Label className="text-emerald-200 flex items-center gap-2">
            <Sun className="w-4 h-4" />
            السمة
          </Label>
          <Select value={settings.theme} onValueChange={(v) => handleChange('theme', v)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">فاتح</SelectItem>
              <SelectItem value="dark">داكن</SelectItem>
              <SelectItem value="auto">تلقائي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* نوع الخط */}
        <div className="space-y-2">
          <Label className="text-emerald-200 flex items-center gap-2">
            <Type className="w-4 h-4" />
            نوع الخط
          </Label>
          <Select value={settings.font_type} onValueChange={(v) => handleChange('font_type', v)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uthmani">عثماني</SelectItem>
              <SelectItem value="indopak">هندي</SelectItem>
              <SelectItem value="simple">مبسط</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* حجم الخط */}
        <div className="space-y-2">
          <Label className="text-emerald-200">حجم الخط: {settings.font_size}px</Label>
          <Slider
            value={[settings.font_size]}
            onValueChange={(v) => handleChange('font_size', v[0])}
            min={14}
            max={32}
            step={2}
            className="py-4"
          />
        </div>

        {/* إظهار الترجمة */}
        <div className="flex items-center justify-between">
          <Label className="text-emerald-200">إظهار الترجمة</Label>
          <Switch
            checked={settings.translation_enabled}
            onCheckedChange={(v) => handleChange('translation_enabled', v)}
          />
        </div>

        {/* لغة الترجمة */}
        {settings.translation_enabled && (
          <div className="space-y-2">
            <Label className="text-emerald-200">لغة الترجمة</Label>
            <Select value={settings.translation_language} onValueChange={(v) => handleChange('translation_language', v)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">الإنجليزية</SelectItem>
                <SelectItem value="french">الفرنسية</SelectItem>
                <SelectItem value="urdu">الأوردية</SelectItem>
                <SelectItem value="indonesian">الإندونيسية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* إظهار التفسير */}
        <div className="flex items-center justify-between">
          <Label className="text-emerald-200">إظهار التفسير</Label>
          <Switch
            checked={settings.tafsir_enabled}
            onCheckedChange={(v) => handleChange('tafsir_enabled', v)}
          />
        </div>

        {/* القارئ الافتراضي */}
        <div className="space-y-2">
          <Label className="text-emerald-200 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            القارئ الافتراضي
          </Label>
          <Select value={settings.default_reciter} onValueChange={(v) => handleChange('default_reciter', v)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ar.alafasy">مشاري العفاسي</SelectItem>
              <SelectItem value="ar.abdulbasitmurattal">عبد الباسط عبد الصمد</SelectItem>
              <SelectItem value="ar.minshawi">محمد صديق المنشاوي</SelectItem>
              <SelectItem value="ar.husary">محمود خليل الحصري</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* التشغيل التلقائي */}
        <div className="flex items-center justify-between">
          <Label className="text-emerald-200">التشغيل التلقائي للصوت</Label>
          <Switch
            checked={settings.audio_autoplay}
            onCheckedChange={(v) => handleChange('audio_autoplay', v)}
          />
        </div>

        {/* الإشعارات */}
        <div className="flex items-center justify-between">
          <Label className="text-emerald-200 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            تفعيل الإشعارات
          </Label>
          <Switch
            checked={settings.notifications_enabled}
            onCheckedChange={(v) => handleChange('notifications_enabled', v)}
          />
        </div>
      </div>
    </Card>
  );
}