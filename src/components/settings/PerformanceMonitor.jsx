import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Activity, Zap, TrendingUp, AlertCircle } from 'lucide-react';

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    api_response_time: 0,
    cache_hit_rate: 0,
    user_engagement: 0,
    system_health: 'loading'
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['performance-logs'],
    queryFn: async () => {
      try {
        const data = await base44.entities.SystemLog.filter(
          { event_type: 'performance' },
          '-created_date',
          5
        );
        return data || [];
      } catch {
        return [];
      }
    },
    refetchInterval: 60000
  });

  useEffect(() => {
    if (logs.length > 0) {
      const latestLog = logs[0];
      if (latestLog.details) {
        setMetrics(latestLog.details);
      }
    }
  }, [logs]);

  const getHealthColor = (health) => {
    switch (health) {
      case 'healthy': return 'bg-green-600';
      case 'warning': return 'bg-yellow-600';
      case 'critical': return 'bg-red-600';
      default: return 'bg-blue-600';
    }
  };

  const getHealthLabel = (health) => {
    switch (health) {
      case 'healthy': return 'صحي';
      case 'warning': return 'تحذير';
      case 'critical': return 'حرج';
      default: return 'جاري التحميل';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* استجابة API */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-slate-900/60 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              استجابة API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {metrics.api_response_time || 0}
              <span className="text-sm text-slate-400 ml-1">ms</span>
            </div>
            <Badge className={metrics.api_response_time > 5000 ? 'bg-red-600' : 'bg-green-600'}>
              {metrics.api_response_time > 5000 ? 'بطيء' : 'سريع'}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      {/* معدل الكاش */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-900/60 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              معدل الكاش
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {typeof metrics.cache_hit_rate === 'number' ? metrics.cache_hit_rate.toFixed(1) : 0}
              <span className="text-sm text-slate-400 ml-1">%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(metrics.cache_hit_rate || 0, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* تفاعل المستخدم */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-900/60 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              التفاعل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {Math.round(metrics.user_engagement || 0)}
            </div>
            <Badge className="bg-blue-600">نشط</Badge>
          </CardContent>
        </Card>
      </motion.div>

      {/* صحة النظام */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-900/60 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              صحة النظام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {getHealthLabel(metrics.system_health)}
            </div>
            <Badge className={getHealthColor(metrics.system_health)}>
              {metrics.system_health === 'loading' ? 'جاري التحميل' : 'متابع'}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}