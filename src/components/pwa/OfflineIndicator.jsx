import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { toast } from 'sonner';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('عاد الاتصال بالإنترنت! ✅', { duration: 3000 });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('لا يوجد اتصال بالإنترنت ⚠️', { duration: 5000 });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-amber-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
        <WifiOff className="w-5 h-5 animate-pulse" />
        <span className="font-bold">وضع عدم الاتصال</span>
      </div>
    </div>
  );
}