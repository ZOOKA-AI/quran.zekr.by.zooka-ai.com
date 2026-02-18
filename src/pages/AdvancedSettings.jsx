import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Volume2, Eye, Bell, Save, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const fontFamilies = {
  'Amiri': 'خط أميري (تقليدي)',
  'Noto Naskh Arabic': 'نسخ عربي',
  'Cairo': 'خط القاهرة (عصري)',
  'Scheherazade': 'شهرزاد'
};

const primaryColors = {
  '#059669': 'أخضر زمردي',
  '#0284c7': 'أزرق سماوي',
  '#7c3aed': 'بنفسجي',
  '#dc2626': 'أحمر',
  '#ea580c': 'برتقالي',
  '#0891b2': 'سماوي داكن'
};

export default function AdvancedSettings() {
  const queryClient = useQueryClient();
  const [hasChanges, setHasChanges] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['user-settings', user?.email],
    queryFn: async () => {
      if (!user) return null;
      const results = await base44.entities.UserSettings.filter({ created_by: user.email });
      return results[0] || null;
    },
    enabled: !!user
  });

  const [localSettings, setLocalSettings] = useState({
    theme: {
      primary_color: '#059669',
      font_family: 'Amiri',
      font_size: 24,
      dark_mode: false
    },
    audio: {
      playback_speed: 1.0,
      auto_play_next: false,
      repeat_mode: 'none'
    },
    display: {
      verse_layout: 'standard',
      show_translation: true,
      show_transliteration: false,
      show_tafsir: false,
      translation_language: 'english'
    },
    reminders: {
      prayer_reminders: true,
      quran_reading_reminder: true,
      morning_athkar: true,
      evening_athkar: true,
      reminder_time: '09:00'
    }
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        return await base44.entities.UserSettings.update(settings.id, data);
      } else {
        return await base44.entities.UserSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-settings']);
      setHasChanges(false);
      toast.success('تم حفظ الإعدادات بنجاح');
    },
    onError: (error) => {
      toast.error('فشل حفظ الإعدادات: ' + error.message);
    }
  });

  const updateSetting = (category, key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveMutation.mutate(localSettings);
  };

  const resetToDefaults = () => {
    setLocalSettings({
      theme: {
        primary_color: '#059669',
        font_family: 'Amiri',
        font_size: 24,
        dark_mode: false
      },
      audio: {
        playback_speed: 1.0,
        auto_play_next: false,
        repeat_mode: 'none'
      },
      display: {
        verse_layout: 'standard',
        show_translation: true,
        show_transliteration: false,
        show_tafsir: false,
        translation_language: 'english'
      },
      reminders: {
        prayer_reminders: true,
        quran_reading_reminder: true,
        morning_athkar: true,
        evening_athkar: true,
        reminder_time: '09:00'
      }
    });
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">⚙️ الإعدادات المتقدمة</h1>
          <p className="text-slate-600">خصّص تجربتك في قراءة واستماع القرآن الكريم</p>
        </div>

        {/* Save Bar */}
        {hasChanges && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-600 text-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-bold">لديك تغييرات غير محفوظة</span>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-white text-emerald-600 hover:bg-emerald-50"
            >
              {saveMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
              حفظ التغييرات
            </Button>
          </div>
        )}

        <Tabs defaultValue="theme" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              المظهر
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              الصوت
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              العرض
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              التذكيرات
            </TabsTrigger>
          </TabsList>

          {/* Theme Settings */}
          <TabsContent value="theme" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🎨 إعدادات المظهر</CardTitle>
                <CardDescription>خصّص الألوان والخطوط حسب تفضيلاتك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Primary Color */}
                <div className="space-y-3">
                  <Label className="text-base font-bold">اللون الأساسي</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(primaryColors).map(([color, name]) => (
                      <button
                        key={color}
                        onClick={() => updateSetting('theme', 'primary_color', color)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          localSettings.theme.primary_color === color
                            ? 'border-slate-900 shadow-lg scale-105'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-full h-12 rounded-lg mb-2" style={{ backgroundColor: color }} />
                        <div className="text-sm font-medium text-slate-700">{name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Family */}
                <div className="space-y-3">
                  <Label className="text-base font-bold">نوع الخط</Label>
                  <Select
                    value={localSettings.theme.font_family}
                    onValueChange={(value) => updateSetting('theme', 'font_family', value)}
                  >
                    <SelectTrigger className="h-14">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(fontFamilies).map(([font, label]) => (
                        <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <Label className="text-base font-bold">حجم الخط: {localSettings.theme.font_size}px</Label>
                  <Slider
                    value={[localSettings.theme.font_size]}
                    onValueChange={([value]) => updateSetting('theme', 'font_size', value)}
                    min={16}
                    max={48}
                    step={2}
                    className="w-full"
                  />
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p
                      className="font-arabic"
                      style={{
                        fontFamily: localSettings.theme.font_family,
                        fontSize: `${localSettings.theme.font_size}px`
                      }}
                    >
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  </div>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="text-base font-bold">الوضع الداكن</Label>
                    <p className="text-sm text-slate-600">تفعيل الثيم الداكن (قريباً)</p>
                  </div>
                  <Switch
                    checked={localSettings.theme.dark_mode}
                    onCheckedChange={(checked) => updateSetting('theme', 'dark_mode', checked)}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Settings */}
          <TabsContent value="audio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🔊 إعدادات الصوت</CardTitle>
                <CardDescription>تحكم في سرعة التلاوة والتشغيل التلقائي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Playback Speed */}
                <div className="space-y-3">
                  <Label className="text-base font-bold">سرعة التلاوة: {localSettings.audio.playback_speed}x</Label>
                  <Slider
                    value={[localSettings.audio.playback_speed * 100]}
                    onValueChange={([value]) => updateSetting('audio', 'playback_speed', value / 100)}
                    min={50}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>0.5x (بطيء جداً)</span>
                    <span>1.0x (عادي)</span>
                    <span>2.0x (سريع جداً)</span>
                  </div>
                </div>

                {/* Auto Play Next */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="text-base font-bold">التشغيل التلقائي</Label>
                    <p className="text-sm text-slate-600">تشغيل السورة التالية تلقائياً</p>
                  </div>
                  <Switch
                    checked={localSettings.audio.auto_play_next}
                    onCheckedChange={(checked) => updateSetting('audio', 'auto_play_next', checked)}
                  />
                </div>

                {/* Repeat Mode */}
                <div className="space-y-3">
                  <Label className="text-base font-bold">وضع التكرار</Label>
                  <Select
                    value={localSettings.audio.repeat_mode}
                    onValueChange={(value) => updateSetting('audio', 'repeat_mode', value)}
                  >
                    <SelectTrigger className="h-14">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون تكرار</SelectItem>
                      <SelectItem value="verse">تكرار الآية</SelectItem>
                      <SelectItem value="surah">تكرار السورة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Settings */}
          <TabsContent value="display" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>👁️ إعدادات العرض</CardTitle>
                <CardDescription>اختر طريقة عرض الآيات والترجمة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Verse Layout */}
                <div className="space-y-3">
                  <Label className="text-base font-bold">نمط العرض</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => updateSetting('display', 'verse_layout', 'standard')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        localSettings.display.verse_layout === 'standard'
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold mb-1">عادي</div>
                      <div className="text-xs text-slate-600">قائمة تقليدية</div>
                    </button>
                    <button
                      onClick={() => updateSetting('display', 'verse_layout', 'mushaf')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        localSettings.display.verse_layout === 'mushaf'
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold mb-1">مصحف</div>
                      <div className="text-xs text-slate-600">صفحات المصحف</div>
                    </button>
                    <button
                      onClick={() => updateSetting('display', 'verse_layout', 'list')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        localSettings.display.verse_layout === 'list'
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold mb-1">قائمة</div>
                      <div className="text-xs text-slate-600">آيات متتالية</div>
                    </button>
                  </div>
                </div>

                {/* Translation Language */}
                <div className="space-y-3">
                  <Label className="text-base font-bold">لغة الترجمة</Label>
                  <Select
                    value={localSettings.display.translation_language}
                    onValueChange={(value) => updateSetting('display', 'translation_language', value)}
                  >
                    <SelectTrigger className="h-14">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">الإنجليزية</SelectItem>
                      <SelectItem value="french">الفرنسية</SelectItem>
                      <SelectItem value="urdu">الأوردية</SelectItem>
                      <SelectItem value="indonesian">الإندونيسية</SelectItem>
                      <SelectItem value="turkish">التركية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Display Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <Label className="text-base font-bold">إظهار الترجمة</Label>
                    <Switch
                      checked={localSettings.display.show_translation}
                      onCheckedChange={(checked) => updateSetting('display', 'show_translation', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <Label className="text-base font-bold">إظهار النطق بالإنجليزية</Label>
                    <Switch
                      checked={localSettings.display.show_transliteration}
                      onCheckedChange={(checked) => updateSetting('display', 'show_transliteration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <Label className="text-base font-bold">إظهار التفسير</Label>
                    <Switch
                      checked={localSettings.display.show_tafsir}
                      onCheckedChange={(checked) => updateSetting('display', 'show_tafsir', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reminders Settings */}
          <TabsContent value="reminders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🔔 إعدادات التذكيرات</CardTitle>
                <CardDescription>فعّل التذكيرات اليومية للصلاة والأذكار</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="text-base font-bold">تذكير مواقيت الصلاة</Label>
                      <p className="text-sm text-slate-600">تلقي إشعار قبل كل صلاة</p>
                    </div>
                    <Switch
                      checked={localSettings.reminders.prayer_reminders}
                      onCheckedChange={(checked) => updateSetting('reminders', 'prayer_reminders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="text-base font-bold">تذكير قراءة القرآن</Label>
                      <p className="text-sm text-slate-600">تذكير يومي لقراءة ورد القرآن</p>
                    </div>
                    <Switch
                      checked={localSettings.reminders.quran_reading_reminder}
                      onCheckedChange={(checked) => updateSetting('reminders', 'quran_reading_reminder', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="text-base font-bold">أذكار الصباح</Label>
                      <p className="text-sm text-slate-600">تذكير يومي بأذكار الصباح</p>
                    </div>
                    <Switch
                      checked={localSettings.reminders.morning_athkar}
                      onCheckedChange={(checked) => updateSetting('reminders', 'morning_athkar', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="text-base font-bold">أذكار المساء</Label>
                      <p className="text-sm text-slate-600">تذكير يومي بأذكار المساء</p>
                    </div>
                    <Switch
                      checked={localSettings.reminders.evening_athkar}
                      onCheckedChange={(checked) => updateSetting('reminders', 'evening_athkar', checked)}
                    />
                  </div>
                </div>

                {/* Reminder Time */}
                <div className="space-y-3">
                  <Label className="text-base font-bold">وقت التذكير</Label>
                  <Input
                    type="time"
                    value={localSettings.reminders.reminder_time}
                    onChange={(e) => updateSetting('reminders', 'reminder_time', e.target.value)}
                    className="h-14 text-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reset Button */}
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-red-900 mb-1">إعادة تعيين الإعدادات</h3>
                <p className="text-sm text-red-700">استعادة الإعدادات الافتراضية</p>
              </div>
              <Button
                onClick={resetToDefaults}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 ml-2" />
                إعادة التعيين
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}