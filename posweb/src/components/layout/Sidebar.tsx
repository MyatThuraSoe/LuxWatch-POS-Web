import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Settings,
  Wrench,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Array<'ADMIN' | 'OWNER' | 'EMPLOYEE'>;
  permissions?: string[];
}

export const navigationConfig: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'OWNER', 'EMPLOYEE'],
  },
  {
    title: 'POS',
    href: '/pos',
    icon: ShoppingCart,
    roles: ['ADMIN', 'OWNER', 'EMPLOYEE'],
  },
  {
    title: 'Products',
    href: '/products',
    icon: Package,
    roles: ['ADMIN', 'OWNER'],
  },
  {
    title: 'Inventory',
    href: '/inventory',
    icon: Package,
    roles: ['ADMIN', 'OWNER'],
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
    roles: ['ADMIN', 'OWNER', 'EMPLOYEE'],
  },
  {
    title: 'Suppliers',
    href: '/suppliers',
    icon: Users,
    roles: ['ADMIN', 'OWNER'],
  },
  {
    title: 'Purchase Orders',
    href: '/purchase-orders',
    icon: FileText,
    roles: ['ADMIN', 'OWNER'],
  },
  {
    title: 'Sales',
    href: '/sales',
    icon: TrendingUp,
    roles: ['ADMIN', 'OWNER'],
  },
  {
    title: 'Repairs',
    href: '/repairs',
    icon: Wrench,
    roles: ['ADMIN', 'OWNER', 'EMPLOYEE'],
  },
  {
    title: 'Warranties',
    href: '/warranties',
    icon: ShieldAlert,
    roles: ['ADMIN', 'OWNER', 'EMPLOYEE'],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: FileText,
    roles: ['ADMIN', 'OWNER'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['ADMIN'],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuthStore();

  const filteredNavItems = navigationConfig.filter((item) => {
    if (!user) return false;
    
    // Check role-based access
    if (item.roles && !item.roles.includes(user.role)) {
      return false;
    }
    
    // Check permission-based access
    if (item.permissions && user.permissions) {
      const hasPermission = item.permissions.every((perm) =>
        user.permissions?.includes(perm)
      );
      if (!hasPermission) return false;
    }
    
    return true;
  });

  return (
    <nav className={cn('flex flex-col gap-1 p-4', className)}>
      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              'hover:bg-gray-100 hover:text-gray-900',
              isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600'
            )}
          >
            <Icon className="h-5 w-5" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
