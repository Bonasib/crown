'use client';

import * as React from 'react';
import { PageHeader, StatCard, Card, CardContent, CardHeader, CardTitle, Badge } from '@ronda/ui';
import { Package, TrendingUp, Coins } from 'lucide-react';
import { Shell } from '../components/Shell';
import { useI18n } from '../lib/i18n';
import { api } from '../lib/api';

interface DashboardStats {
  ordersByStatus: { status: string; count: number }[];
  revenueStars: number;
  profitMinor: number;
  productCount: number;
  smmServiceCount: number;
  activeCouponCount: number;
}

export default function DashboardPage() {
  const { t } = useI18n();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);

  React.useEffect(() => {
    api.get<DashboardStats>('/stats/dashboard').then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <Shell>
      <PageHeader title={t('dashboard')} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard title={t('revenue_stars')} value={stats ? `⭐ ${stats.revenueStars}` : '…'} icon={<Coins className="h-4 w-4" />} />
        <StatCard
          title={t('profit_estimate')}
          value={stats ? `$${(stats.profitMinor / 100).toFixed(2)}` : '…'}
          icon={<Coins className="h-4 w-4" />}
        />
        <StatCard title={t('total_products')} value={stats?.productCount ?? '…'} description={t('catalog_limit')} icon={<Package className="h-4 w-4" />} />
        <StatCard title={t('total_smm_services')} value={stats?.smmServiceCount ?? '…'} icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('orders_by_status')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {stats?.ordersByStatus.map((s) => (
                <div key={s.status} className="flex items-center justify-between">
                  <Badge variant="secondary">{s.status}</Badge>
                  <span className="font-medium">{s.count}</span>
                </div>
              ))}
              {!stats && <p className="text-muted-foreground">…</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('active_coupons')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeCouponCount ?? '…'}</div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
