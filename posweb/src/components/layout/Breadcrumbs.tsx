import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-gray-500', className)}>
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-1 h-4 w-4 flex-shrink-0" />
          )}
          {item.href && index !== items.length - 1 ? (
            <Link
              to={item.href}
              className="hover:text-gray-700 hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(index === items.length - 1 ? 'font-medium text-gray-900' : '')}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Hook to generate breadcrumbs from route
export function useBreadcrumbs() {
  const location = useLocation();

  const generateBreadcrumbs = (path: string): BreadcrumbItem[] => {
    const paths = path.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
    ];

    let accumulatedPath = '';
    paths.forEach((segment) => {
      accumulatedPath += `/${segment}`;
      
      // Convert segment to readable label
      const label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
      
      breadcrumbs.push({
        label,
        href: accumulatedPath,
      });
    });

    return breadcrumbs;
  };

  return {
    breadcrumbs: generateBreadcrumbs(location.pathname),
  };
}
