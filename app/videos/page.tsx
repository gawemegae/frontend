'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { VideoCard } from '@/components/videos/VideoCard';
import { VideoPreviewModal } from '@/components/videos/VideoPreviewModal';
import { DownloadVideoForm } from '@/components/videos/DownloadVideoForm';
import { useTranslations } from '@/hooks/use-translations';
import { useSocket } from '@/components/providers/SocketProvider';
import { getVideos, downloadVideo, deleteVideo, deleteAllVideos, renameVideo } from '@/lib/api';
import { Video } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { Trash2, VideoIcon, Search } from 'lucide-react';

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [renameVideoData, setRenameVideoData] = useState<{ filename: string; newName: string } | null>(null);
  const { t } = useTranslations();
  const socket = useSocket();

  const loadVideos = async () => {
    try {
      const data = await getVideos();
      setVideos(data);
      setFilteredVideos(data);
    } catch (error) {
      toast.error('Failed to load videos');
      console.error('Videos error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();

    socket.on('videos_update', loadVideos);
    return () => {
      socket.off('videos_update', loadVideos);
    };
  }, [socket]);

  // Filter videos based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video =>
        video.filename.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  }, [searchQuery, videos]);

  const handleDownload = async (url: string) => {
    setDownloadLoading(true);
    try {
      await downloadVideo(url);
      toast.success('Video download started');
    } catch (error) {
      toast.error('Failed to start download');
      console.error('Download error:', error);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      await deleteVideo(filename);
      toast.success('Video deleted successfully');
    } catch (error) {
      toast.error('Failed to delete video');
      console.error('Delete error:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllVideos();
      toast.success('All videos deleted successfully');
    } catch (error) {
      toast.error('Failed to delete all videos');
      console.error('Delete all error:', error);
    }
  };

  // Helper function to remove .mp4 extension
  const removeExtension = (filename: string) => {
    return filename.replace(/\.mp4$/i, '');
  };

  // Helper function to add .mp4 extension if not present
  const ensureExtension = (filename: string) => {
    if (!filename.toLowerCase().endsWith('.mp4')) {
      return filename + '.mp4';
    }
    return filename;
  };

  const handleRename = async () => {
    if (!renameVideoData) return;

    try {
      // Add .mp4 extension to the new name if not present
      const newFilenameWithExtension = ensureExtension(renameVideoData.newName);
      await renameVideo(renameVideoData.filename, newFilenameWithExtension);
      setRenameVideoData(null);
      toast.success('Video renamed successfully');
    } catch (error) {
      toast.error('Failed to rename video');
      console.error('Rename error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent flex items-center gap-3">
              {t('videos.title')}
              <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 text-emerald-600 dark:text-emerald-300 rounded-full text-lg font-bold border border-emerald-200/50 dark:border-emerald-700/50">
                {videos.length}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your video library
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-gradient-to-r from-slate-50/80 to-emerald-50/60 dark:from-slate-900/40 dark:to-emerald-950/30 border-slate-200/50 dark:border-slate-700/50 focus:border-emerald-300 dark:focus:border-emerald-600"
            />
          </div>
        </div>
        
        {videos.length > 0 && (
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto bg-gradient-to-r from-red-400 to-rose-400 hover:from-red-500 hover:to-rose-500 border-0">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('videos.delete_all')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="mx-4 sm:mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('videos.delete_all')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('videos.confirm_delete_all')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto">{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll} className="w-full sm:w-auto">
                    {t('videos.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <DownloadVideoForm 
        onDownload={handleDownload}
        isLoading={downloadLoading}
      />

      {filteredVideos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="bg-gradient-to-br from-slate-50/80 to-emerald-50/60 dark:from-slate-900/40 dark:to-emerald-950/30 rounded-lg p-8 mx-4 border border-slate-200/30 dark:border-slate-700/30">
            <VideoIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">
              {searchQuery ? 'No videos found' : 'No videos found'}
            </p>
            <p className="text-sm">
              {searchQuery ? 'Try adjusting your search terms' : 'Download some videos to get started'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.filename}
              video={video}
              onPreview={() => setPreviewVideo(video.filename)}
              onRename={() => setRenameVideoData({ 
                filename: video.filename, 
                newName: removeExtension(video.filename) // Remove extension for editing
              })}
              onDelete={() => handleDelete(video.filename)}
            />
          ))}
        </div>
      )}

      {previewVideo && (
        <VideoPreviewModal
          isOpen={!!previewVideo}
          onClose={() => setPreviewVideo(null)}
          filename={previewVideo}
        />
      )}

      <Dialog open={!!renameVideoData} onOpenChange={() => setRenameVideoData(null)}>
        <DialogContent className="mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
              {t('videos.rename_video')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-filename">{t('videos.new_filename')}</Label>
              <div className="relative">
                <Input
                  id="new-filename"
                  value={renameVideoData?.newName || ''}
                  onChange={(e) => setRenameVideoData(prev => prev ? { ...prev, newName: e.target.value } : null)}
                  className="bg-gradient-to-r from-slate-50/80 to-emerald-50/60 dark:from-slate-900/40 dark:to-emerald-950/30 border-slate-200/50 dark:border-slate-700/50 pr-12"
                  placeholder="Enter video name"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  .mp4
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ekstensi .mp4 akan ditambahkan secara otomatis
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button variant="outline" onClick={() => setRenameVideoData(null)} className="w-full sm:w-auto">
                {t('common.cancel')}
              </Button>
              <Button onClick={handleRename} className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
                {t('common.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}