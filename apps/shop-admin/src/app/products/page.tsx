'use client';

import * as React from 'react';
import { PageHeader, Button, Card, CardContent, Input, Label, Badge, DataTable } from '@ronda/ui';
import { Shell } from '../../components/Shell';
import { useI18n } from '../../lib/i18n';
import { api, ApiError } from '../../lib/api';

type Category = {
  id: string;
  nameAr: string;
  nameEn: string;
};

type Product = {
  id: string;
  categoryId: string | null;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  sourceType: 'MANUAL' | 'G2A';
  externalRef: string | null;
  costMinor: number;
  profitPercent: number | null;
  deliveryType: 'TEXT' | 'FILE' | 'KEYS';
  deliveryContent: string | null;
  fileUrl: string | null;
  isActive: boolean;
  _count?: { keys: number };
};

const emptyForm = {
  id: '',
  categoryId: '',
  nameAr: '',
  nameEn: '',
  descriptionAr: '',
  descriptionEn: '',
  sourceType: 'MANUAL' as 'MANUAL' | 'G2A',
  externalRef: '',
  costMinor: 0,
  profitPercent: '',
  deliveryType: 'TEXT' as 'TEXT' | 'FILE' | 'KEYS',
  deliveryContent: '',
  fileUrl: '',
  isActive: true,
};

