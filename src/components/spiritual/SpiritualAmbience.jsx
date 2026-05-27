import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DUAS = [
  { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", source: "البقرة: 201" },
  { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", source: "طه: 25-26" },
  { arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً", source: "آل عمران: 8" },
  { arabic: "رَّبِّ زِدْنِي عِلْمًا", source: "طه: 114" },
  { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", source: "آل عمران: 173" },
  { arabic: "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ", source: "الأنبياء: 87" },
  { arabic: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ", source: "القصص: 24" },
];

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 4 + Math.random() * 6,
  size: 2 + Math.random() * 4,
}));

const STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 3,
  size: 1 + Math.random() * 2,
}));

export default function SpiritualAmbience() {
  const [currentDua, setCurrentDua] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const duaTimer = setInterval(() => {
      setCurrentDua(prev => (prev + 1) % DUAS.length);
    }, 8000);
    return () => clearInterval(duaTimer);
  }, []);

  const hours = time.getHours();
  const isNight = hours >= 20 || hours < 6;
  const isMorning = hours >= 6 && hours < 12;
  const isEvening = hours >= 17 && hours < 20;

  const greeting = isNight ? '🌙 ليلة مباركة' : isMorning ? '🌅 صباح النور' : isEvening ? '🌆 مساء الخير' : '☀️ يوم مبارك';

  const timeDisplay = time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative overflow-hidden rounded-3xl mb-8" style={{ minHeight: '420px' }}>
      {/* الخلفية الروحانية */}
      <div className={`absolute inset-0 ${isNight
        ? 'bg-gradient-to-br from-[#0a0a2e] via-[#0d1b4b] to-[#0a0a2e]'
        : isMorning
        ? 'bg-gradient-to-br from-[#1a1a3e] via-[#0f3460] to-[#16213e]'
        : 'bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]'
      }`} />

      {/* نجوم ليلية */}
      {isNight && STARS.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + star.delay, repeat: Infinity, delay: star.delay }}
        />
      ))}

      {/* جسيمات ذهبية متطايرة */}
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, rgba(251,191,36,0.8), rgba(251,191,36,0))',
          }}
          animate={{ y: [0, -400], opacity: [0, 0.6, 0], x: [0, (Math.random() - 0.5) * 60] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
        />
      ))}

      {/* هلال وقمر */}
      {isNight && (
        <motion.div
          className="absolute top-6 left-10"
          animate={{ rotate: [0, 5, 0], y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="text-6xl filter drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(251,191,36,0.8)' }}>🌙</div>
        </motion.div>
      )}

      {/* شعاع نور */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: '2px',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(251,191,36,0.3), transparent)',
            filter: 'blur(8px)',
          }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* نمط إسلامي */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fbbf24' stroke-width='1'%3E%3Cpolygon points='40,5 75,27.5 75,52.5 40,75 5,52.5 5,27.5'/%3E%3Cpolygon points='40,15 65,30 65,50 40,65 15,50 15,30'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* المحتوى */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center" style={{ minHeight: '420px' }}>

        {/* التحية والوقت */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-amber-300 text-lg font-bold mb-1">{greeting}</p>
          <p className="text-white/60 text-3xl font-mono tracking-widest">{timeDisplay}</p>
        </motion.div>

        {/* البسملة */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div
            className="text-4xl md:text-5xl font-arabic text-amber-300 mb-2"
            style={{ fontFamily: 'Amiri, serif', textShadow: '0 0 30px rgba(251,191,36,0.6)', lineHeight: 2 }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        </motion.div>

        {/* الدعاء المتغير */}
        <div className="max-w-2xl mx-auto mb-6" style={{ minHeight: '100px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDua}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-amber-400/20"
            >
              <p
                className="text-xl md:text-2xl text-white leading-loose mb-2 font-arabic"
                style={{ fontFamily: 'Amiri, serif', lineHeight: 2.2 }}
              >
                ﴿ {DUAS[currentDua].arabic} ﴾
              </p>
              <p className="text-amber-400/80 text-sm font-bold">— {DUAS[currentDua].source}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* مؤشرات الدعاء */}
        <div className="flex gap-2 mb-6">
          {DUAS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentDua(i)}
              className={`rounded-full transition-all ${i === currentDua ? 'w-6 h-2 bg-amber-400' : 'w-2 h-2 bg-white/30'}`}
            />
          ))}
        </div>

        {/* إحصائيات روحانية */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4 w-full max-w-sm"
        >
          {[
            { label: 'آية', value: '6236', icon: '📖' },
            { label: 'سورة', value: '114', icon: '🌿' },
            { label: 'جزء', value: '30', icon: '✨' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10"
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-amber-300 font-bold text-lg">{item.value}</div>
              <div className="text-white/60 text-xs">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}