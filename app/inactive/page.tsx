'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SessionCard } from '@/components/sessions/SessionCard';
import { LiveSessionForm } from '@/components/forms/LiveSessionForm';
import { useTranslations } from '@/hooks/use-translations';
import { useSocket } from '@/components/providers/SocketProvider';
import { getInactiveSessions, reactivateSession, deleteSession, deleteAllInactiveSessions } from '@/lib/api';
import { Session } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { Trash2, Play, Edit, Archive, Search } from 'lucide-react';

export default function InactivePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const { t } = useTranslations();
  const socket = useSocket();

  const loadSessions = async () => {
    try {
      const data = await getInactiveSessions();
      setSessions(data);
      setFilteredSessions(data);
    } catch (error) {
      toast.error('Failed to load inactive sessions');
      console.error('Inactive sessions error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();

    socket.on('inactive_sessions_update', loadSessions);
    return () => {
      socket.off('inactive_sessions_update', loadSessions);
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

  const handleReactivate = async (sessionId: string) => {
    try {
      await reactivateSession(sessionId);
      toast.success('Session reactivated successfully');
    } catch (error) {
      toast.error('Failed to reactivate session');
      console.error('Reactivate error:', error);
    }
  };

  const handleDelete = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      toast.success('Session deleted successfully');
    } catch (error) {
      toast.error('Failed to delete session');
      console.error('Delete session error:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllInactiveSessions();
      toast.success('All inactive sessions deleted successfully');
    } catch (error) {
      toast.error('Failed to delete all sessions');
      console.error('Delete all error:', error);
    }
  };

  const handleSessionAction = (action: string, sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    switch (action) {
      case 'reactivate':
        handleReactivate(sessionId);
        break;
      case 'edit':
        setEditSession(session);
        break;
      case 'delete':
        handleDelete(sessionId);
        break;
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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-3">
              {t('inactive.title')}
              <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-600 dark:text-amber-300 rounded-full text-lg font-bold border border-amber-200/50 dark:border-amber-700/50">
                {sessions.length}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              View and manage your stream history
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari sesi tidak aktif..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-gradient-to-r from-slate-50/80 to-amber-50/60 dark:from-slate-900/40 dark:to-amber-950/30 border-slate-200/50 dark:border-slate-700/50 focus:border-amber-300 dark:focus:border-amber-600"
            />
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto bg-gradient-to-r from-red-400 to-rose-400 hover:from-red-500 hover:to-rose-500 border-0">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('inactive.delete_all')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="mx-4 sm:mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('inactive.delete_all')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('inactive.confirm_delete_all')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto">{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll} className="w-full sm:w-auto">
                    {t('common.confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {filteredSessions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="bg-gradient-to-br from-slate-50/80 to-amber-50/60 dark:from-slate-900/40 dark:to-amber-950/30 rounded-lg p-8 mx-4 border border-slate-200/30 dark:border-slate-700/30">
            <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">
              {searchQuery ? 'No inactive sessions found' : 'No inactive sessions found'}
            </p>
            <p className="text-sm">
              {searchQuery ? 'Try adjusting your search terms' : 'Your completed streams will appear here'}
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
                  label: t('inactive.reactivate'),
                  action: 'reactivate',
                  variant: 'default',
                  icon: Play,
                },
                {
                  label: t('inactive.edit_reschedule'),
                  action: 'edit',
                  variant: 'outline',
                  icon: Edit,
                },
                {
                  label: t('videos.delete'),
                  action: 'delete',
                  variant: 'destructive',
                  icon: Trash2,
                },
              ]}
            />
          ))}
        </div>
      )}

      <Dialog open={!!editSession} onOpenChange={() => setEditSession(null)}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              {t('inactive.edit_reschedule')}
            </DialogTitle>
          </DialogHeader>
          {editSession && (
            <LiveSessionForm
              type="scheduled"
              onSubmit={() => setEditSession(null)}
              onCancel={() => setEditSession(null)}
              initialData={{
                name: editSession.name,
                video_file: editSession.video_file,
                platform: editSession.platform,
                stream_key: editSession.stream_key,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}