export default function ProductsPage() {
  const { t, lang } = useI18n();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [form, setForm] = React.useState(emptyForm);
  const [editing, setEditing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [keysProductId, setKeysProductId] = React.useState<string | null>(null);
  const [keysText, setKeysText] = React.useState('');

  const load = React.useCallback(async () => {
    const [p, c] = await Promise.all([api.get<Product[]>('/products'), api.get<Category[]>('/categories')]);
    setProducts(p);
    setCategories(c);
  }, []);

  React.useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  function startEdit(p: Product) {
    setForm({
      id: p.id,
      categoryId: p.categoryId ?? '',
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      descriptionAr: p.descriptionAr ?? '',
      descriptionEn: p.descriptionEn ?? '',
      sourceType: p.sourceType,
      externalRef: p.externalRef ?? '',
      costMinor: p.costMinor,
      profitPercent: p.profitPercent?.toString() ?? '',
      deliveryType: p.deliveryType,
      deliveryContent: p.deliveryContent ?? '',
      fileUrl: p.fileUrl ?? '',
      isActive: p.isActive,
    });
    setEditing(true);
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      categoryId: form.categoryId || null,
      nameAr: form.nameAr,
      nameEn: form.nameEn,
      descriptionAr: form.descriptionAr || null,
      descriptionEn: form.descriptionEn || null,
      sourceType: form.sourceType,
      externalRef: form.externalRef || null,
      costMinor: Number(form.costMinor),
      profitPercent: form.profitPercent === '' ? null : Number(form.profitPercent),
      deliveryType: form.deliveryType,
      deliveryContent: form.deliveryContent || null,
      fileUrl: form.fileUrl || null,
      isActive: form.isActive,
    };
    try {
      if (form.id) {
        await api.put(`/products/${form.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setForm(emptyForm);
      setEditing(false);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    await load();
  }

  async function onAddKeys() {
    if (!keysProductId) return;
    const values = keysText.split('\n').map((v) => v.trim()).filter(Boolean);
    if (values.length === 0) return;
    await api.post(`/products/${keysProductId}/keys`, { values });
    setKeysText('');
    setKeysProductId(null);
    await load();
  }

  return (
    <Shell>
      <PageHeader title={t('products')} description={`${products.length}/200 — ${t('catalog_limit')}`} action={
        <Button size="sm" onClick={() => { setForm(emptyForm); setEditing(true); }}>{t('add')}</Button>
      } />

      {editing && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>{t('name_ar')}</Label>
                <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required dir="rtl" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('name_en')}</Label>
                <Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>{t('category')}</Label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                >
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {lang === 'ar' ? c.nameAr : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Source</Label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.sourceType}
                  onChange={(e) => setForm({ ...form, sourceType: e.target.value as 'MANUAL' | 'G2A' })}
                >
                  <option value="MANUAL">Manual</option>
                  <option value="G2A">G2A</option>
                </select>
              </div>
              {form.sourceType === 'G2A' && (
                <div className="space-y-1.5">
                  <Label>G2A Product ID</Label>
                  <Input value={form.externalRef} onChange={(e) => setForm({ ...form, externalRef: e.target.value })} />
                </div>
              )}
              <div className="space-y-1.5">
                <Label>{t('cost')} (USD cents)</Label>
                <Input type="number" value={form.costMinor} onChange={(e) => setForm({ ...form, costMinor: Number(e.target.value) })} required />
              </div>
              <div className="space-y-1.5">
                <Label>{t('profit_percent')} (override)</Label>
                <Input value={form.profitPercent} onChange={(e) => setForm({ ...form, profitPercent: e.target.value })} placeholder="global default" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('delivery_type')}</Label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.deliveryType}
                  onChange={(e) => setForm({ ...form, deliveryType: e.target.value as 'TEXT' | 'FILE' | 'KEYS' })}
                >
                  <option value="TEXT">Text message</option>
                  <option value="FILE">File (URL)</option>
                  <option value="KEYS">Key pool (license keys/codes)</option>
                </select>
              </div>
              {form.deliveryType === 'FILE' && (
                <div className="space-y-1.5 md:col-span-2">
                  <Label>File URL</Label>
                  <Input value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://..." />
                </div>
              )}
              {form.deliveryType === 'TEXT' && (
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Delivery content</Label>
                  <textarea
                    className="min-h-[80px] w-full rounded-md border border-input bg-background p-2 text-sm"
                    value={form.deliveryContent}
                    onChange={(e) => setForm({ ...form, deliveryContent: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-1.5 md:col-span-2">
                <Label>{t('name_ar')} — description</Label>
                <textarea
                  className="min-h-[60px] w-full rounded-md border border-input bg-background p-2 text-sm"
                  value={form.descriptionAr}
                  dir="rtl"
                  onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>{t('name_en')} — description</Label>
                <textarea
                  className="min-h-[60px] w-full rounded-md border border-input bg-background p-2 text-sm"
                  value={form.descriptionEn}
                  onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                <Label>{t('active')}</Label>
              </div>

              {error && <p className="text-sm text-destructive md:col-span-2">{error}</p>}

              <div className="flex gap-2 md:col-span-2">
                <Button type="submit">{t('save')}</Button>
                <Button type="button" variant="outline" onClick={() => { setEditing(false); setForm(emptyForm); }}>
                  {t('cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {keysProductId && (
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-3">
            <Label>Add keys (one per line)</Label>
            <textarea
              className="min-h-[120px] w-full rounded-md border border-input bg-background p-2 font-mono text-sm"
              value={keysText}
              onChange={(e) => setKeysText(e.target.value)}
              placeholder={'KEY-1111-2222\nKEY-3333-4444'}
            />
            <div className="flex gap-2">
              <Button onClick={onAddKeys}>{t('save')}</Button>
              <Button variant="outline" onClick={() => { setKeysProductId(null); setKeysText(''); }}>
                {t('cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <DataTable
        columns={[
          { key: 'nameEn', header: 'Name', render: (r: Product) => (lang === 'ar' ? r.nameAr : r.nameEn) },
          { key: 'sourceType', header: 'Source' },
          { key: 'costMinor', header: t('cost'), render: (r: Product) => `$${(r.costMinor / 100).toFixed(2)}` },
          { key: 'deliveryType', header: t('delivery_type') },
          {
            key: 'stock',
            header: 'Stock',
            render: (r: Product) => (r.deliveryType === 'KEYS' ? `${r._count?.keys ?? 0} unused` : '—'),
          },
          {
            key: 'isActive',
            header: 'Status',
            render: (r: Product) => <Badge variant={r.isActive ? 'success' : 'secondary'}>{r.isActive ? t('active') : t('inactive')}</Badge>,
          },
          {
            key: 'actions',
            header: '',
            render: (r: Product) => (
              <div className="flex gap-2">
                {r.deliveryType === 'KEYS' && (
                  <Button size="sm" variant="ghost" onClick={() => setKeysProductId(r.id)}>Keys</Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => startEdit(r)}>{t('edit')}</Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(r.id)}>{t('delete')}</Button>
              </div>
            ),
          },
        ]}
        data={products}
      />
    </Shell>
  );
}
