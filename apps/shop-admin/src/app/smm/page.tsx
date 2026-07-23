'use client';

import * as React from 'react';
import { PageHeader, Button, Card, CardContent, Input, Label, Badge, DataTable } from '@ronda/ui';
import { Shell } from '../../components/Shell';
import { useI18n } from '../../lib/i18n';
import { api, ApiError } from '../../lib/api';

type Provider = {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  isActive: boolean;
};

type SmmCategory = {
  id: string;
  nameAr: string;
  nameEn: string;
};

type Service = {
  id: string;
  providerId: string;
  categoryId: string | null;
  nameAr: string;
  nameEn: string;
  platform: string;
  type: string;
  providerServiceId: string;
  costPer1000Minor: number;
  profitPercent: number | null;
  minQuantity: number;
  maxQuantity: number;
  isActive: boolean;
};

type Tab = 'services' | 'providers' | 'categories';

const emptyProvider = { id: '', name: '', baseUrl: '', apiKey: '', isActive: true };
const emptyCategory = { id: '', nameAr: '', nameEn: '' };
const emptyService = {
  id: '',
  providerId: '',
  categoryId: '',
  nameAr: '',
  nameEn: '',
  platform: '',
  type: '',
  providerServiceId: '',
  costPer1000Minor: 0,
  profitPercent: '',
  minQuantity: 100,
  maxQuantity: 10000,
  isActive: true,
};

