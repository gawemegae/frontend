'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useTranslations } from '@/hooks/use-translations';
import { getYouTubeStatus, getYouTubeConfig, saveYouTubeConfig, disconnectYouTube, getYouTubeConnectUrl } from '@/lib/api';
import { YouTubeConfig, YouTubeStatus } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { Youtube, CheckCircle, XCircle, ExternalLink, Settings, Clock, Search } from 'lucide-react';

const configSchema = z.object({
  enabled: z.boolean(),
  schedule_time: z.string().min(1, 'Schedule time is required'),
  title_template: z.string().min(1, 'Title template is required'),
  description_template: z.string(),
  video_selection_mode: z.enum(['sequential', 'random']),
  privacy_status: z.enum(['public', 'private', 'unlisted']),
});

type ConfigFormData = z.infer<typeof configSchema>;

export default function YouTubeAutomationPage() {
  const [status, setStatus] = useState<YouTubeStatus | null>(null);
  const [config, setConfig] = useState<YouTubeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      enabled: false,
      schedule_time: '09:00',
      title_template: 'Live Harian - {DD}/{MM}/{YYYY}',
      description_template: 'Streaming otomatis harian',
      video_selection_mode: 'sequential',
      privacy_status: 'public',
    },
  });

  const enabled = watch('enabled');

  const loadData = async () => {
    try {
      const [statusData, configData] = await Promise.all([
        getYouTubeStatus(),
        getYouTubeConfig(),
      ]);
      setStatus(statusData);
      setConfig(configData);
      reset(configData);
    } catch (error) {
      toast.error('Failed to load YouTube data');
      console.error('YouTube data error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [reset]);

  const handleConnect = () => {
    const connectUrl = getYouTubeConnectUrl();
    window.open(connectUrl, '_blank');
  };

  const handleDisconnect = async () => {
    try {
      await disconnectYouTube();
      toast.success('Disconnected from YouTube successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to disconnect from YouTube');
      console.error('Disconnect error:', error);
    }
  };

  const onSubmit = async (data: ConfigFormData) => {
    setSaving(true);
    try {
      await saveYouTubeConfig(data);
      toast.success('Configuration saved successfully');
      setConfig(data);
    } catch (error) {
      toast.error('Failed to save configuration');
      console.error('Save config error:', error);
    } finally {
      setSaving(false);
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
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
          {t('youtube.title')}
        </h1>
        <p className="text-muted-foreground">
          Configure automated daily streaming to YouTube
        </p>
      </div>

      <Card className="border-0 bg-gradient-to-br from-red-50/80 to-pink-50/70 dark:from-red-950/30 dark:to-pink-950/25 backdrop-blur-sm border border-slate-300/60 dark:border-slate-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg">
              <Youtube className="h-5 w-5 text-white" />
            </div>
            <span>Connection Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              {status?.connected ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium">{t('youtube.connected')}</span>
                    {status.channel_name && (
                      <p className="text-sm text-muted-foreground truncate">{status.channel_name}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="bg-green-100/90 text-green-800 dark:bg-green-900/40 dark:text-green-200 border border-green-200/50 dark:border-green-700/50">
                    Connected
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{t('youtube.not_connected')}</span>
                  <Badge variant="destructive" className="bg-red-100/90 text-red-800 dark:bg-red-900/40 dark:text-red-200 border border-red-200/50 dark:border-red-700/50">
                    Not Connected
                  </Badge>
                </>
              )}
            </div>
            
            <div className="flex space-x-2">
              {status?.connected ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full sm:w-auto bg-gradient-to-r from-red-400 to-rose-400 hover:from-red-500 hover:to-rose-500 border-0 shadow-lg">
                      {t('youtube.disconnect')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="mx-4 sm:mx-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Disconnect YouTube</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to disconnect from YouTube? This will disable automation.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="w-full sm:w-auto">{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDisconnect} className="w-full sm:w-auto">
                        {t('youtube.disconnect')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button onClick={handleConnect} className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 shadow-lg">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('youtube.connect')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-gradient-to-br from-blue-50/80 to-purple-50/70 dark:from-blue-950/30 dark:to-purple-950/25 backdrop-blur-sm border border-slate-300/60 dark:border-slate-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <span>Automation Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/80 dark:bg-black/30 rounded-lg border border-blue-300/60 dark:border-blue-800/60 shadow-sm">
              <div className="space-y-1">
                <Label htmlFor="enabled" className="text-base font-medium">
                  {t('youtube.enable_automation')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically stream videos daily at the scheduled time
                </p>
              </div>
              <Switch
                id="enabled"
                checked={enabled}
                onCheckedChange={(checked) => setValue('enabled', checked)}
                disabled={!status?.connected}
                className="flex-shrink-0"
              />
            </div>

            {enabled && status?.connected && (
              <div className="space-y-5 border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule_time" className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{t('youtube.schedule_time')}</span>
                    </Label>
                    <Input
                      id="schedule_time"
                      type="time"
                      {...register('schedule_time')}
                      className="h-10 bg-gradient-to-r from-slate-100/90 to-blue-100/80 dark:from-slate-900/50 dark:to-blue-950/40 border-slate-300/70 dark:border-slate-700/70"
                    />
                    {errors.schedule_time && (
                      <p className="text-sm text-red-600">{errors.schedule_time.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="privacy_status">{t('youtube.privacy_status')}</Label>
                    <Select onValueChange={(value) => setValue('privacy_status', value as 'public' | 'private' | 'unlisted')}>
                      <SelectTrigger className="h-10 bg-gradient-to-r from-slate-100/90 to-blue-100/80 dark:from-slate-900/50 dark:to-blue-950/40 border-slate-300/70 dark:border-slate-700/70">
                        <SelectValue placeholder="Select privacy status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">{t('common.public')}</SelectItem>
                        <SelectItem value="private">{t('common.private')}</SelectItem>
                        <SelectItem value="unlisted">{t('common.unlisted')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title_template">{t('youtube.title_template')}</Label>
                  <Input
                    id="title_template"
                    {...register('title_template')}
                    placeholder="Live Harian - {DD}/{MM}/{YYYY}"
                    className="h-10 bg-gradient-to-r from-slate-100/90 to-blue-100/80 dark:from-slate-900/50 dark:to-blue-950/40 border-slate-300/70 dark:border-slate-700/70"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {'{DD}'}, {'{MM}'}, {'{YYYY}'} for date formatting
                  </p>
                  {errors.title_template && (
                    <p className="text-sm text-red-600">{errors.title_template.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_template">{t('youtube.description_template')}</Label>
                  <Textarea
                    id="description_template"
                    {...register('description_template')}
                    placeholder="Enter stream description..."
                    rows={3}
                    className="resize-none bg-gradient-to-r from-slate-100/90 to-blue-100/80 dark:from-slate-900/50 dark:to-blue-950/40 border-slate-300/70 dark:border-slate-700/70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video_selection_mode">{t('youtube.video_selection')}</Label>
                  <Select onValueChange={(value) => setValue('video_selection_mode', value as 'sequential' | 'random')}>
                    <SelectTrigger className="h-10 bg-gradient-to-r from-slate-100/90 to-blue-100/80 dark:from-slate-900/50 dark:to-blue-950/40 border-slate-300/70 dark:border-slate-700/70">
                      <SelectValue placeholder="Select video selection mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequential">{t('common.sequential')}</SelectItem>
                      <SelectItem value="random">{t('common.random')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 shadow-lg">
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    t('youtube.save_config')
                  )}
                </Button>
              </div>
            )}

            {!status?.connected && (
              <div className="bg-slate-100/80 dark:bg-slate-800/50 p-6 rounded-lg text-center text-muted-foreground border border-slate-300/50 dark:border-slate-700/50 shadow-sm">
                <Youtube className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p className="font-medium">Connect to YouTube to configure automation settings</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}