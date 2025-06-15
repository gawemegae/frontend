'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SessionCard } from '@/components/sessions/SessionCard';
import { useTranslations } from '@/hooks/use-translations';
import { useSocket } from '@/components/providers/SocketProvider';
import { getSchedules, cancelSchedule } from '@/lib/api';
import { Schedule } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { X, Calendar, Clock, Search } from 'lucide-react';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancelScheduleId, setCancelScheduleId] = useState<string | null>(null);
  const { t } = useTranslations();
  const socket = useSocket();

  const loadSchedules = async () => {
    try {
      const data = await getSchedules();
      setSchedules(data);
      setFilteredSchedules(data);
    } catch (error) {
      toast.error('Failed to load scheduled sessions');
      console.error('Schedules error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();

    socket.on('schedules_update', loadSchedules);
    return () => {
      socket.off('schedules_update', loadSchedules);
    };
  }, [socket]);

  // Filter schedules based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSchedules(schedules);
    } else {
      const filtered = schedules.filter(schedule =>
        schedule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.video.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSchedules(filtered);
    }
  }, [searchQuery, schedules]);

  const handleCancelSchedule = async (scheduleId: string) => {
    try {
      await cancelSchedule(scheduleId);
      setCancelScheduleId(null);
      toast.success('Schedule cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel schedule');
      console.error('Cancel schedule error:', error);
    }
  };

  const handleScheduleAction = (action: string, scheduleId: string) => {
    if (action === 'cancel') {
      setCancelScheduleId(scheduleId);
    }
  };

  const transformScheduleToSession = (schedule: Schedule) => ({
    id: schedule.id,
    name: schedule.name,
    video_file: schedule.video,
    platform: schedule.platform,
    stream_key: schedule.stream_key,
    type: 'scheduled' as const,
    start_time: schedule.start_time,
    stop_time: schedule.end_time,
  });

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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              {t('schedules.title')}
              <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-600 dark:text-indigo-300 rounded-full text-lg font-bold border border-indigo-200/50 dark:border-indigo-700/50">
                {schedules.length}
              </span>
            </h1>
            <p className="text-muted-foreground">
              Manage your upcoming scheduled streams
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari jadwal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-gradient-to-r from-slate-50/80 to-indigo-50/60 dark:from-slate-900/40 dark:to-indigo-950/30 border-slate-200/50 dark:border-slate-700/50 focus:border-indigo-300 dark:focus:border-indigo-600"
            />
          </div>
        </div>
      </div>

      {filteredSchedules.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="bg-gradient-to-br from-slate-50/80 to-indigo-50/60 dark:from-slate-900/40 dark:to-indigo-950/30 rounded-lg p-8 mx-4 border border-slate-200/30 dark:border-slate-700/30">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">
              {searchQuery ? 'No schedules found' : 'No scheduled sessions'}
            </p>
            <p className="text-sm">
              {searchQuery ? 'Try adjusting your search terms' : 'Create a new schedule from the Live Sessions page'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
          {filteredSchedules.map((schedule) => (
            <div key={schedule.id} className="relative">
              <SessionCard
                session={transformScheduleToSession(schedule)}
                onAction={handleScheduleAction}
                actionButtons={[
                  {
                    label: t('schedules.cancel'),
                    action: 'cancel',
                    variant: 'destructive',
                    icon: X,
                  },
                ]}
              />
              {/* Schedule type badge - positioned to avoid overlap with better spacing */}
              <div className="absolute top-2 right-2 z-10">
                <div className="flex flex-col space-y-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100/90 to-purple-100/90 text-indigo-700 dark:from-indigo-900/60 dark:to-purple-900/60 dark:text-indigo-200 border border-indigo-200/50 dark:border-indigo-700/50 backdrop-blur-sm">
                    <Clock className="h-2.5 w-2.5 mr-1" />
                    {schedule.type === 'onetime' ? t('common.onetime') : t('common.daily')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!cancelScheduleId} onOpenChange={() => setCancelScheduleId(null)}>
        <AlertDialogContent className="mx-4 sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('schedules.cancel')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('schedules.confirm_cancel')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => cancelScheduleId && handleCancelSchedule(cancelScheduleId)}
              className="w-full sm:w-auto"
            >
              {t('schedules.cancel')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}