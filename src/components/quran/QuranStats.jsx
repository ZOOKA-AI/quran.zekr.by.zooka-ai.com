import React from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, FileText, Layers, BookMarked } from 'lucide-react';

export default function QuranStats() {
  const stats = [
    { label: 'سورة', value: '114', icon: BookOpen, color: 'from-emerald-500 to-green-600' },
    { label: 'آية', value: '6,236', icon: FileText, color: 'from-amber-500 to-orange-600' },
    { label: 'جزء', value: '30', icon: Layers, color: 'from-blue-500 to-cyan-600' },
    { label: 'صفحة', value: '604', icon: BookMarked, color: 'from-purple-500 to-pink-600' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`bg-gradient-to-br ${stat.color} p-6 text-white border-0 shadow-xl hover:scale-105 transition-transform`}
          >
            <Icon className="w-8 h-8 mb-3 opacity-90" />
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm opacity-90">{stat.label}</p>
          </Card>
        );
      })}
    </div>
  );
}