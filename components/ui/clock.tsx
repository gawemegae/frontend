'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="flex items-center space-x-2 text-sm font-medium">
      <Clock className="h-4 w-4 text-blue-500" />
      <div className="flex flex-col items-end">
        <span className="text-foreground font-mono">{formatTime(time)}</span>
        <span className="text-xs text-muted-foreground">{formatDate(time)}</span>
      </div>
    </div>
  );
}