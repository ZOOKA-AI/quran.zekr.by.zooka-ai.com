import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function DonationNotification() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const donationStatus = urlParams.get('donation');
    const amount = urlParams.get('amount');

    if (donationStatus === 'success') {
      setNotification({
        type: 'success',
        title: 'جزاك الله خيراً! 🤲',
        message: amount 
          ? `تم استلام تبرعك بمبلغ ${amount} بنجاح` 
          : 'تم استلام تبرعك بنجاح',
        subMessage: 'بارك الله فيك وجعله في ميزان حسناتك'
      });

      // إطلاق الألعاب النارية للاحتفال
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#059669', '#fcd34d', '#f59e0b']
        });
      }, 300);

      // تنظيف URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);

    } else if (donationStatus === 'cancelled') {
      setNotification({
        type: 'cancelled',
        title: 'تم إلغاء العملية',
        message: 'لم يتم إتمام التبرع',
        subMessage: 'يمكنك المحاولة مرة أخرى في أي وقت'
      });

      // تنظيف URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const closeNotification = () => {
    setNotification(null);
  };

  if (!notification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={closeNotification}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {notification.type === 'success' ? (
            <>
              {/* Success Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  {[...Array(20)].map((_, i) => (
                    <Sparkles
                      key={i}
                      className="absolute text-white animate-pulse"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: `${10 + Math.random() * 15}px`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">{notification.title}</h2>
              </div>

              {/* Success Content */}
              <div className="p-6 text-center">
                <p className="text-xl text-gray-800 font-bold mb-2">{notification.message}</p>
                <p className="text-gray-600 mb-6">{notification.subMessage}</p>
                
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200 mb-6">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-emerald-800 font-arabic text-lg">
                    "مَن تَصَدَّقَ بعَدْلِ تَمْرَةٍ مِن كَسْبٍ طَيِّبٍ، فإنَّ اللَّهَ يَقْبَلُها بيَمِينِهِ"
                  </p>
                  <p className="text-emerald-600 text-sm mt-2">رواه البخاري</p>
                </div>

                <button
                  onClick={closeNotification}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-green-700 transition-all"
                >
                  حسناً
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Cancelled Header */}
              <div className="bg-gradient-to-r from-gray-500 to-slate-600 p-8 text-center">
                <button
                  onClick={closeNotification}
                  className="absolute top-4 left-4 text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <XCircle className="w-12 h-12 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">{notification.title}</h2>
              </div>

              {/* Cancelled Content */}
              <div className="p-6 text-center">
                <p className="text-xl text-gray-800 font-bold mb-2">{notification.message}</p>
                <p className="text-gray-600 mb-6">{notification.subMessage}</p>

                <button
                  onClick={closeNotification}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-green-700 transition-all"
                >
                  حسناً، سأحاول لاحقاً
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}