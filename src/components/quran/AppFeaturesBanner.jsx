import { Card } from '@/components/ui/card';

export default function AppFeaturesBanner() {
  const features = [
    { icon: '🤖', name: 'معلم ذكي', gradient: 'from-purple-50 to-purple-100 border-purple-200' },
    { icon: '📖', name: 'تفسير', gradient: 'from-emerald-50 to-emerald-100 border-emerald-200', opacity: 'opacity-25' },
    { icon: '🎧', name: 'تلاوات', gradient: 'from-amber-50 to-amber-100 border-amber-200' },
    { icon: '🎯', name: 'حفظ', gradient: 'from-blue-50 to-blue-100 border-blue-200' },
    { icon: '🤲', name: 'أذكار', gradient: 'from-pink-50 to-pink-100 border-pink-200' },
    { icon: '📻', name: 'راديو', gradient: 'from-cyan-50 to-cyan-100 border-cyan-200' },
    { icon: '🏆', name: 'إنجازات', gradient: 'from-indigo-50 to-indigo-100 border-indigo-200' },
    { icon: '📱', name: 'بدون نت', gradient: 'from-rose-50 to-rose-100 border-rose-200' }
  ];

  return (
    <Card className="bg-white/95 rounded-2xl p-4 max-w-4xl mx-auto shadow-lg border-2 border-amber-300">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          🌟 القرآن الكريم الذكي 🌟
        </h2>
        <p className="text-lg font-bold text-emerald-600">تطبيق شامل لخدمة كتاب الله</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br p-3 ${feature.opacity || ''} rounded-lg ${feature.gradient} border`}
          >
            <div className="text-2xl mb-1">{feature.icon}</div>
            <h3 className="text-sm font-bold text-gray-900">{feature.name}</h3>
          </div>
        ))}
      </div>
    </Card>
  );
}