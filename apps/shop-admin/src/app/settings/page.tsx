'use client';

import * as React from 'react';
import { PageHeader, Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@ronda/ui';
import { Shell } from '../../components/Shell';
import { useI18n } from '../../lib/i18n';
import { api } from '../../lib/api';

interface Setting {
  key: string;
  value: string;
}

const FIELDS: { key: string; label: string; type?: string; secret?: boolean }[] = [
  { key: 'global_profit_percent', label: 'Global profit % (applied when a product/service has no override)' },
  { key: 'stars_per_usd', label: 'Telegram Stars per 1 USD (used to price in ⭐)' },
  { key: 'default_language', label: 'Default language (ar or en)' },
  { key: 'support_username', label: 'Support Telegram username' },
  { key: 'g2a_client_id', label: 'G2A Client/Key ID' },
  { key: 'g2a_api_key', label: 'G2A API Secret', secret: true },
  { key: 'g2a_base_url', label: 'G2A API base URL' },
];

export default function SettingsPage() {
  const { t } = useI18n();
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [saved, setSaved] = React.useState(false);

  const load = React.useCallback(async () => {
    const rows = await api.get<Setting[]>('/settings');
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    setValues(map);
  }, []);

  React.useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  async function onSave() {
    setSaved(false);
    await Promise.all(FIELDS.map((f) => api.put(`/settings/${f.key}`, { value: values[f.key] ?? '' })));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Shell>
      <PageHeader title={t('settings')} />
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Pricing &amp; Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label>{f.label}</Label>
              <Input
                type={f.secret ? 'password' : 'text'}
                value={values[f.key] ?? ''}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                placeholder={f.secret && values[f.key] === '••••••••' ? 'Unchanged — type a new value to replace' : undefined}
              />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <Button onClick={onSave}>{t('save')}</Button>
            {saved && <span className="text-sm text-green-600">Saved.</span>}
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
}
