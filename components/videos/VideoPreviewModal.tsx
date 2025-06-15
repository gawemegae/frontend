'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
}

export function VideoPreviewModal({ isOpen, onClose, filename }: VideoPreviewModalProps) {
  const videoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/${encodeURIComponent(filename)}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{filename}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            src={videoUrl}
            controls
            className="w-full h-full"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}