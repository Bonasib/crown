import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  Badge,
  PageHeader,
} from '@ronda/ui';
import {
  Users,
  Target,
  TrendingUp,
  Phone,
  Mail,
  MessageSquare,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';

type DealStage = 'NEW' | 'QUALIFIED' | 'QUOTED' | 'NEGOTIATION' | 'WON' | 'LOST';

const STAGE_CONFIG: Record<DealStage, { label: string; color: string }> = {
  NEW: { label: 'New', color: 'bg-gray-100 text-gray-700' },
  QUALIFIED: { label: 'Qualified', color: 'bg-blue-100 text-blue-700' },
  QUOTED: { label: 'Quoted', color: 'bg-amber-100 text-amber-700' },
  NEGOTIATION: { label: 'Negotiation', color: 'bg-orange-100 text-orange-700' },
  WON: { label: 'Won', color: 'bg-green-100 text-green-700' },
  LOST: { label: 'Lost', color: 'bg-red-100 text-red-700' },
};

const deals = [
  { id: '1', title: 'Electronics FCL Q1', company: 'ACME Imports', stage: 'QUOTED' as DealStage, value: '$15,000', prob: 70, assignee: 'Maria S.' },
  { id: '2', title: 'Textiles LCL Regular', company: 'Sunset Fashion', stage: 'NEGOTIATION' as DealStage, value: '$8,400', prob: 80, assignee: 'Maria S.' },
  { id: '3', title: 'Furniture FCL 40FT', company: 'Home+ Retail', stage: 'QUALIFIED' as DealStage, value: '$22,000', prob: 40, assignee: 'Carlos M.' },
  { id: '4', title: 'Cosmetics Air Freight', company: 'Beauty Inc', stage: 'NEW' as DealStage, value: '$6,200', prob: 20, assignee: 'Maria S.' },
  { id: '5', title: 'Solar Panels FCL', company: 'GreenEnergy Co', stage: 'WON' as DealStage, value: '$34,000', prob: 100, assignee: 'Carlos M.' },
];

const recentActivities = [
  { type: 'CALL', contact: 'Hassan Al-Farsi', company: 'ACME Imports', time: '2h ago', note: 'Discussed Q2 volume pricing' },
  { type: 'EMAIL', contact: 'Priya Sharma', company: 'Sunset Fashion', time: '4h ago', note: 'Sent updated quote with revised transit times' },
  { type: 'WHATSAPP', contact: 'Wei Zhang', company: 'Home+ Retail', time: '1d ago', note: 'Follow up on FCL quote' },
  { type: 'MEETING', contact: 'Omar Al-Sayed', company: 'GreenEnergy Co', time: '2d ago', note: 'Signed contract for FCL shipment' },
];

export default function CrmHome() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r bg-sidebar">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Target className="h-5 w-5 text-sidebar-primary" />
          <div>
            <p className="text-sm font-bold text-foreground">Ronda CRM</p>
            <p className="text-xs text-sidebar-foreground/60">Sales Pipeline</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {[
            { href: '/', label: 'Pipeline', icon: Target, active: true },
            { href: '/leads', label: 'Leads', icon: Users },
            { href: '/contacts', label: 'Contacts', icon: Users },
            { href: '/activities', label: 'Activities', icon: MessageSquare },
            { href: '/reports', label: 'Reports', icon: TrendingUp },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <PageHeader
            title="Sales Pipeline"
            description="Track deals and customer relationships"
            action={
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Deal
              </Button>
            }
          />

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              title="Pipeline Value"
              value="$85,600"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{ value: 15, label: 'vs last month', positive: true }}
            />
            <StatCard
              title="Active Deals"
              value="12"
              icon={<Target className="h-4 w-4" />}
            />
            <StatCard
              title="Won (MTD)"
              value="$34,000"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{ value: 22, label: 'vs last month', positive: true }}
            />
            <StatCard
              title="Conversion Rate"
              value="32%"
              icon={<Users className="h-4 w-4" />}
              trend={{ value: 4, label: 'vs last month', positive: true }}
            />
          </div>

          {/* Deal Pipeline (Kanban-style list) */}
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">Deals</h2>
            <div className="space-y-2">
              {deals.map((deal) => {
                const stage = STAGE_CONFIG[deal.stage];
                return (
                  <Card
                    key={deal.id}
                    className="hover:border-primary/50 cursor-pointer transition-colors"
                  >
                    <CardContent className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{deal.title}</p>
                          <p className="text-sm text-muted-foreground">{deal.company} · {deal.assignee}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${stage.color}`}
                        >
                          {stage.label}
                        </span>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{deal.value}</p>
                          <p className="text-xs text-muted-foreground">{deal.prob}% probability</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">Recent Activities</h2>
            <div className="space-y-2">
              {recentActivities.map((activity, i) => {
                const Icon =
                  activity.type === 'CALL' ? Phone
                  : activity.type === 'EMAIL' ? Mail
                  : activity.type === 'WHATSAPP' ? MessageSquare
                  : Target;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border bg-card p-3"
                  >
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {activity.contact} · {activity.company}
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.note}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
