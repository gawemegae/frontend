import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: typeof LucideIcon;
  gradient?: string;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, gradient = 'from-slate-400 to-slate-500', className }: StatsCardProps) {
  return (
    <Card className={`hover:shadow-xl transition-all duration-300 border-0 bg-white/98 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-300/80 dark:border-slate-700/50 shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate pr-2">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} opacity-12 dark:opacity-15 flex-shrink-0 border border-slate-300/40 dark:border-slate-700/40 shadow-sm`}>
          <Icon className={`h-4 w-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {value}
        </div>
        <div className="mt-2 h-1 bg-gradient-to-r from-slate-300/60 to-slate-200/40 dark:from-slate-700/40 dark:to-slate-800/30 rounded-full overflow-hidden border border-slate-300/30 dark:border-slate-700/30">
          <div 
            className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out shadow-sm`}
            style={{ width: `${Math.min(value * 10, 100)}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
}