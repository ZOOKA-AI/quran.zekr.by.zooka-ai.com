import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Music, X, Radio, Square
} from 'lucide-react';
import AudioManager from '@/components/audio/AudioManager';

export default function FloatingAudioControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSource, setCurrentSource] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = AudioManager.addListener((source, status) => {
      setCurrentSource(source);
      setIsPlaying(status === 'playing');
    });

    return () => unsubscribe();
  }, []);

  const handleStopAll = () => {
    AudioManager.stopAll();
    setIsPlaying(false);
    setCurrentSource(null);
  };

  const getSourceIcon = () => {
    switch (currentSource) {
      case 'radio':
        return <Radio className="w-5 h-5" />;
      case 'quran':
      case 'tilawa':
      case 'ibtihaal':
      case 'tawasheeh':
        return <Music className="w-5 h-5" />;
      default:
        return <Music className="w-5 h-5" />;
    }
  };

  const getSourceName = () => {
    switch (currentSource) {
      case 'radio': return 'الراديو';
      case 'quran': return 'القرآن';
      case 'tilawa': return 'التلاوة';
      case 'ibtihaal': return 'الابتهالات';
      case 'tawasheeh': return 'التواشيح';
      default: return 'الصوت';
    }
  };

  return (
    <>
      {/* زر التحكم العائم */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 left-6 z-40 w-14 h-14 rounded-full shadow-2xl transition-all ${
          isPlaying 
            ? 'bg-gradient-to-br from-emerald-500 to-green-600 animate-pulse' 
            : 'bg-gradient-to-br from-slate-700 to-slate-800'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            {getSourceIcon()}
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
        )}
      </Button>

      {/* لوحة التحكم */}
      {isOpen && (
        <Card className="fixed bottom-40 left-6 z-40 w-72 bg-slate-900/95 backdrop-blur-xl border-slate-700 shadow-2xl p-4" dir="rtl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">التحكم بالصوت</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {currentSource ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isPlaying ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}>
                    {getSourceIcon()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{getSourceName()}</p>
                    <p className="text-slate-400 text-sm">
                      {isPlaying ? 'قيد التشغيل' : 'متوقف'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleStopAll}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                  >
                    <Square className="w-5 h-5" />
                  </Button>
                </div>

                <p className="text-slate-500 text-xs text-center">
                  اضغط إيقاف لإيقاف كل الأصوات
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">لا يوجد صوت قيد التشغيل</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  );
}