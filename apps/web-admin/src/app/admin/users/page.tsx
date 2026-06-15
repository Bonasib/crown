'use client';

import { useState } from 'react';
import { Users, Search, UserCheck, UserX } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@ronda/ui';

type UserRole = 'IMPORTER' | 'WAREHOUSE_OPERATOR';

const ROLE_CONFIG: Record<UserRole, { label: string; className: string }> = {
  IMPORTER: { label: 'Importer', className: 'bg-blue-100 text-blue-700' },
  WAREHOUSE_OPERATOR: { label: 'Warehouse', className: 'bg-purple-100 text-purple-700' },
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">Manage importer and warehouse operator accounts.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or business name…"
          className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Role filter */}
      <div className="flex gap-2">
        {['All', 'Importers', 'Warehouse operators'].map((tab) => (
          <button
            key={tab}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              tab === 'All' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <Users className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">No users yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Users appear here once they register and verify their phone number via OTP.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* User management info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account types</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-3 rounded-md border p-3">
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Importer</span>
              <p className="text-muted-foreground">Companies importing goods. Can add products, track shipments, and pay invoices.</p>
            </div>
            <div className="flex items-start gap-3 rounded-md border p-3">
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">Warehouse</span>
              <p className="text-muted-foreground">Warehouse operators. Can scan barcodes, record receivings, and manage supplier links.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Registration flow</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-2 text-sm">
              {[
                'User selects account type (Importer/Warehouse)',
                'Fills registration form with phone number',
                'Receives OTP via WhatsApp (SMS fallback)',
                'Verifies phone — account activated',
                'Completes onboarding (business name, language)',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs">{i + 1}</span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
