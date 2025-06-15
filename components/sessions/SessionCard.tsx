import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Session } from '@/lib/types';
import { useTranslations } from '@/hooks/use-translations';
import { Youtube, Facebook, Clock, Play, Square, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SessionCardProps {
  session: Session;
  onAction?: (action: string, sessionId: string) => void;
  showActions?: boolean;
  actionButtons?: Array<{
    label: string;
    action: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export function SessionCard({ session, onAction, showActions = true, actionButtons }: SessionCardProps) {
  const { t } = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPlatformIcon = () => {
    return session.platform === 'youtube' ? 
      <Youtube className="h-4 w-4" /> : 
      <Facebook className="h-4 w-4" />;
  };

  const formatTime = (timeString?: string) => {
    if (!timeString || !mounted) return '-';
    return new Date(timeString).toLocaleString();
  };

  const getPlatformColor = () => {
    return session.platform === 'youtube' ? 
      'from-red-400 to-pink-400' : 
      'from-blue-400 to-indigo-400';
  };

  const getTypeColor = () => {
    return session.type === 'manual' ? 
      'from-emerald-400 to-green-400' : 
      'from-violet-400 to-purple-400';
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/98 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-300/80 dark:border-slate-700/50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-200 dark:to-slate-300 bg-clip-text text-transparent truncate">
              {session.name}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${getPlatformColor()} text-white shadow-lg border border-white/30`}>
              {getPlatformIcon()}
            </div>
            <Badge 
              variant="secondary" 
              className={`bg-gradient-to-r ${getTypeColor()} text-white border-0 text-xs shadow-lg`}
            >
              {t(`common.${session.type}`)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mobile: Compact layout */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="space-y-1">
              <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">
                {t('live.video_file')}
              </span>
              <p className="font-medium truncate bg-gradient-to-r from-slate-200/95 to-indigo-100/80 dark:from-slate-800/80 dark:to-indigo-950/60 px-2 py-1 rounded text-xs border border-slate-300/70 dark:border-slate-700/70 shadow-sm">
                {session.video_file}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">
                  {t('live.platform')}
                </span>
                <p className="font-medium capitalize flex items-center space-x-1 text-xs">
                  {getPlatformIcon()}
                  <span>{session.platform}</span>
                </p>
              </div>
              
              {session.start_time && (
                <div className="space-y-1">
                  <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Start</span>
                  </span>
                  <p className="font-mono text-xs bg-gradient-to-r from-blue-100/95 to-indigo-100/80 dark:from-blue-950/60 dark:to-indigo-950/50 px-2 py-1 rounded border border-blue-300/70 dark:border-blue-700/70 shadow-sm">
                    {mounted && session.start_time ? new Date(session.start_time).toLocaleString([], { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : '-'}
                  </p>
                </div>
              )}
            </div>
            
            {session.stop_time && (
              <div className="space-y-1">
                <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{t('live.stop_time')}</span>
                </span>
                <p className="font-mono text-xs bg-gradient-to-r from-red-100/95 to-rose-100/80 dark:from-red-950/60 dark:to-rose-950/50 px-2 py-1 rounded border border-red-300/70 dark:border-red-700/70 shadow-sm">
                  {mounted && session.stop_time ? new Date(session.stop_time).toLocaleString([], { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : '-'}
                </p>
              </div>
            )}
          </div>
          
          {/* Stream key - collapsible on mobile */}
          <div className="space-y-2">
            <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">
              {t('live.stream_key')}
            </span>
            <div className="relative">
              <p className="font-mono text-xs bg-gradient-to-r from-slate-200/95 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-700/60 p-2 rounded-lg border border-slate-300/70 dark:border-slate-700/70 break-all shadow-sm">
                {session.stream_key.length > 30 ? 
                  `${session.stream_key.substring(0, 30)}...` : 
                  session.stream_key
                }
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {showActions && actionButtons && (
          <div className="pt-2 border-t border-slate-300/70 dark:border-slate-700/70">
            {/* Mobile: Dropdown for multiple actions */}
            {actionButtons.length > 1 ? (
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full bg-gradient-to-r from-slate-100/95 to-slate-200/80 dark:from-slate-800/80 dark:to-slate-700/60 border-slate-300/70 dark:border-slate-700/70 shadow-sm">
                      <MoreVertical className="h-3 w-3 mr-2" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    {actionButtons.map((button) => {
                      const Icon = button.icon;
                      return (
                        <DropdownMenuItem 
                          key={button.action}
                          onClick={() => onAction?.(button.action, session.id)}
                          className={button.variant === 'destructive' ? 'text-red-600' : ''}
                        >
                          {Icon && <Icon className="h-3 w-3 mr-2" />}
                          {button.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              /* Single action button */
              <div className="sm:hidden">
                {actionButtons.map((button) => {
                  const Icon = button.icon;
                  return (
                    <Button
                      key={button.action}
                      size="sm"
                      variant={button.variant || 'outline'}
                      onClick={() => onAction?.(button.action, session.id)}
                      className="w-full"
                    >
                      {Icon && <Icon className="h-3 w-3 mr-2" />}
                      {button.label}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Desktop: Button row */}
            <div className="hidden sm:flex flex-wrap gap-2">
              {actionButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <Button
                    key={button.action}
                    size="sm"
                    variant={button.variant || 'outline'}
                    onClick={() => onAction?.(button.action, session.id)}
                    className="flex-1 min-w-0 bg-gradient-to-r from-slate-100/95 to-slate-200/80 dark:from-slate-800/80 dark:to-slate-700/60 border-slate-300/70 dark:border-slate-700/70 hover:from-slate-200/95 hover:to-slate-300/90 dark:hover:from-slate-700/90 dark:hover:to-slate-600/70 shadow-sm"
                  >
                    {Icon && <Icon className="h-3 w-3 mr-1" />}
                    <span className="truncate">{button.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}