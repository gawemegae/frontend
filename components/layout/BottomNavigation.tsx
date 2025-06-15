'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/use-translations';
import {
  LayoutDashboard,
  Video,
  Radio,
  Calendar,
  Archive,
  Youtube,
} from 'lucide-react';

const navigation = [
  {
    name: 'nav.dashboard',
    href: '/',
    icon: LayoutDashboard,
    shortName: 'Dasbor'
  },
  {
    name: 'nav.videos',
    href: '/videos',
    icon: Video,
    shortName: 'Video'
  },
  {
    name: 'nav.live',
    href: '/live',
    icon: Radio,
    shortName: 'Live'
  },
  {
    name: 'nav.schedules',
    href: '/schedules',
    icon: Calendar,
    shortName: 'Jadwal'
  },
  {
    name: 'nav.inactive',
    href: '/inactive',
    icon: Archive,
    shortName: 'Arsip'
  },
  {
    name: 'nav.youtube',
    href: '/youtube-automation',
    icon: Youtube,
    shortName: 'YT Auto'
  },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useTranslations();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/98 dark:bg-slate-900/98 border-t border-slate-300/60 dark:border-slate-700/60 backdrop-blur-md shadow-xl">
      <nav className="flex justify-around px-0.5">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 px-1 text-xs font-medium min-w-0 flex-1 transition-all duration-200',
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              <div className={cn(
                'p-1 rounded-lg transition-all duration-200 mb-0.5',
                isActive 
                  ? 'bg-indigo-100/90 dark:bg-indigo-900/60 shadow-sm' 
                  : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              )}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="truncate leading-tight text-[9px] font-medium">
                {item.shortName}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}