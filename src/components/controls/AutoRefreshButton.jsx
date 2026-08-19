import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function AutoRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const handleAutoRefresh = async () => {
    setIsRefreshing(true);
    
    // تحديث جميع البيانات المخزنة مؤقتاً
    await queryClient.invalidateQueries();
    
    // إعادة تحميل الصفحة الحالية
    window.location.reload();
    
    setIsRefreshing(false);
  };

  return (
    <Button
      onClick={handleAutoRefresh}
      disabled={isRefreshing}
      className="fixed bottom-24 left-6 z-40 gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold shadow-2xl animate-pulse"
      size="lg"
    >
      <Zap className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : 'animate-bounce'}`} />
      {isRefreshing ? 'جاري التحديث...' : 'تحديث فوري'}
    </Button>
  );
}