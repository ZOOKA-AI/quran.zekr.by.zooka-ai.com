import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sun, Moon, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const DAILY_REMINDERS = [
  {
    id: 'morning',
    time: '06:00',
    icon: Sun,
    title: '☀️ أذكار الصباح',
    message: 'ابدأ يومك بذكر الله 🌸',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'quran',
    time: '09:00',
    icon: BookOpen,
    title: '📖 وردك من القرآن',
    message: 'حان وقت قراءة القرآن الكريم',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'evening',
    time: '18:00',
    icon: Moon,
    title: '🌙 أذكار المساء',
    message: 'دقائق مع أذكار المساء 🤍',
    color: 'from-indigo-500 to-purple-600'
  }
];

export default function DailyReminders() {
  const [showReminder, setShowReminder] = useState(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      DAILY_REMINDERS.forEach(reminder => {
        if (currentTime === reminder.time && !showReminder) {
          setShowReminder(reminder);
          toast.success(reminder.message);
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [enabled, showReminder]);

  if (!showReminder) return null;

  const Icon = showReminder.icon;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5" dir="rtl">
      <Card className={`bg-gradient-to-r ${showReminder.color} text-white shadow-2xl border-none max-w-sm`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{showReminder.title}</h3>
              <p className="text-white/90 mb-4">{showReminder.message}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-white text-gray-800 hover:bg-gray-100"
                  onClick={() => setShowReminder(null)}
                >
                  حسناً
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  onClick={() => {
                    setShowReminder(null);
                    setEnabled(false);
                    toast.info('تم إيقاف التذكيرات لهذه الجلسة');
                  }}
                >
                  إيقاف
                </Button>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-white/20 text-white h-8 w-8"
              onClick={() => setShowReminder(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}