import { TrendingUp, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const trendingTopics = [
  { id: 1, title: 'تجويد القرآن', engagement: '2.3K', trend: '↑ 45%', icon: '🎵' },
  { id: 2, title: 'حفظ القرآن', engagement: '1.9K', trend: '↑ 32%', icon: '📖' },
  { id: 3, title: 'السيرة النبوية', engagement: '1.6K', trend: '↑ 28%', icon: '⭐' },
  { id: 4, title: 'فضائل الذكر', engagement: '1.4K', trend: '↑ 25%', icon: '🤲' },
  { id: 5, title: 'أيام من رمضان', engagement: '1.2K', trend: '↑ 18%', icon: '🌙' },
  { id: 6, title: 'قصص الأنبياء', engagement: '1.1K', trend: '↑ 15%', icon: '📚' },
];

export default function TrendingTopics() {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
        <TrendingUp className="w-8 h-8 text-amber-400" />
        الموضوعات الرائجة
      </h2>
      <p className="text-slate-400 mb-8">أكثر الموضوعات تفاعلاً في مجتمعنا</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 hover:border-pink-500/50 transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-3xl">{topic.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-bold text-white group-hover:text-pink-300 transition-colors truncate">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-slate-400 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {topic.engagement} تفاعل
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-400 flex-shrink-0 text-right">
                {topic.trend}
              </span>
            </div>
            <Button variant="outline" size="sm" className="w-full text-pink-300 border-pink-500/30 hover:border-pink-400">
              متابعة
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}