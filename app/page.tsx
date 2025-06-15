'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/components/providers/SocketProvider';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DiskUsageCard } from '@/components/dashboard/DiskUsageCard';
import { useTranslations } from '@/hooks/use-translations';
import { getDashboardStats, getDiskUsage } from '@/lib/api';
import { DashboardStats, DiskUsage } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import {
  Radio,
  Calendar,
  CalendarDays,
  Archive,
  Video,
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [diskUsage, setDiskUsage] = useState<DiskUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslations();
  const socket = useSocket();

  const loadData = async () => {
    try {
      const [statsData, diskData] = await Promise.all([
        getDashboardStats(),
        getDiskUsage(),
      ]);
      setStats(statsData);
      setDiskUsage(diskData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for real-time updates
    const handleUpdate = () => {
      loadData();
    };

    socket.on('videos_update', handleUpdate);
    socket.on('sessions_update', handleUpdate);
    socket.on('schedules_update', handleUpdate);
    socket.on('inactive_sessions_update', handleUpdate);

    return () => {
      socket.off('videos_update', handleUpdate);
      socket.off('sessions_update', handleUpdate);
      socket.off('schedules_update', handleUpdate);
      socket.off('inactive_sessions_update', handleUpdate);
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats || !diskUsage) {
    return (
      <div className="text-center text-muted-foreground">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-600 to-indigo-600 bg-clip-text text-transparent">
          {t('dashboard.title')}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Overview of your streaming operations
        </p>
      </div>

      {/* Mobile: Single column, Desktop: Grid layout */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title={t('dashboard.live_sessions')}
          value={stats.live_sessions}
          icon={Radio}
          gradient="from-rose-400 to-pink-400"
          className="border-rose-200/50 dark:border-rose-800/50"
        />
        <StatsCard
          title={t('dashboard.scheduled_onetime')}
          value={stats.scheduled_onetime}
          icon={Calendar}
          gradient="from-sky-400 to-blue-400"
          className="border-sky-200/50 dark:border-sky-800/50"
        />
        <StatsCard
          title={t('dashboard.scheduled_daily')}
          value={stats.scheduled_daily}
          icon={CalendarDays}
          gradient="from-violet-400 to-purple-400"
          className="border-violet-200/50 dark:border-violet-800/50"
        />
        <StatsCard
          title={t('dashboard.inactive_sessions')}
          value={stats.inactive_sessions}
          icon={Archive}
          gradient="from-amber-400 to-orange-400"
          className="border-amber-200/50 dark:border-amber-800/50"
        />
        <StatsCard
          title={t('dashboard.video_count')}
          value={stats.video_count}
          icon={Video}
          gradient="from-emerald-400 to-green-400"
          className="border-emerald-200/50 dark:border-emerald-800/50"
        />
        
        {/* Disk usage card spans full width on mobile, normal on desktop */}
        <div className="sm:col-span-2 lg:col-span-1">
          <DiskUsageCard diskUsage={diskUsage} />
        </div>
      </div>
    </div>
  );
}