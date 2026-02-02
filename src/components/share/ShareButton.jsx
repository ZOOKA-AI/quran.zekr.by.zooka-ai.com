import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import ShareDialog from './ShareDialog';

export default function ShareButton({
  entityType,
  entityId,
  title,
  imageUrl,
  variant = 'default',
  size = 'default',
  showLabel = true,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        variant={variant}
        size={size}
        className="gap-2"
      >
        <Share2 className="w-4 h-4" />
        {showLabel && 'مشاركة'}
      </Button>

      <ShareDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entityType={entityType}
        entityId={entityId}
        title={title}
        imageUrl={imageUrl}
      />
    </>
  );
}