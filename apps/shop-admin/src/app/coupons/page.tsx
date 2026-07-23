'use client';

import * as React from 'react';
import { PageHeader, Button, Card, CardContent, Input, Label, Badge, DataTable } from '@ronda/ui';
import { Shell } from '../../components/Shell';
import { useI18n } from '../../lib/i18n';
import { api, ApiError } from '../../lib/api';

type Coupon = {
  id: string;
  code: string;
  kind: 'REGULAR' | 'AFFILIATE';
  type: 'PERCENT' | 'FIXED';
  value: number;
  ownerTelegramId: string | null;
  affiliateCommissionPercent: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
};

const emptyForm = {
  id: '',
  code: '',
  kind: 'REGULAR' as 'REGULAR' | 'AFFILIATE',
  type: 'PERCENT' as 'PERCENT' | 'FIXED',
  value: 10,
  ownerTelegramId: '',
  affiliateCommissionPercent: '',
  usageLimit: '',
  expiresAt: '',
  isActive: true,
};

export default function CouponsPage() {
  const { t } = useI18n();
  const [kind, setKind] = React.useState<'REGULAR' | 'AFFILIATE'>('REGULAR');
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [form, setForm] = React.useState(emptyForm);
  const [showForm, setShowForm] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setCoupons(await api.get<Coupon[]>(`/coupons?kind=${kind}`));
  }, [kind]);

  React.useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        code: form.code,
        kind: form.kind,
        type: form.type,
        value: Number(form.value),
        ownerTelegramId: form.kind === 'AFFILIATE' ? form.ownerTelegramId : null,
        affiliateCommissionPercent: form.kind === 'AFFILIATE' ? Number(form.affiliateCommissionPercent) : null,
        usageLimit: form.usageLimit === '' ? null : Number(form.usageLimit),
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        isActive: form.isActive,
      };
      if (form.id) await api.put(`/coupons/${form.id}`, payload);
      else await api.post('/coupons', payload);
      setShowForm(false);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    }
  }

  return (
    <Shell>
      <PageHeader title={t('coupons')} />

      <div className="mb-4 flex justify-between">
        <div className="flex gap-2">
          <Button variant={kind === 'REGULAR' ? 'default' : 'outline'} size="sm" onClick={() => setKind('REGULAR')}>Regular</Button>
          <Button variant={kind === 'AFFILIATE' ? 'default' : 'outline'} size="sm" onClick={() => setKind('AFFILIATE')}>Affiliate</Button>
        </div>
        <Button size="sm" onClick={() => { setForm({ ...emptyForm, kind }); setShowForm(true); }}>{t('add')}</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Code</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Discount type</Label>
                <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'PERCENT' | 'FIXED' })}>
                  <option value="PERCENT">Percent</option>
                  <option value="FIXED">Fixed (Stars)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Value</Label>
                <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Usage limit</Label>
                <Input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="unlimited" />
              </div>
              {form.kind === 'AFFILIATE' && (
                <>
                  <div className="space-y-1.5">
                    <Label>Affiliate Telegram ID</Label>
                    <Input value={form.ownerTelegramId} onChange={(e) => setForm({ ...form, ownerTelegramId: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Commission %</Label>
                    <Input type="number" value={form.affiliateCommissionPercent} onChange={(e) => setForm({ ...form, affiliateCommissionPercent: e.target.value })} required />
                  </div>
                </>
              )}
              <div className="space-y-1.5">
                <Label>Expires at</Label>
                <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                <Label>{t('active')}</Label>
              </div>
              {error && <p className="text-sm text-destructive md:col-span-2">{error}</p>}
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit">{t('save')}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('cancel')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <DataTable
        columns={[
          { key: 'code', header: 'Code', render: (r: Coupon) => <code className="rounded bg-muted px-1 text-xs">{r.code}</code> },
          { key: 'type', header: 'Type' },
          { key: 'value', header: 'Value' },
          ...(kind === 'AFFILIATE' ? [{ key: 'affiliateCommissionPercent', header: 'Commission %' }] : []),
          { key: 'usedCount', header: 'Used' },
          { key: 'isActive', header: 'Status', render: (r: Coupon) => <Badge variant={r.isActive ? 'success' : 'secondary'}>{r.isActive ? t('active') : t('inactive')}</Badge> },
          {
            key: 'actions', header: '', render: (r: Coupon) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setForm({
                      id: r.id,
                      code: r.code,
                      kind: r.kind,
                      type: r.type,
                      value: r.value,
                      ownerTelegramId: r.ownerTelegramId ?? '',
                      affiliateCommissionPercent: r.affiliateCommissionPercent?.toString() ?? '',
                      usageLimit: r.usageLimit?.toString() ?? '',
                      expiresAt: r.expiresAt ? r.expiresAt.slice(0, 10) : '',
                      isActive: r.isActive,
                    });
                    setShowForm(true);
                  }}
                >{t('edit')}</Button>
                <Button size="sm" variant="ghost" onClick={async () => { await api.delete(`/coupons/${r.id}`); await load(); }}>{t('delete')}</Button>
              </div>
            ),
          },
        ]}
        data={coupons}
      />
    </Shell>
  );
}
