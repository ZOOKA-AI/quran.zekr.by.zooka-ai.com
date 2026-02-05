import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Video,
  Mail,
  Loader2,
  Check,
} from 'lucide-react';

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-400' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500' },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: 'bg-black' },
  { id: 'telegram', name: 'Telegram', icon: Mail, color: 'bg-blue-500' },
];

export default function ShareDialog({
  open,
  onOpenChange,
  entityType,
  entityId,
  title,
  imageUrl,
}) {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [tagInput, setTagInput] = useState('');
  const queryClient = useQueryClient();

  const createShareMutation = useMutation({
    mutationFn: async (shareData) => {
      return await base44.entities.Share.create(shareData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shares'] });
      handleClose();
    },
  });

  const handleClose = () => {
    setSelectedPlatforms([]);
    setContent('');
    setTags('');
    setTagInput('');
    onOpenChange(false);
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setTags((prev) =>
        prev ? `${prev} #${tagInput.trim()}` : `#${tagInput.trim()}`
      );
      setTagInput('');
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlatforms.length || !content.trim()) {
      alert('يرجى اختيار منصة واحدة على الأقل وإدخال محتوى');
      return;
    }

    const shareData = {
      entity_type: entityType,
      entity_id: entityId,
      title: title || 'مشاركة',
      content: content,
      platforms: selectedPlatforms,
      tags: tags.split(' ').filter((t) => t),
      image_url: imageUrl,
    };

    await createShareMutation.mutateAsync(shareData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">📤 مشاركة المحتوى</DialogTitle>
          <DialogDescription className="text-slate-400">
            اختر المنصات التي تريد المشاركة عليها
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* المعاينة */}
          {imageUrl && (
            <div className="rounded-lg overflow-hidden border border-slate-700">
              <img
                src={imageUrl}
                alt="معاينة"
                className="w-full h-40 object-cover"
              />
            </div>
          )}

          {/* اختيار المنصات */}
          <div>
            <label className="text-white font-bold mb-3 block">اختر المنصات</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`p-4 rounded-lg border-2 transition-all flex items-center gap-2 ${
                      isSelected
                        ? `${platform.color} border-white text-white`
                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-bold text-sm">{platform.name}</span>
                    {isSelected && <Check className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* محتوى المشاركة */}
          <div>
            <label className="text-white font-bold mb-2 block">محتوى المشاركة</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب محتوى المشاركة هنا..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none h-24"
            />
            <p className="text-slate-400 text-xs mt-1">
              {content.length} / 280 حرف (لـ Twitter)
            </p>
          </div>

          {/* الوسوم */}
          <div>
            <label className="text-white font-bold mb-2 block">الوسوم والهاشتاجات</label>
            <div className="flex gap-2 mb-3">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="أضف وسم..."
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button
                onClick={addTag}
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                إضافة
              </Button>
            </div>
            {tags && (
              <div className="flex flex-wrap gap-2">
                {tags.split(' ').filter((t) => t).map((tag, idx) => (
                  <Badge key={idx} className="bg-emerald-600/80">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* أزرار الإجراء */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-slate-600"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createShareMutation.isPending}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {createShareMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  جاري النشر...
                </>
              ) : (
                '📤 نشر الآن'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}