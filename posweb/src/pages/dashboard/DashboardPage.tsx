import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/common/StatCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Package, DollarSign, Users, TrendingUp } from 'lucide-react';

export function DashboardPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbs} />
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to LuxWatch POS - Overview of your business
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Sales"
            value="$12,450.00"
            description="+12.5% from last month"
            icon={DollarSign}
            trend="up"
          />
          <StatCard
            title="Orders Today"
            value="45"
            description="+8 from yesterday"
            icon={Package}
            trend="up"
          />
          <StatCard
            title="Total Customers"
            value="1,234"
            description="+23 new this week"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Products Sold"
            value="892"
            description="-3.2% from last month"
            icon={TrendingUp}
            trend="down"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 rounded-lg border bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
            <div className="text-center text-muted-foreground py-8">
              <p>Sales chart will be displayed here</p>
              <p className="text-sm">(Recharts integration in Phase 3)</p>
            </div>
          </div>
          <div className="col-span-3 rounded-lg border bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            <div className="text-center text-muted-foreground py-8">
              <p>Top products list will be displayed here</p>
              <p className="text-sm">(Product data integration in Phase 3)</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
