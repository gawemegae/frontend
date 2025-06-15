'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { socketManager } from '@/lib/socket';
import { useAppStore } from '@/lib/store';

const SocketContext = createContext(socketManager);

export function useSocket() {
  return useContext(SocketContext);
}

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const setTrialMode = useAppStore((state) => state.setTrialMode);

  useEffect(() => {
    socketManager.connect();

    // Listen for trial status updates
    socketManager.on('trial_status_update', (data: { active: boolean }) => {
      setTrialMode(data.active);
    });

    socketManager.on('trial_reset_notification', () => {
      setTrialMode(true);
    });

    return () => {
      socketManager.disconnect();
    };
  }, [setTrialMode]);

  return (
    <SocketContext.Provider value={socketManager}>
      {children}
    </SocketContext.Provider>
  );
}