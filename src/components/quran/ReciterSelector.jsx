import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mic, Volume2, Check, Search, Star, Globe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const RECITERS = [
  { id: 'afasy', name: 'مشاري راشد العفاسي', country: '🇰🇼', style: 'مرتل', featured: true },
  { id: 'husary', name: 'محمود خليل الحصري', country: '🇪🇬', style: 'معلم', featured: true },
  { id: 'minshawi', name: 'محمد صديق المنشاوي', country: '🇪🇬', style: 'مجود', featured: true },
  { id: 'abdulbasit', name: 'عبد الباسط عبد الصمد', country: '🇪🇬', style: 'مجود', featured: true },
  { id: 'sudais', name: 'عبد الرحمن السديس', country: '🇸🇦', style: 'مرتل', featured: true },
  { id: 'shuraim', name: 'سعود الشريم', country: '🇸🇦', style: 'مرتل', featured: false },
  { id: 'ghamadi', name: 'سعد الغامدي', country: '🇸🇦', style: 'مرتل', featured: false },
  { id: 'alajmi', name: 'أحمد العجمي', country: '🇸🇦', style: 'مرتل', featured: false },
  { id: 'maher', name: 'ماهر المعيقلي', country: '🇸🇦', style: 'مرتل', featured: true },
  { id: 'tablawi', name: 'محمد الطبلاوي', country: '🇪🇬', style: 'مجود', featured: false },
  { id: 'banna', name: 'محمود علي البنا', country: '🇪🇬', style: 'مجود', featured: false },
  { id: 'jibreen', name: 'عبد الله الجبرين', country: '🇸🇦', style: 'مرتل', featured: false },
];

export default function ReciterSelector({ selectedReciter, onReciterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStyle, setFilterStyle] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  const currentReciter = RECITERS.find(r => r.id === selectedReciter) || RECITERS[0];

  const filteredReciters = RECITERS.filter(reciter => {
    const matchesSearch = reciter.name.includes(searchQuery);
    const matchesStyle = filterStyle === 'all' || reciter.style === filterStyle;
    return matchesSearch && matchesStyle;
  });

  const handleSelect = (id) => {
    onReciterChange(id);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white hover:bg-emerald-50">
          <Mic className="w-4 h-4 text-emerald-600" />
          <span className="font-bold">{currentReciter.name}</span>
          <Badge variant="secondary" className="text-xs">{currentReciter.style}</Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Mic className="w-6 h-6 text-emerald-600" />
            اختر القارئ
          </DialogTitle>
        </DialogHeader>
        
        {/* Search & Filter */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="ابحث عن قارئ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'مرتل', 'مجود', 'معلم'].map((style) => (
              <Button
                key={style}
                variant={filterStyle === style ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStyle(style)}
                className={filterStyle === style ? "bg-emerald-600" : ""}
              >
                {style === 'all' ? 'الكل' : style}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Reciters */}
        {filterStyle === 'all' && !searchQuery && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500" />
              القراء المميزون
            </p>
            <div className="flex flex-wrap gap-2">
              {RECITERS.filter(r => r.featured).map(reciter => (
                <Badge
                  key={reciter.id}
                  variant={selectedReciter === reciter.id ? "default" : "outline"}
                  className={`cursor-pointer ${selectedReciter === reciter.id ? 'bg-emerald-600' : 'hover:bg-emerald-50'}`}
                  onClick={() => handleSelect(reciter.id)}
                >
                  {reciter.country} {reciter.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* All Reciters List */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {filteredReciters.map(reciter => (
            <Card
              key={reciter.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedReciter === reciter.id
                  ? 'bg-emerald-50 border-2 border-emerald-500'
                  : 'hover:bg-gray-50 border'
              }`}
              onClick={() => handleSelect(reciter.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedReciter === reciter.id ? 'bg-emerald-600' : 'bg-emerald-100'
                  }`}>
                    <Volume2 className={`w-5 h-5 ${selectedReciter === reciter.id ? 'text-white' : 'text-emerald-700'}`} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{reciter.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{reciter.country}</span>
                      <Badge variant="secondary" className="text-xs">{reciter.style}</Badge>
                    </div>
                  </div>
                </div>
                {selectedReciter === reciter.id && (
                  <Check className="w-5 h-5 text-emerald-600" />
                )}
                {reciter.featured && selectedReciter !== reciter.id && (
                  <Star className="w-4 h-4 text-amber-400" />
                )}
              </div>
            </Card>
          ))}
          
          {filteredReciters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>لم يتم العثور على قراء</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}