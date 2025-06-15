'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslations } from '@/hooks/use-translations';
import { startManualSession, scheduleSession, getVideos } from '@/lib/api';
import { Video } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { Calendar, Clock, Youtube, Facebook } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Session name is required'),
  video_file: z.string().min(1, 'Video file is required'),
  platform: z.enum(['youtube', 'facebook']),
  stream_key: z.string().min(1, 'Stream key is required'),
  schedule_type: z.enum(['onetime', 'daily']).optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface LiveSessionFormProps {
  type: 'manual' | 'scheduled';
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: Partial<FormData>;
}

export function LiveSessionForm({ type, onSubmit, onCancel, initialData }: LiveSessionFormProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: 'youtube',
      schedule_type: 'onetime',
      ...initialData,
    },
  });

  const platform = watch('platform');
  const scheduleType = watch('schedule_type');

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data);
      } catch (error) {
        console.error('Failed to load videos:', error);
      }
    };

    loadVideos();
  }, []);

  // Set default datetime to current time + 1 hour
  useEffect(() => {
    if (type === 'scheduled' && !initialData?.start_time) {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const defaultTime = now.toISOString().slice(0, 16);
      setValue('start_time', defaultTime);
    }
  }, [type, setValue, initialData]);

  const onFormSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (type === 'manual') {
        await startManualSession({
          name: data.name,
          video_file: data.video_file,
          platform: data.platform,
          stream_key: data.stream_key,
        });
        toast.success('Manual session started successfully');
      } else {
        await scheduleSession({
          name: data.name,
          video_file: data.video_file,
          platform: data.platform,
          stream_key: data.stream_key,
          type: data.schedule_type!,
          start_time: data.start_time!,
          end_time: data.end_time,
        });
        toast.success('Session scheduled successfully');
      }
      onSubmit();
    } catch (error) {
      toast.error(`Failed to ${type === 'manual' ? 'start' : 'schedule'} session`);
      console.error('Session error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      <div className="text-center space-y-1 pb-2 border-b border-border/50">
        <h3 className="text-base font-semibold bg-gradient-to-r from-slate-600 to-indigo-600 bg-clip-text text-transparent">
          {type === 'manual' ? 'Start Manual Live Session' : 'Schedule Live Session'}
        </h3>
        <p className="text-xs text-muted-foreground">
          {type === 'manual' 
            ? 'Start streaming immediately with your selected video'
            : 'Schedule a stream to start automatically at a specific time'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">Session Name</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter a descriptive name for your session"
            className="h-9 text-sm bg-gradient-to-r from-slate-50/80 to-indigo-50/60 dark:from-slate-900/40 dark:to-indigo-950/30 border-slate-200 dark:border-slate-700"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="video_file" className="text-sm font-medium">Video File</Label>
          <Select onValueChange={(value) => setValue('video_file', value)}>
            <SelectTrigger className="h-9 text-sm bg-gradient-to-r from-slate-50/80 to-indigo-50/60 dark:from-slate-900/40 dark:to-indigo-950/30 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="Select a video to stream" />
            </SelectTrigger>
            <SelectContent>
              {videos.map((video) => (
                <SelectItem key={video.filename} value={video.filename}>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    <span className="text-sm">{video.filename}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.video_file && (
            <p className="text-xs text-red-500">{errors.video_file.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Streaming Platform</Label>
          <RadioGroup
            value={platform}
            onValueChange={(value) => setValue('platform', value as 'youtube' | 'facebook')}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-2.5 hover:bg-gradient-to-r hover:from-red-50/80 hover:to-pink-50/60 dark:hover:from-red-950/30 dark:hover:to-pink-950/30 transition-colors border-slate-200 dark:border-slate-700">
              <RadioGroupItem value="youtube" id="youtube" />
              <Label htmlFor="youtube" className="flex items-center space-x-2 cursor-pointer flex-1 text-sm">
                <Youtube className="h-3.5 w-3.5 text-red-400" />
                <span>YouTube</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-2.5 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/60 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 transition-colors border-slate-200 dark:border-slate-700">
              <RadioGroupItem value="facebook" id="facebook" />
              <Label htmlFor="facebook" className="flex items-center space-x-2 cursor-pointer flex-1 text-sm">
                <Facebook className="h-3.5 w-3.5 text-blue-400" />
                <span>Facebook</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="stream_key" className="text-sm font-medium">Stream Key</Label>
          <Input
            id="stream_key"
            {...register('stream_key')}
            placeholder="Enter your platform stream key"
            type="password"
            className="h-9 text-sm font-mono bg-gradient-to-r from-slate-50/80 to-indigo-50/60 dark:from-slate-900/40 dark:to-indigo-950/30 border-slate-200 dark:border-slate-700"
          />
          {errors.stream_key && (
            <p className="text-xs text-red-500">{errors.stream_key.message}</p>
          )}
        </div>

        {type === 'scheduled' && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Schedule Type</Label>
              <RadioGroup
                value={scheduleType}
                onValueChange={(value) => setValue('schedule_type', value as 'onetime' | 'daily')}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-2.5 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/60 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 transition-colors border-slate-200 dark:border-slate-700">
                  <RadioGroupItem value="onetime" id="onetime" />
                  <Label htmlFor="onetime" className="flex items-center space-x-2 cursor-pointer flex-1 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-blue-400" />
                    <span>One-time</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-2.5 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-indigo-50/60 dark:hover:from-purple-950/30 dark:hover:to-indigo-950/30 transition-colors border-slate-200 dark:border-slate-700">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="flex items-center space-x-2 cursor-pointer flex-1 text-sm">
                    <Clock className="h-3.5 w-3.5 text-purple-400" />
                    <span>Daily</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="start_time" className="text-sm font-medium">Start Time</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  {...register('start_time')}
                  className="h-9 text-sm bg-gradient-to-r from-slate-50/80 to-indigo-50/60 dark:from-slate-900/40 dark:to-indigo-950/30 border-slate-200 dark:border-slate-700"
                />
                {errors.start_time && (
                  <p className="text-xs text-red-500">{errors.start_time.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end_time" className="text-sm font-medium">End Time (Optional)</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  {...register('end_time')}
                  className="h-9 text-sm bg-gradient-to-r from-slate-50/80 to-indigo-50/60 dark:from-slate-900/40 dark:to-indigo-950/30 border-slate-200 dark:border-slate-700"
                />
                <p className="text-xs text-muted-foreground">Leave empty for manual stop</p>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-3 border-t border-border/50">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto text-sm">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto min-w-[100px] text-sm bg-gradient-to-r from-slate-500 to-indigo-500 hover:from-slate-600 hover:to-indigo-600"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-1.5" />
                Processing...
              </>
            ) : (
              type === 'manual' ? 'Start Session' : 'Schedule Session'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}