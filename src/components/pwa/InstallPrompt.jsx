import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { toast } from 'sonner';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // عرض الـ prompt بعد 5 ثواني من تحميل الصفحة
      setTimeout(() => {
        const wasPromptShown = localStorage.getItem('pwa-prompt-shown');
        if (!wasPromptShown) {
          setShowPrompt(true);
        }
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // تحقق من أن التطبيق مثبت بالفعل
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success('شكراً لتثبيت التطبيق! 🎉');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-shown', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-shown', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
      <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-2xl border-2 border-emerald-400">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Download className="w-6 h-6 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">ثبّت التطبيق</h3>
              <p className="text-emerald-100 text-sm mb-3">
                للوصول السريع والاستخدام دون اتصال بالإنترنت
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleInstall}
                  className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold"
                  size="sm"
                >
                  تثبيت
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  className="text-white hover:bg-emerald-700"
                  size="sm"
                >
                  لاحقاً
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="text-white hover:bg-emerald-700 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}