export default function SmmPage() {
  const { t, lang } = useI18n();
  const [tab, setTab] = React.useState<Tab>('services');
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [categories, setCategories] = React.useState<SmmCategory[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);

  const [providerForm, setProviderForm] = React.useState(emptyProvider);
  const [categoryForm, setCategoryForm] = React.useState(emptyCategory);
  const [serviceForm, setServiceForm] = React.useState(emptyService);
  const [showProviderForm, setShowProviderForm] = React.useState(false);
  const [showCategoryForm, setShowCategoryForm] = React.useState(false);
  const [showServiceForm, setShowServiceForm] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const [p, c, s] = await Promise.all([
      api.get<Provider[]>('/smm-providers'),
      api.get<SmmCategory[]>('/smm-categories'),
      api.get<Service[]>('/smm-services'),
    ]);
    setProviders(p);
    setCategories(c);
    setServices(s);
  }, []);

  React.useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  async function saveProvider(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const payload = { name: providerForm.name, baseUrl: providerForm.baseUrl, apiKey: providerForm.apiKey, isActive: providerForm.isActive };
      if (providerForm.id) await api.put(`/smm-providers/${providerForm.id}`, payload);
      else await api.post('/smm-providers', payload);
      setShowProviderForm(false);
      setProviderForm(emptyProvider);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    }
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const payload = { nameAr: categoryForm.nameAr, nameEn: categoryForm.nameEn };
      if (categoryForm.id) await api.put(`/smm-categories/${categoryForm.id}`, payload);
      else await api.post('/smm-categories', payload);
      setShowCategoryForm(false);
      setCategoryForm(emptyCategory);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    }
  }

  async function saveService(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        providerId: serviceForm.providerId,
        categoryId: serviceForm.categoryId || null,
        nameAr: serviceForm.nameAr,
        nameEn: serviceForm.nameEn,
        platform: serviceForm.platform,
        type: serviceForm.type,
        providerServiceId: serviceForm.providerServiceId,
        costPer1000Minor: Number(serviceForm.costPer1000Minor),
        profitPercent: serviceForm.profitPercent === '' ? null : Number(serviceForm.profitPercent),
        minQuantity: Number(serviceForm.minQuantity),
        maxQuantity: Number(serviceForm.maxQuantity),
        isActive: serviceForm.isActive,
      };
      if (serviceForm.id) await api.put(`/smm-services/${serviceForm.id}`, payload);
      else await api.post('/smm-services', payload);
      setShowServiceForm(false);
      setServiceForm(emptyService);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    }
  }

  return (
    <Shell>
      <PageHeader title={t('smm')} />

      <div className="mb-4 flex gap-2">
        <Button variant={tab === 'services' ? 'default' : 'outline'} size="sm" onClick={() => setTab('services')}>Services</Button>
        <Button variant={tab === 'providers' ? 'default' : 'outline'} size="sm" onClick={() => setTab('providers')}>Providers</Button>
        <Button variant={tab === 'categories' ? 'default' : 'outline'} size="sm" onClick={() => setTab('categories')}>Categories</Button>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {tab === 'providers' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button size="sm" onClick={() => { setProviderForm(emptyProvider); setShowProviderForm(true); }}>{t('add')}</Button>
          </div>
          {showProviderForm && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <form onSubmit={saveProvider} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Name</Label>
                    <Input value={providerForm.name} onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Base URL</Label>
                    <Input value={providerForm.baseUrl} onChange={(e) => setProviderForm({ ...providerForm, baseUrl: e.target.value })} placeholder="https://provider.com/api/v2" required />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>API Key</Label>
                    <Input value={providerForm.apiKey} onChange={(e) => setProviderForm({ ...providerForm, apiKey: e.target.value })} required />
                  </div>
                  <div className="flex gap-2 md:col-span-2">
                    <Button type="submit">{t('save')}</Button>
                    <Button type="button" variant="outline" onClick={() => setShowProviderForm(false)}>{t('cancel')}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          <DataTable
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'baseUrl', header: 'Base URL' },
              { key: 'isActive', header: 'Status', render: (r: Provider) => <Badge variant={r.isActive ? 'success' : 'secondary'}>{r.isActive ? t('active') : t('inactive')}</Badge> },
              {
                key: 'actions', header: '', render: (r: Provider) => (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setProviderForm({ ...r }); setShowProviderForm(true); }}>{t('edit')}</Button>
                    <Button size="sm" variant="ghost" onClick={async () => { await api.delete(`/smm-providers/${r.id}`); await load(); }}>{t('delete')}</Button>
                  </div>
                ),
              },
            ]}
            data={providers}
          />
        </>
      )}

      {tab === 'categories' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button size="sm" onClick={() => { setCategoryForm(emptyCategory); setShowCategoryForm(true); }}>{t('add')}</Button>
          </div>
          {showCategoryForm && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <form onSubmit={saveCategory} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>{t('name_ar')}</Label>
                    <Input dir="rtl" value={categoryForm.nameAr} onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('name_en')}</Label>
                    <Input value={categoryForm.nameEn} onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })} required />
                  </div>
                  <div className="flex gap-2 md:col-span-2">
                    <Button type="submit">{t('save')}</Button>
                    <Button type="button" variant="outline" onClick={() => setShowCategoryForm(false)}>{t('cancel')}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          <DataTable
            columns={[
              { key: 'name', header: 'Name', render: (r: SmmCategory) => (lang === 'ar' ? r.nameAr : r.nameEn) },
              {
                key: 'actions', header: '', render: (r: SmmCategory) => (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setCategoryForm(r); setShowCategoryForm(true); }}>{t('edit')}</Button>
                    <Button size="sm" variant="ghost" onClick={async () => { await api.delete(`/smm-categories/${r.id}`); await load(); }}>{t('delete')}</Button>
                  </div>
                ),
              },
            ]}
            data={categories}
          />
        </>
      )}

      {tab === 'services' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button size="sm" disabled={providers.length === 0} onClick={() => { setServiceForm(emptyService); setShowServiceForm(true); }}>{t('add')}</Button>
          </div>
          {providers.length === 0 && <p className="mb-4 text-sm text-muted-foreground">Add a provider first.</p>}
          {showServiceForm && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <form onSubmit={saveService} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Provider</Label>
                    <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={serviceForm.providerId} onChange={(e) => setServiceForm({ ...serviceForm, providerId: e.target.value })} required>
                      <option value="">—</option>
                      {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('category')}</Label>
                    <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={serviceForm.categoryId} onChange={(e) => setServiceForm({ ...serviceForm, categoryId: e.target.value })}>
                      <option value="">—</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{lang === 'ar' ? c.nameAr : c.nameEn}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('name_ar')}</Label>
                    <Input dir="rtl" value={serviceForm.nameAr} onChange={(e) => setServiceForm({ ...serviceForm, nameAr: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('name_en')}</Label>
                    <Input value={serviceForm.nameEn} onChange={(e) => setServiceForm({ ...serviceForm, nameEn: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Platform (instagram, tiktok, ...)</Label>
                    <Input value={serviceForm.platform} onChange={(e) => setServiceForm({ ...serviceForm, platform: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Type (followers, likes, views, ...)</Label>
                    <Input value={serviceForm.type} onChange={(e) => setServiceForm({ ...serviceForm, type: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Provider Service ID</Label>
                    <Input value={serviceForm.providerServiceId} onChange={(e) => setServiceForm({ ...serviceForm, providerServiceId: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cost per 1000 (USD cents)</Label>
                    <Input type="number" value={serviceForm.costPer1000Minor} onChange={(e) => setServiceForm({ ...serviceForm, costPer1000Minor: Number(e.target.value) })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('profit_percent')} (override)</Label>
                    <Input value={serviceForm.profitPercent} onChange={(e) => setServiceForm({ ...serviceForm, profitPercent: e.target.value })} placeholder="global default" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Min quantity</Label>
                    <Input type="number" value={serviceForm.minQuantity} onChange={(e) => setServiceForm({ ...serviceForm, minQuantity: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Max quantity</Label>
                    <Input type="number" value={serviceForm.maxQuantity} onChange={(e) => setServiceForm({ ...serviceForm, maxQuantity: Number(e.target.value) })} />
                  </div>
                  <div className="flex gap-2 md:col-span-2">
                    <Button type="submit">{t('save')}</Button>
                    <Button type="button" variant="outline" onClick={() => setShowServiceForm(false)}>{t('cancel')}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          <DataTable
            columns={[
              { key: 'name', header: 'Name', render: (r: Service) => (lang === 'ar' ? r.nameAr : r.nameEn) },
              { key: 'platform', header: 'Platform' },
              { key: 'type', header: 'Type' },
              { key: 'costPer1000Minor', header: 'Cost/1000', render: (r: Service) => `$${(r.costPer1000Minor / 100).toFixed(2)}` },
              { key: 'isActive', header: 'Status', render: (r: Service) => <Badge variant={r.isActive ? 'success' : 'secondary'}>{r.isActive ? t('active') : t('inactive')}</Badge> },
              {
                key: 'actions', header: '', render: (r: Service) => (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setServiceForm({ ...r, profitPercent: r.profitPercent?.toString() ?? '', categoryId: r.categoryId ?? '' }); setShowServiceForm(true); }}>{t('edit')}</Button>
                    <Button size="sm" variant="ghost" onClick={async () => { await api.delete(`/smm-services/${r.id}`); await load(); }}>{t('delete')}</Button>
                  </div>
                ),
              },
            ]}
            data={services}
          />
        </>
      )}
    </Shell>
  );
}
