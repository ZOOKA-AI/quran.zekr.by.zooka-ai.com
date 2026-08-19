import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sun, Moon, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const REMINDERS = {
  morning: {
    time: '06:00',
    icon: Sun,
    title: '☀️ أذكار الصباح',
    message: 'ابدأ يومك بذكر الله 🌸',
    color: 'from-amber-400 to-orange-500'
  },
  afternoon: {
    time: '12:00',
    icon: BookOpen,
    title: '📖 وقت القراءة',
    message: 'خذ دقيقة واقرأ آية من القرآن',
    color: 'from-emerald-400 to-teal-500'
  },
  evening: {
    time: '18:00',
    icon: Moon,
    title: '🌙 أذكار المساء',
    message: 'لا تنسَ أذكار المساء 🤍',
    color: 'from-purple-400 to-indigo-500'
  }
};

export default function DailyReminders() {
  const [showReminder, setShowReminder] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [reminderEnabled, _setReminderEnabled] = useState(true);

  useEffect(() => {
    if (!reminderEnabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      Object.entries(REMINDERS).forEach(([_key, reminder]) => {
        if (currentTime === reminder.time) {
          setCurrentReminder(reminder);
          setShowReminder(true);
          
          // Show toast notification
          toast.info(reminder.title, {
            description: reminder.message,
            duration: 5000
          });
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [reminderEnabled]);

  const handleClose = () => {
    setShowReminder(false);
  };

  const handleSnooze = () => {
    setShowReminder(false);
    toast.success('سنذكرك مرة أخرى بعد 10 دقائق ⏰');
    
    setTimeout(() => {
      setShowReminder(true);
    }, 600000); // 10 minutes
  };

  if (!showReminder || !currentReminder) return null;

  const Icon = currentReminder.icon;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5" dir="rtl">
      <Card className={`bg-gradient-to-r ${currentReminder.color} border-none shadow-2xl max-w-sm`}>
        <div className="p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{currentReminder.title}</h3>
                <p className="text-white/90">{currentReminder.message}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleClose}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-none"
            >
              حسناً
            </Button>
            <Button
              onClick={handleSnooze}
              variant="outline"
              className="flex-1 bg-white text-gray-800 hover:bg-white/90 border-none"
            >
              ذكرني لاحقاً
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}