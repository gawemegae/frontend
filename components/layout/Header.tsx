'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Globe, Clock, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/lib/store';
import { useTranslations } from '@/hooks/use-translations';
import Image from 'next/image';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, trialMode } = useAppStore();
  const { t } = useTranslations();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update time every second
  useEffect(() => {
    if (!mounted) return;
    
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleString(language === 'id' ? 'id-ID' : 'en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [language, mounted]);

  if (!mounted) {
    return (
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="relative h-8 w-10 md:h-10 md:w-12">
                <div className="h-8 w-10 md:h-10 md:w-12 rounded-lg bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center">
                  <span className="font-bold text-white text-xs md:text-sm">SH</span>
                </div>
              </div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
                StreamHib
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Globe className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">EN</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Sun className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="relative h-8 w-10 md:h-10 md:w-12 flex-shrink-0">
              <Image
                src="/logostreamhib.png"
                alt="StreamHib Logo"
                width={48}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
              StreamHib
            </h1>
          </div>
          
          {trialMode && (
            <div className="hidden lg:block">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-sm font-medium animate-pulse border border-amber-200 dark:border-amber-800">
                {t('header.trial_mode')}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Time display - hidden on small screens */}
          <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="font-mono">{currentTime}</span>
          </div>

          {/* Mobile time display - compact */}
          <div className="lg:hidden flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span className="font-mono">
              {mounted && new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="bg-muted/50 hover:bg-muted">
                <Globe className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{language.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('id')}>
                🇮🇩 Bahasa Indonesia
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title={t('header.theme_toggle')}
            className="bg-muted/50 hover:bg-muted"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t('header.theme_toggle')}</span>
          </Button>
        </div>
      </div>
      
      {trialMode && (
        <div className="lg:hidden bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-200 px-4 py-2 text-center text-sm font-medium border-t border-amber-200 dark:border-amber-800">
          {t('header.trial_mode')}
        </div>
      )}
    </header>
  );
}