import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIDisclosure() {
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem('ai_disclosure_accepted');
  });

  const handleAccept = () => {
    localStorage.setItem('ai_disclosure_accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
      >
        <Card className="bg-gradient-to-r from-indigo-900/98 to-purple-900/98 backdrop-blur-2xl border-2 border-purple-500/50 shadow-2xl">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  محتوى مدعوم بالذكاء الاصطناعي
                </h3>
                <p className="text-purple-100 text-sm leading-relaxed">
                  يستخدم هذا التطبيق تقنيات الذكاء الاصطناعي لتحسين التجربة، بما في ذلك:
                </p>
                <ul className="text-purple-200 text-xs mt-3 space-y-1 pr-4 list-disc">
                  <li>توليد محتوى روحاني (آيات، أحاديث، أدعية)</li>
                  <li>المساعد الذكي بصوت عربي</li>
                  <li>تحسينات البحث والتوصيات</li>
                </ul>
                <div className="mt-3 bg-amber-900/30 border border-amber-600/30 rounded-lg p-2">
                  <p className="text-amber-200 text-xs flex items-start gap-2">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>المحتوى القرآني الأصلي غير معدل ومن مصادر موثوقة. AI يُستخدم فقط للتفسير والمساعدة.</span>
                  </p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleAccept}
                className="text-purple-300 hover:text-white hover:bg-purple-800/50 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={handleAccept}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
            >
              فهمت، متابعة
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}