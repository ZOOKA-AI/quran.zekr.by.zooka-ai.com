import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => console.log('SW registered:', registration))
          .catch(error => console.log('SW registration failed:', error));
      });
    }

    // Listen for install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user has dismissed before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted install');
    }
    
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
      >
        <Card className="bg-gradient-to-r from-emerald-900/98 to-green-900/98 backdrop-blur-2xl border-2 border-emerald-500/50 shadow-2xl">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600/30 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-base mb-1">
                  ثبّت التطبيق على جهازك
                </h3>
                <p className="text-emerald-100 text-sm mb-3">
                  استخدم التطبيق بسهولة مثل التطبيقات العادية - بدون متجر!
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleInstall}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Download className="w-4 h-4 ml-1" />
                    تثبيت الآن
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    className="text-emerald-200 hover:text-white hover:bg-emerald-800/50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}