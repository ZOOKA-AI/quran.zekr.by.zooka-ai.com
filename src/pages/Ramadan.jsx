import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, BookOpen, Clock, Bell, Gift, Star, Heart, Music2, Calendar, Utensils, Coffee, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import EgyptianRamadanPlayer from '@/components/ramadan/EgyptianRamadanPlayer';
import { motion } from 'framer-motion';

const RAMADAN_DUAS = [
  { id: 1, title: 'دعاء الإفطار', text: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ العُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ', time: 'عند الإفطار' },
  { id: 2, title: 'دعاء السحور', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ أَنْ تَغْفِرَ لِي', time: 'عند السحور' },
  { id: 3, title: 'دعاء ليلة القدر', text: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ العَفْوَ فَاعْفُ عَنِّي', time: 'العشر الأواخر' },
  { id: 4, title: 'دعاء القيام', text: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ المُتَطَهِّرِينَ', time: 'صلاة التراويح' },
];

const RAMADAN_NASHEED = [
  { 
    id: 1, 
    title: 'وحوي يا وحوي', 
    artist: 'أغنية شعبية مصرية', 
    duration: '3:45',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  { 
    id: 2, 
    title: 'رمضان جانا', 
    artist: 'التراث المصري', 
    duration: '4:20',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  { 
    id: 3, 
    title: 'طلع البدر علينا', 
    artist: 'نشيد إسلامي', 
    duration: '5:00',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  { 
    id: 4, 
    title: 'أهلاً يا رمضان', 
    artist: 'مشاري العفاسي', 
    duration: '4:30',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  { 
    id: 5, 
    title: 'ياما في الليالي', 
    artist: 'أم كلثوم (روحاني)', 
    duration: '6:15',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
];

const DAILY_GOALS = [
  { id: 1, title: 'قراءة جزء من القرآن', icon: BookOpen, points: 100 },
  { id: 2, title: 'صلاة التراويح', icon: Moon, points: 50 },
  { id: 3, title: 'الصدقة اليومية', icon: Heart, points: 75 },
  { id: 4, title: 'أذكار الصباح والمساء', icon: Sun, points: 30 },
  { id: 5, title: 'قيام الليل', icon: Star, points: 100 },
];

export default function Ramadan() {
  const [completedGoals, setCompletedGoals] = useState([]);
  const [ramadanDay, setRamadanDay] = useState(1);
  const [timeToIftar, setTimeToIftar] = useState('');
  const [timeToSuhoor, setTimeToSuhoor] = useState('');

  useEffect(() => {
    // حساب الوقت المتبقي (تقريبي)
    const updateTimes = () => {
      const now = new Date();
      const iftarTime = new Date();
      iftarTime.setHours(18, 30, 0); // وقت الإفطار التقريبي
      
      const suhoorTime = new Date();
      suhoorTime.setHours(4, 30, 0); // وقت السحور التقريبي
      
      if (now < iftarTime) {
        const diff = iftarTime - now;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        setTimeToIftar(`${hours}:${minutes.toString().padStart(2, '0')}`);
      } else {
        setTimeToIftar('حان وقت الإفطار!');
      }
    };
    
    updateTimes();
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleGoal = (goalId) => {
    setCompletedGoals(prev => 
      prev.includes(goalId) ? prev.filter(id => id !== goalId) : [...prev, goalId]
    );
  };

  const totalPoints = DAILY_GOALS.filter(g => completedGoals.includes(g.id))
    .reduce((sum, g) => sum + g.points, 0);

  const progressPercentage = (completedGoals.length / DAILY_GOALS.length) * 100;

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden" dir="rtl">
      {/* خلفية مصرية روحانية */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900 via-orange-800 to-red-900" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='1'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z' fill-opacity='0.1'/%3E%3Cpath d='M40 0h40v40H40V0z' fill-opacity='0.15'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-50/95 via-amber-50/90 to-yellow-50/95" />
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-20 w-40 h-40 bg-orange-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header بطابع مصري */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="w-28 h-28 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-amber-200"
            >
              <Moon className="w-14 h-14 text-white drop-shadow-lg" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 text-4xl"
            >
              ✨
            </motion.div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 mb-2 drop-shadow-lg">
            🌙 رمضان كريم 🕌
          </h1>
          <p className="text-2xl text-amber-800 font-bold mb-2">أهلاً وحوي يا رمضان</p>
          <p className="text-orange-700 text-lg font-arabic">شهر الرحمة والمغفرة والبركة • روح مصر الأصيلة</p>
          <Badge className="mt-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-lg px-6 py-2 shadow-lg">
            اليوم {ramadanDay} من رمضان المبارك
          </Badge>
        </motion.div>

        {/* Time Cards بطابع مصري */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-orange-600 via-red-500 to-pink-600 text-white shadow-2xl border-2 border-amber-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
            <CardContent className="p-6 text-center relative z-10">
              <div className="mb-2 text-3xl">🥘</div>
              <Utensils className="w-12 h-12 mx-auto mb-3 drop-shadow-lg" />
              <p className="text-sm font-bold mb-1">الباقي على الإفطار</p>
              <p className="text-4xl font-bold drop-shadow-lg">{timeToIftar}</p>
              <p className="text-xs opacity-90 mt-2">⏰ استعد للمدفع يا معلم</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl border-2 border-blue-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
            <CardContent className="p-6 text-center relative z-10">
              <div className="mb-2 text-3xl">☕</div>
              <Coffee className="w-12 h-12 mx-auto mb-3 drop-shadow-lg" />
              <p className="text-sm font-bold mb-1">موعد السحور</p>
              <p className="text-4xl font-bold drop-shadow-lg">4:30 ص</p>
              <p className="text-xs opacity-90 mt-2">🎺 اصحى يا نايم وحد الدايم</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
        <Card className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 shadow-2xl border-2 border-amber-300">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-xl">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Star className="w-6 h-6 drop-shadow-lg" />
                <span className="drop-shadow-lg">الأهداف اليومية • الحسنات</span>
              </span>
              <Badge className="bg-white text-amber-700 font-bold text-lg shadow-lg">{totalPoints} نقطة ✨</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>التقدم اليومي</span>
                <span>{completedGoals.length}/{DAILY_GOALS.length}</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
            <div className="space-y-3">
              {DAILY_GOALS.map(goal => {
                const Icon = goal.icon;
                const isCompleted = completedGoals.includes(goal.id);
                return (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      isCompleted ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                        {goal.title}
                      </span>
                    </div>
                    <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-green-500" : ""}>
                      +{goal.points}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Tabs Section */}
        <Tabs defaultValue="duas" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-4 bg-gradient-to-r from-amber-200 to-orange-200 p-1 h-auto">
            <TabsTrigger value="duas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white py-3 text-base font-bold">
              🤲 أدعية
            </TabsTrigger>
            <TabsTrigger value="nasheed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white py-3 text-base font-bold">
              🎵 أناشيد
            </TabsTrigger>
            <TabsTrigger value="quran" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white py-3 text-base font-bold">
              📖 ختمة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="duas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RAMADAN_DUAS.map(dua => (
                <Card key={dua.id} className="bg-gradient-to-br from-purple-50 to-indigo-50">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-purple-600">{dua.time}</Badge>
                    </div>
                    <h3 className="font-bold text-purple-800 mb-2">{dua.title}</h3>
                    <p className="text-lg font-arabic leading-loose text-gray-800">{dua.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nasheed">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-amber-900">🎵 أغاني رمضان المصرية الأصيلة</h3>
                </div>
                <p className="text-amber-800">استمع لأجمل أغاني وأناشيد رمضان بروح مصرية • وحوي يا وحوي</p>
              </div>

              <div className="mb-6">
                <EgyptianRamadanPlayer playlist={RAMADAN_NASHEED} />
              </div>

              <div className="space-y-3">
                {RAMADAN_NASHEED.map((nasheed, index) => (
                  <motion.div
                    key={nasheed.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all border-2 border-amber-200 bg-gradient-to-r from-orange-50 to-amber-50">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Music2 className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-amber-900 text-lg">{nasheed.title}</p>
                            <p className="text-sm text-orange-700">{nasheed.artist} • {nasheed.duration}</p>
                          </div>
                        </div>
                        <div className="text-2xl">🎵</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="quran">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-emerald-800 mb-2">ختمة رمضان</h3>
                <p className="text-gray-600 mb-4">اقرأ جزءاً يومياً لختم القرآن في رمضان</p>
                <div className="mb-4">
                  <Progress value={(ramadanDay / 30) * 100} className="h-4 mb-2" />
                  <p className="text-sm text-gray-500">الجزء {ramadanDay} من 30</p>
                </div>
                <Link to={createPageUrl('Quran')}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <BookOpen className="w-5 h-5 ml-2" />
                    ابدأ القراءة
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to={createPageUrl('Athkar')}>
            <Card className="hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <CardContent className="p-4 text-center">
                <Sun className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">الأذكار</p>
              </CardContent>
            </Card>
          </Link>
          <Link to={createPageUrl('Tawasheeh')}>
            <Card className="hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <CardContent className="p-4 text-center">
                <Music2 className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">الابتهالات</p>
              </CardContent>
            </Card>
          </Link>
          <Link to={createPageUrl('QuranRadio')}>
            <Card className="hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <CardContent className="p-4 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">الإذاعة</p>
              </CardContent>
            </Card>
          </Link>
          <Link to={createPageUrl('Orphans')}>
            <Card className="hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-red-500 to-pink-500 text-white">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">الصدقة</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}