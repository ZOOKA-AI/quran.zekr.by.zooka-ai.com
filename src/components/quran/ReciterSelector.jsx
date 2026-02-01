import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const RECITERS = [
  { id: 'mishari_rashid', name: 'مشاري العفاسي', country: '🇰🇼' },
  { id: 'abdulbasit', name: 'عبد الباسط عبد الصمد', country: '🇪🇬' },
  { id: 'sudais', name: 'عبد الرحمن السديس', country: '🇸🇦' },
  { id: 'shuraim', name: 'سعود الشريم', country: '🇸🇦' },
  { id: 'husary', name: 'محمود خليل الحصري', country: '🇪🇬' },
  { id: 'minshawi', name: 'محمد صديق المنشاوي', country: '🇪🇬' },
  { id: 'ajmy', name: 'أحمد العجمي', country: '🇸🇦' },
  { id: 'ghamdi', name: 'سعد الغامدي', country: '🇸🇦' },
];

export default function ReciterSelector({ selectedReciter, onReciterChange }) {
  const currentReciter = RECITERS.find(r => r.id === selectedReciter) || RECITERS[0];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Mic className="w-4 h-4" />
          {currentReciter.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">اختر القارئ</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
          {RECITERS.map(reciter => (
            <Card
              key={reciter.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedReciter === reciter.id
                  ? 'bg-emerald-50 border-2 border-emerald-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onReciterChange(reciter.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{reciter.name}</p>
                    <p className="text-sm text-gray-600">{reciter.country}</p>
                  </div>
                </div>
                {selectedReciter === reciter.id && (
                  <Check className="w-5 h-5 text-emerald-600" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}