import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function LikeButton({ shareId, initialLikes = 0, isLiked: initialIsLiked = false }) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      const share = await base44.entities.DailyShare.get(shareId);
      return await base44.entities.DailyShare.update(shareId, {
        likes_count: (share.likes_count || 0) + 1
      });
    },
    onMutate: async () => {
      // Optimistic update
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      
      await queryClient.cancelQueries({ queryKey: ['shares'] });
      const previousShares = queryClient.getQueryData(['shares']);
      
      queryClient.setQueryData(['shares'], (old = []) =>
        old.map(share =>
          share.id === shareId
            ? { ...share, likes_count: (share.likes_count || 0) + 1 }
            : share
        )
      );
      
      return { previousShares };
    },
    onError: (err, variables, context) => {
      // Rollback
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
      queryClient.setQueryData(['shares'], context.previousShares);
      toast.error('حدث خطأ في الإعجاب');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shares'] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const share = await base44.entities.DailyShare.get(shareId);
      return await base44.entities.DailyShare.update(shareId, {
        likes_count: Math.max((share.likes_count || 0) - 1, 0)
      });
    },
    onMutate: async () => {
      // Optimistic update
      setIsLiked(false);
      setLikesCount(prev => Math.max(prev - 1, 0));
      
      await queryClient.cancelQueries({ queryKey: ['shares'] });
      const previousShares = queryClient.getQueryData(['shares']);
      
      queryClient.setQueryData(['shares'], (old = []) =>
        old.map(share =>
          share.id === shareId
            ? { ...share, likes_count: Math.max((share.likes_count || 0) - 1, 0) }
            : share
        )
      );
      
      return { previousShares };
    },
    onError: (err, variables, context) => {
      // Rollback
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      queryClient.setQueryData(['shares'], context.previousShares);
      toast.error('حدث خطأ');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shares'] });
    },
  });

  const handleToggle = () => {
    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={`gap-2 ${isLiked ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}
    >
      <motion.div
        animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
      </motion.div>
      <span className="font-medium">{likesCount}</span>
    </Button>
  );
}