import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle, HardDrive } from 'lucide-react';
import { DiskUsage } from '@/lib/types';
import { useTranslations } from '@/hooks/use-translations';

interface DiskUsageCardProps {
  diskUsage: DiskUsage;
}

export function DiskUsageCard({ diskUsage }: DiskUsageCardProps) {
  const { t } = useTranslations();

  const getStatusIcon = () => {
    switch (diskUsage.status) {
      case 'full':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'almost_full':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    }
  };

  const getStatusColor = () => {
    switch (diskUsage.status) {
      case 'full':
        return 'from-red-50/95 to-rose-50/80 dark:from-red-950/50 dark:to-rose-950/40';
      case 'almost_full':
        return 'from-amber-50/95 to-orange-50/80 dark:from-amber-950/50 dark:to-orange-950/40';
      default:
        return 'from-emerald-50/95 to-green-50/80 dark:from-emerald-950/50 dark:to-green-950/40';
    }
  };

  const getProgressColor = () => {
    if (diskUsage.percentage >= 90) return 'from-red-400 to-rose-400';
    if (diskUsage.percentage >= 75) return 'from-amber-400 to-orange-400';
    return 'from-emerald-400 to-green-400';
  };

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 border-0 bg-white/98 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-300/80 dark:border-slate-700/50 shadow-md bg-gradient-to-br ${getStatusColor()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
          <HardDrive className="h-4 w-4" />
          <span>{t('dashboard.disk_usage')}</span>
        </CardTitle>
        {getStatusIcon()}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">{diskUsage.percentage}% used</span>
            <span className="text-slate-600 dark:text-slate-400">{diskUsage.used} / {diskUsage.total}</span>
          </div>
          <div className="relative">
            <Progress 
              value={diskUsage.percentage} 
              className="h-3 bg-slate-300/70 dark:bg-slate-700/50 border border-slate-300/50 dark:border-slate-700/50"
            />
            <div 
              className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-1000 ease-out shadow-sm`}
              style={{ width: `${diskUsage.percentage}%` }}
            ></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center p-2 bg-white/80 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm border border-slate-300/50 dark:border-slate-700/50 shadow-sm">
            <span className="block text-slate-600 dark:text-slate-400 mb-1">{t('dashboard.total')}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{diskUsage.total}</span>
          </div>
          <div className="text-center p-2 bg-white/80 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm border border-slate-300/50 dark:border-slate-700/50 shadow-sm">
            <span className="block text-slate-600 dark:text-slate-400 mb-1">{t('dashboard.used')}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{diskUsage.used}</span>
          </div>
          <div className="text-center p-2 bg-white/80 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm border border-slate-300/50 dark:border-slate-700/50 shadow-sm">
            <span className="block text-slate-600 dark:text-slate-400 mb-1">{t('dashboard.free')}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{diskUsage.free}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}