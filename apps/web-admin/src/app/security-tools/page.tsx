import Link from 'next/link';
import {
  Shield,
  BarChart3,
  Building2,
  Users,
  Flag,
  Key,
  Activity,
  Database,
  Settings,
  BookOpen,
} from 'lucide-react';
import { PageHeader, Badge } from '@ronda/ui';
import { categories, totalTools } from '../../data/security-tools';
import ToolsBrowser from './tools-browser';

export default function SecurityToolsPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — mirrors the admin layout */}
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Shield className="h-5 w-5 text-sidebar-primary" />
          <div>
            <p className="text-sm font-bold text-white">Ronda Admin</p>
            <p className="text-xs text-sidebar-foreground/60">Super Admin</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {[
            { href: '/', label: 'Dashboard', icon: BarChart3 },
            { href: '/organizations', label: 'Organizations', icon: Building2 },
            { href: '/users', label: 'Users', icon: Users },
            { href: '/feature-flags', label: 'Feature Flags', icon: Flag },
            { href: '/api-keys', label: 'API Keys', icon: Key },
            { href: '/audit-log', label: 'Audit Log', icon: Activity },
            { href: '/database', label: 'Database', icon: Database },
            { href: '/security-tools', label: 'Security Tools', icon: BookOpen, active: true },
            { href: '/settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="border-b bg-card px-6 py-4">
          <PageHeader
            title="Security Tools Reference"
            description="Educational reference of 185+ open-source security tools across 20 categories. For authorised penetration testing and security research only."
            action={
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{totalTools} Tools</Badge>
                <Badge variant="secondary">{categories.length} Categories</Badge>
                <Badge variant="outline">Educational</Badge>
              </div>
            }
          />
        </div>

        {/* Disclaimer */}
        <div className="mx-6 mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Authorised use only.</strong> These tools are documented for educational purposes and
          security research. Use them only on systems you own or have explicit written permission to test.
          Unauthorised use may violate computer fraud laws in your jurisdiction.
        </div>

        <div className="p-6">
          <ToolsBrowser />
        </div>
      </main>
    </div>
  );
}
