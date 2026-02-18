import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const pullDistance = useMotionValue(0);
  
  const PULL_THRESHOLD = 80;
  const MAX_PULL = 120;

  const opacity = useTransform(pullDistance, [0, PULL_THRESHOLD], [0, 1]);
  const rotate = useTransform(pullDistance, [0, PULL_THRESHOLD], [0, 360]);
  const scale = useTransform(pullDistance, [0, PULL_THRESHOLD, MAX_PULL], [0.5, 1, 1.2]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;

      if (diff > 0 && window.scrollY === 0) {
        e.preventDefault();
        const distance = Math.min(diff * 0.5, MAX_PULL);
        pullDistance.set(distance);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      setIsPulling(false);
      const distance = pullDistance.get();

      if (distance >= PULL_THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);
        pullDistance.set(PULL_THRESHOLD);

        try {
          await onRefresh();
        } finally {
          setTimeout(() => {
            setIsRefreshing(false);
            pullDistance.set(0);
          }, 300);
        }
      } else {
        pullDistance.set(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, isRefreshing, onRefresh, pullDistance]);

  return (
    <div ref={containerRef} className="relative">
      {/* Pull indicator */}
      <motion.div
        style={{ 
          height: pullDistance,
          opacity
        }}
        className="absolute top-0 left-0 right-0 flex items-end justify-center pb-4 overflow-hidden"
      >
        <motion.div
          style={{ 
            rotate,
            scale
          }}
          className="flex items-center justify-center"
        >
          {isRefreshing ? (
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
          ) : (
            <RefreshCw className="w-6 h-6 text-emerald-500" />
          )}
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: pullDistance }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {children}
      </motion.div>
    </div>
  );
}