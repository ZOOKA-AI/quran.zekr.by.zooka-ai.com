import { Users, Heart, MessageCircle, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { icon: Users, label: 'مستخدم نشط', value: '10K+', color: 'from-blue-500 to-cyan-500' },
  { icon: Heart, label: 'إعجابات', value: '50K+', color: 'from-pink-500 to-rose-500' },
  { icon: MessageCircle, label: 'تعليقات', value: '25K+', color: 'from-purple-500 to-indigo-500' },
  { icon: Share2, label: 'مشاركات', value: '30K+', color: 'from-amber-500 to-orange-500' },
];

export default function CommunityStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition-all`}
          >
            <Icon className="w-6 h-6 mb-2" />
            <p className="text-sm opacity-90">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}