'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Crown, LayoutDashboard, Package, TrendingUp, Ticket, ShoppingCart, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { Button } from '@ronda/ui';
import { useI18n } from '../lib/i18n';
import { isAuthenticated, logout } from '../lib/api';

export function Shell({ children }: { children: React.ReactNode }) {
  const { t, lang, setLang, dir } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated()) router.replace('/login');
  }, [router]);

  const nav = [
    { href: '/', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/products', label: t('products'), icon: Package },
    { href: '/smm', label: t('smm'), icon: TrendingUp },
    { href: '/coupons', label: t('coupons'), icon: Ticket },
    { href: '/orders', label: t('orders'), icon: ShoppingCart },
    { href: '/settings', label: t('settings'), icon: SettingsIcon },
  ];

  return (
    <div className="flex min-h-screen" dir={dir}>
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Crown className="h-5 w-5 text-sidebar-primary" />
          <p className="text-sm font-bold text-white">{t('app_name')}</p>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-2 p-3">
          <div className="flex gap-2">
            <Button
              variant={lang === 'ar' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setLang('ar')}
            >
              عربي
            </Button>
            <Button
              variant={lang === 'en' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setLang('en')}
            >
              EN
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground"
            onClick={() => {
              logout();
              router.replace('/login');
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t('logout')}
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-background p-6">{children}</main>
    </div>
  );
}
