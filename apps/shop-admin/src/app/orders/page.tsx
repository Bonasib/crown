'use client';

import * as React from 'react';
import { PageHeader, Badge, DataTable, Button } from '@ronda/ui';
import { Shell } from '../../components/Shell';
import { useI18n } from '../../lib/i18n';
import { api } from '../../lib/api';

type Order = {
  id: string;
  telegramUserId: string;
  type: 'PRODUCT' | 'SMM';
  quantity: number;
  totalStars: number;
  status: string;
  createdAt: string;
  product?: { nameEn: string; nameAr: string } | null;
  smmService?: { nameEn: string; nameAr: string } | null;
};

const STATUS_VARIANT: Record<string, 'success' | 'secondary' | 'destructive'> = {
  DELIVERED: 'success',
  PAID: 'success',
  PROCESSING: 'secondary',
  PENDING_PAYMENT: 'secondary',
  FAILED: 'destructive',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
};

export default function OrdersPage() {
  const { t, lang } = useI18n();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [status, setStatus] = React.useState<string>('');
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const load = React.useCallback(async () => {
    const qs = new URLSearchParams({ page: String(page), pageSize: '25', ...(status ? { status } : {}) });
    const res = await api.get<{ items: Order[]; total: number }>(`/orders?${qs.toString()}`);
    setOrders(res.items);
    setTotal(res.total);
  }, [page, status]);

  React.useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  return (
    <Shell>
      <PageHeader title={t('orders')} />

      <div className="mb-4 flex flex-wrap gap-2">
        {['', 'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'DELIVERED', 'FAILED', 'REFUNDED'].map((s) => (
          <Button key={s || 'all'} variant={status === s ? 'default' : 'outline'} size="sm" onClick={() => { setStatus(s); setPage(1); }}>
            {s || 'All'}
          </Button>
        ))}
      </div>

      <DataTable
        columns={[
          { key: 'id', header: 'ID', render: (r: Order) => <code className="text-xs">{r.id.slice(-8)}</code> },
          { key: 'telegramUserId', header: 'User' },
          { key: 'type', header: 'Type' },
          {
            key: 'item', header: 'Item', render: (r: Order) => {
              const item = r.product ?? r.smmService;
              return item ? (lang === 'ar' ? item.nameAr : item.nameEn) : '—';
            },
          },
          { key: 'quantity', header: 'Qty' },
          { key: 'totalStars', header: 'Total', render: (r: Order) => `⭐ ${r.totalStars}` },
          { key: 'status', header: 'Status', render: (r: Order) => <Badge variant={STATUS_VARIANT[r.status] ?? 'secondary'}>{r.status}</Badge> },
          { key: 'createdAt', header: 'Date', render: (r: Order) => new Date(r.createdAt).toLocaleString() },
        ]}
        data={orders}
      />

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} orders</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <Button size="sm" variant="outline" disabled={page * 25 >= total} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </Shell>
  );
}
