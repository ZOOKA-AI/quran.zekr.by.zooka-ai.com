import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, BookOpen, Clock, Bell, Gift, Star, Heart, Music2, Calendar, Utensils, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const RAMADAN_DUAS = [
  { id: 1, title: 'دعاء الإفطار', text: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ العُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ', time: 'عند الإفطار' },
  { id: 2, title: 'دعاء السحور', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ أَنْ تَغْفِرَ لِي', time: 'عند السحور' },
  { id: 3, title: 'دعاء ليلة القدر', text: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ العَفْوَ فَاعْفُ عَنِّي', time: 'العشر الأواخر' },
  { id: 4, title: 'دعاء القيام', text: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ المُتَطَهِّرِينَ', time: 'صلاة التراويح' },
];

const RAMADAN_NASHEED = [
  { id: 1, title: 'رمضان أهلاً', artist: 'ماهر زين', duration: '4:30' },
  { id: 2, title: 'رمضان كريم', artist: 'سامي يوسف', duration: '5:15' },
  { id: 3, title: 'يا رمضان', artist: 'مشاري العفاسي', duration: '6:00' },
  { id: 4, title: 'أهلاً رمضان', artist: 'أحمد بو خاطر', duration: '4:45' },
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
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-purple-50 to-indigo-50" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Moon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-purple-800 mb-2">🌙 رمضان كريم</h1>
          <p className="text-purple-600 text-lg">شهر الرحمة والمغفرة والعتق من النار</p>
          <Badge className="mt-2 bg-purple-600 text-lg px-4 py-1">
            اليوم {ramadanDay} من رمضان
          </Badge>
        </div>

        {/* Time Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <CardContent className="p-6 text-center">
              <Utensils className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm opacity-90">المتبقي للإفطار</p>
              <p className="text-3xl font-bold">{timeToIftar}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Coffee className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm opacity-90">وقت السحور</p>
              <p className="text-3xl font-bold">4:30 ص</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Progress */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500" />
                الأهداف اليومية
              </span>
              <Badge className="bg-amber-500">{totalPoints} نقطة</Badge>
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

        {/* Tabs Section */}
        <Tabs defaultValue="duas" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="duas">🤲 أدعية</TabsTrigger>
            <TabsTrigger value="nasheed">🎵 أناشيد</TabsTrigger>
            <TabsTrigger value="quran">📖 ختمة</TabsTrigger>
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
            <div className="space-y-3">
              {RAMADAN_NASHEED.map(nasheed => (
                <Card key={nasheed.id} className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Music2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{nasheed.title}</p>
                        <p className="text-sm text-gray-500">{nasheed.artist} • {nasheed.duration}</p>
                      </div>
                    </div>
                    <Button size="icon" className="bg-purple-600 hover:bg-purple-700 rounded-full">
                      <span className="mr-0.5">▶</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
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