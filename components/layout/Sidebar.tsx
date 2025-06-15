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
  },
  {
    name: 'nav.videos',
    href: '/videos',
    icon: Video,
  },
  {
    name: 'nav.live',
    href: '/live',
    icon: Radio,
  },
  {
    name: 'nav.schedules',
    href: '/schedules',
    icon: Calendar,
  },
  {
    name: 'nav.inactive',
    href: '/inactive',
    icon: Archive,
  },
  {
    name: 'nav.youtube',
    href: '/youtube-automation',
    icon: Youtube,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslations();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-background border-r">
        <div className="flex flex-col flex-grow">
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  {t(item.name)}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}