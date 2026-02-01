import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings, Plus, Minus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const FONT_FAMILIES = [
  { value: 'amiri', label: 'خط أميري', className: 'font-[Amiri]' },
  { value: 'uthmanic', label: 'الخط العثماني', className: 'font-[KFGQPC_Uthmanic_Script_HAFS]' },
  { value: 'hafs', label: 'خط حفص', className: 'font-[Hafs]' },
  { value: 'naskh', label: 'خط النسخ', className: 'font-[Noto_Naskh_Arabic]' },
];

export default function ReadingSettings({ settings, onSettingsChange }) {
  const [fontSize, setFontSize] = useState(settings?.fontSize || 24);
  const [fontFamily, setFontFamily] = useState(settings?.fontFamily || 'amiri');
  const [lineHeight, setLineHeight] = useState(settings?.lineHeight || 2);

  useEffect(() => {
    onSettingsChange({ fontSize, fontFamily, lineHeight });
  }, [fontSize, fontFamily, lineHeight]);

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 48));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 16));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed left-6 top-24 z-40 shadow-lg">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">إعدادات القراءة</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* حجم الخط */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block">
              حجم الخط ({fontSize}px)
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseFontSize}
                className="flex-shrink-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
                min={16}
                max={48}
                step={2}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={increaseFontSize}
                className="flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div 
              className="mt-4 p-4 bg-emerald-50 rounded-lg text-center font-[Amiri]"
              style={{ fontSize: `${fontSize}px` }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          </div>

          {/* نوع الخط */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block">
              نوع الخط
            </label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span className={font.className}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div 
              className={`mt-4 p-4 bg-emerald-50 rounded-lg text-center ${
                FONT_FAMILIES.find(f => f.value === fontFamily)?.className
              }`}
              style={{ fontSize: '24px' }}
            >
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </div>
          </div>

          {/* المسافة بين الأسطر */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block">
              المسافة بين الأسطر ({lineHeight})
            </label>
            <Slider
              value={[lineHeight]}
              onValueChange={([value]) => setLineHeight(value)}
              min={1.5}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* إعادة تعيين */}
          <Button
            variant="outline"
            onClick={() => {
              setFontSize(24);
              setFontFamily('amiri');
              setLineHeight(2);
            }}
            className="w-full"
          >
            إعادة تعيين الإعدادات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}