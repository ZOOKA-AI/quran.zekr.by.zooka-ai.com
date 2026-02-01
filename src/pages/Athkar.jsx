import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, Moon, Bed, RefreshCw, Check, Volume2, Share2, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// تحويل الفئات
const CATEGORY_MAP = {
  'morning': 'أذكار الصباح',
  'evening': 'أذكار المساء',
  'sleep': 'أذكار النوم',
  'prayer': 'أذكار الصلاة',
  'general': 'أذكار متنوعة'
};

export default function Athkar() {
  const [selectedTab, setSelectedTab] = useState('morning');
  const [completedAthkar, setCompletedAthkar] = useState({});
  const [counters, setCounters] = useState({});

  // جلب الأذكار من قاعدة البيانات
  const { data: allAthkar = [], isLoading } = useQuery({
    queryKey: ['athkar'],
    queryFn: () => base44.entities.Athkar.list('order'),
  });

  useEffect(() => {
    // تحميل التقدم المحفوظ
    const saved = localStorage.getItem('athkar-progress');
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedAthkar(data.completed || {});
      setCounters(data.counters || {});
    }
  }, []);

  useEffect(() => {
    // حفظ التقدم
    localStorage.setItem('athkar-progress', JSON.stringify({
      completed: completedAthkar,
      counters: counters,
      date: new Date().toDateString()
    }));
  }, [completedAthkar, counters]);

  const getAthkarList = () => {
    const categoryName = CATEGORY_MAP[selectedTab];
    const filtered = allAthkar.filter(a => a.category === categoryName);
    return filtered.length > 0 ? filtered.map(a => ({
      id: a.id,
      text: a.text,
      count: a.count || 1,
      benefit: a.benefit,
      source: a.source
    })) : [];
  };

  const incrementCounter = (thikrId, maxCount) => {
    const key = `${selectedTab}-${thikrId}`;
    const currentCount = counters[key] || 0;
    
    if (currentCount < maxCount) {
      const newCount = currentCount + 1;
      setCounters(prev => ({ ...prev, [key]: newCount }));
      
      if (newCount === maxCount) {
        setCompletedAthkar(prev => ({ ...prev, [key]: true }));
        toast.success('✨ أحسنت! أتممت هذا الذكر');
      }
    }
  };

  const resetProgress = () => {
    setCompletedAthkar({});
    setCounters({});
    toast.info('تم إعادة تعيين التقدم');
  };

  const copyThikr = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('تم نسخ الذكر');
  };

  const shareThikr = async (text) => {
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      copyThikr(text);
    }
  };

  const athkarList = getAthkarList();
  const completedCount = athkarList.filter(t => completedAthkar[`${selectedTab}-${t.id}`]).length;
  const progressPercentage = (completedCount / athkarList.length) * 100;

  return (
    <div className="min-h-screen py-8 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Sun className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">الأذكار اليومية</h1>
          <p className="text-gray-600">حصّن نفسك بذكر الله</p>
        </div>

        {/* Progress */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-800">تقدمك اليوم</span>
              <span className="text-blue-600">{completedCount}/{athkarList.length}</span>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-3" />
            <Button variant="outline" size="sm" onClick={resetProgress} className="w-full">
              <RefreshCw className="w-4 h-4 ml-2" />
              إعادة تعيين
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Tabs */}
        {!isLoading && (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="morning" className="gap-2">
              <Sun className="w-4 h-4" />
              الصباح
            </TabsTrigger>
            <TabsTrigger value="evening" className="gap-2">
              <Moon className="w-4 h-4" />
              المساء
            </TabsTrigger>
            <TabsTrigger value="sleep" className="gap-2">
              <Bed className="w-4 h-4" />
              النوم
            </TabsTrigger>
          </TabsList>

          {['morning', 'evening', 'sleep'].map(tab => (
            <TabsContent key={tab} value={tab}>
              {getAthkarList().length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">لا توجد أذكار لهذا القسم حالياً</p>
                </Card>
              ) : (
              <div className="space-y-4">
                {getAthkarList().map(thikr => {
                  const key = `${tab}-${thikr.id}`;
                  const currentCount = counters[key] || 0;
                  const isCompleted = completedAthkar[key];
                  
                  return (
                    <Card 
                      key={thikr.id}
                      className={`transition-all ${isCompleted ? 'bg-green-50 border-green-300' : 'hover:shadow-md'}`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-green-500" : ""}>
                            {isCompleted ? <Check className="w-3 h-3 ml-1" /> : null}
                            {currentCount}/{thikr.count}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => copyThikr(thikr.text)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => shareThikr(thikr.text)}>
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p 
                          className="text-xl font-arabic leading-loose text-gray-800 mb-4 cursor-pointer select-none"
                          onClick={() => !isCompleted && incrementCounter(thikr.id, thikr.count)}
                        >
                          {thikr.text}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                            ✨ {thikr.benefit}
                          </p>
                          {!isCompleted && (
                            <Button 
                              onClick={() => incrementCounter(thikr.id, thikr.count)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              سبّح ({thikr.count - currentCount})
                            </Button>
                          )}
                        </div>
                        
                        {thikr.count > 1 && (
                          <Progress 
                            value={(currentCount / thikr.count) * 100} 
                            className="h-2 mt-3" 
                          />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        )}
      </div>
    </div>
  );
}