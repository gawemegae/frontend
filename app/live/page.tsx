'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SessionCard } from '@/components/sessions/SessionCard';
import { LiveSessionForm } from '@/components/forms/LiveSessionForm';
import { useTranslations } from '@/hooks/use-translations';
import { useSocket } from '@/components/providers/SocketProvider';
import { getLiveSessions, stopSession } from '@/lib/api';
import { Session } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { Play, Calendar, Square, Search } from 'lucide-react';

export default function LivePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [stopSessionId, setStopSessionId] = useState<string | null>(null);
  const { t } = useTranslations();
  const socket = useSocket();

  const loadSessions = async () => {
    try {
      const data = await getLiveSessions();
      setSessions(data);
      setFilteredSessions(data);
    } catch (error) {
      toast.error('Failed to load live sessions');
      console.error('Live sessions error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();

    socket.on('sessions_update', loadSessions);
    return () => {
      socket.off('sessions_update', loadSessions);
    };
  }, [socket]);

  // Filter sessions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSessions(sessions);
    } else {
      const filtered = sessions.filter(session =>
        session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.video_file.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.platform.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSessions(filtered);
    }
  }, [searchQuery, sessions]);

  const handleStopSession = async (sessionId: string) => {
    try {
      await stopSession(sessionId);
      setStopSessionId(null);
      toast.success('Session stopped successfully');
    } catch (error) {
      toast.error('Failed to stop session');
      console.error('Stop session error:', error);
    }
  };

  const handleSessionAction = (action: string, sessionId: string) => {
    if (action === 'stop') {
      setStopSessionId(sessionId);
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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
              {t('live.title')}
              <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 text-rose-600 dark:text-rose-300 rounded-full text-lg font-bold border border-rose-200/50 dark:border-rose-700/50">
                {sessions.length}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your active live streams
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari sesi live..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-gradient-to-r from-slate-50/80 to-rose-50/60 dark:from-slate-900/40 dark:to-rose-950/30 border-slate-200/50 dark:border-slate-700/50 focus:border-rose-300 dark:focus:border-rose-600"
            />
          </div>
        </div>
        
        {/* Mobile: Stack buttons vertically, Desktop: Side by side */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <Dialog open={showManualForm} onOpenChange={setShowManualForm}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 border-0 shadow-lg shadow-rose-200/50 dark:shadow-rose-900/30">
                <Play className="h-4 w-4 mr-2" />
                {t('live.start_manual')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                  {t('live.start_manual')}
                </DialogTitle>
              </DialogHeader>
              <LiveSessionForm
                type="manual"
                onSubmit={() => setShowManualForm(false)}
                onCancel={() => setShowManualForm(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showScheduleForm} onOpenChange={setShowScheduleForm}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto border-sky-200/50 hover:bg-gradient-to-r hover:from-sky-50/80 hover:to-blue-50/60 dark:border-sky-700/50 dark:hover:from-sky-950/30 dark:hover:to-blue-950/30 shadow-lg shadow-sky-200/30 dark:shadow-sky-900/20">
                <Calendar className="h-4 w-4 mr-2" />
                {t('live.schedule_new')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle className="bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
                  {t('live.schedule_new')}
                </DialogTitle>
              </DialogHeader>
              <LiveSessionForm
                type="scheduled"
                onSubmit={() => setShowScheduleForm(false)}
                onCancel={() => setShowScheduleForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="bg-gradient-to-br from-slate-50/80 to-rose-50/60 dark:from-slate-900/40 dark:to-rose-950/30 rounded-lg p-8 mx-4 border border-slate-200/30 dark:border-slate-700/30">
            <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">
              {searchQuery ? 'No sessions found' : 'No active live sessions'}
            </p>
            <p className="text-sm">
              {searchQuery ? 'Try adjusting your search terms' : 'Start a new session to begin streaming'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onAction={handleSessionAction}
              actionButtons={[
                {
                  label: t('live.stop'),
                  action: 'stop',
                  variant: 'destructive',
                  icon: Square,
                },
              ]}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!stopSessionId} onOpenChange={() => setStopSessionId(null)}>
        <AlertDialogContent className="mx-4 sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('live.stop')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('live.confirm_stop')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => stopSessionId && handleStopSession(stopSessionId)}
              className="w-full sm:w-auto"
            >
              {t('live.stop')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}