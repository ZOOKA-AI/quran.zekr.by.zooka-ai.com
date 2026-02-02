import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, Moon, Bed, RefreshCw, Check, Volume2, VolumeX, Share2, Copy, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);

  const { data: allAthkar = [], isLoading } = useQuery({
    queryKey: ['athkar'],
    queryFn: () => base44.entities.Athkar.list('order'),
  });

  useEffect(() => {
    const saved = localStorage.getItem('athkar-progress');
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedAthkar(data.completed || {});
      setCounters(data.counters || {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('athkar-progress', JSON.stringify({
      completed: completedAthkar,
      counters: counters,
      date: new Date().toDateString()
    }));
  }, [completedAthkar, counters]);

  const speakText = (text, thikrId) => {
    if (!('speechSynthesis' in window)) {
      toast.error('المتصفح لا يدعم القراءة الصوتية');
      return;
    }

    if (currentSpeakingId === thikrId && isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      return;
    }

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingId(thikrId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      toast.error('حدث خطأ في القراءة');
    };

    speechSynthesis.speak(utterance);
  };

  const getAthkarList = () => {
    const categoryName = CATEGORY_MAP[selectedTab];
    const filtered = allAthkar.filter(a => a.category === categoryName);
    return filtered.map(a => ({
      id: a.id,
      text: a.text,
      count: a.count || 1,
      benefit: a.benefit,
      source: a.source
    }));
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
  const progressPercentage = athkarList.length > 0 ? (completedCount / athkarList.length) * 100 : 0;

  return (
    <div className="min-h-screen relative pb-24" dir="rtl">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/90 via-blue-950/95 to-slate-950/98" />
      </div>
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Sun className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">الأذكار اليومية</h1>
          <p className="text-cyan-200 text-lg">حصّن نفسك بذكر الله تعالى</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="mb-6 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 backdrop-blur-xl border-cyan-500/30 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-cyan-200 text-lg">تقدمك اليوم</span>
                <span className="text-cyan-300 text-xl font-bold">{completedCount}/{athkarList.length}</span>
              </div>
              <Progress value={progressPercentage} className="h-4 mb-4" />
              <Button 
                variant="outline" 
                onClick={resetProgress} 
                className="w-full border-cyan-400/50 text-cyan-200 hover:bg-cyan-500/20"
              >
                <RefreshCw className="w-5 h-5 ml-2" />
                إعادة تعيين التقدم
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
          </div>
        )}

        {!isLoading && (
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 mb-6 bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30">
            <TabsTrigger value="morning" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
              <Sun className="w-4 h-4 ml-2" />
              الصباح
            </TabsTrigger>
            <TabsTrigger value="evening" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Moon className="w-4 h-4 ml-2" />
              المساء
            </TabsTrigger>
            <TabsTrigger value="sleep" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
              <Bed className="w-4 h-4 ml-2" />
              النوم
            </TabsTrigger>
          </TabsList>

          {['morning', 'evening', 'sleep'].map(tab => (
            <TabsContent key={tab} value={tab}>
              {getAthkarList().length === 0 ? (
                <Card className="p-12 text-center bg-slate-900/60 backdrop-blur-xl border-cyan-500/30">
                  <Sparkles className="w-20 h-20 mx-auto text-cyan-400 mb-4" />
                  <p className="text-cyan-200 text-xl">لا توجد أذكار لهذا القسم حالياً</p>
                </Card>
              ) : (
              <div className="space-y-4">
                {getAthkarList().map((thikr, index) => {
                  const key = `${tab}-${thikr.id}`;
                  const currentCount = counters[key] || 0;
                  const isCompleted = completedAthkar[key];
                  const isThisSpeaking = currentSpeakingId === thikr.id && isSpeaking;
                  
                  return (
                    <motion.div
                      key={thikr.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`transition-all hover:shadow-2xl ${
                        isCompleted 
                          ? 'bg-gradient-to-br from-green-900/60 to-emerald-900/60 border-green-500/40' 
                          : 'bg-slate-900/60 border-cyan-500/30'
                      } backdrop-blur-xl`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <Badge className={isCompleted ? "bg-green-600 text-white" : "bg-cyan-600 text-white"}>
                              {isCompleted && <Check className="w-3 h-3 ml-1" />}
                              {currentCount}/{thikr.count}
                            </Badge>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className={`${isThisSpeaking ? 'bg-amber-500/20 text-amber-400' : 'text-cyan-300 hover:bg-cyan-500/20'}`}
                                onClick={() => speakText(thikr.text, thikr.id)}
                              >
                                {isThisSpeaking ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-cyan-300 hover:bg-cyan-500/20"
                                onClick={() => copyThikr(thikr.text)}
                              >
                                <Copy className="w-5 h-5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-cyan-300 hover:bg-cyan-500/20"
                                onClick={() => shareThikr(thikr.text)}
                              >
                                <Share2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                          
                          <p 
                            className={`text-xl md:text-2xl font-arabic leading-loose mb-4 cursor-pointer select-none ${
                              isCompleted ? 'text-green-200' : 'text-amber-100'
                            }`}
                            onClick={() => !isCompleted && incrementCounter(thikr.id, thikr.count)}
                          >
                            {thikr.text}
                          </p>
                          
                          {thikr.benefit && (
                            <div className="mb-4 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                              <p className="text-emerald-200 text-sm">✨ {thikr.benefit}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            {thikr.source && (
                              <p className="text-sm text-cyan-400">📖 {thikr.source}</p>
                            )}
                            {!isCompleted && (
                              <Button 
                                onClick={() => incrementCounter(thikr.id, thikr.count)}
                                size="lg"
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg"
                              >
                                سبّح ({thikr.count - currentCount})
                              </Button>
                            )}
                          </div>
                          
                          {thikr.count > 1 && (
                            <Progress 
                              value={(currentCount / thikr.count) * 100} 
                              className="h-3 mt-4" 
                            />
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
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