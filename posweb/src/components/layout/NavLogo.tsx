import { Watch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLogoProps {
  collapsed?: boolean;
  className?: string;
}

export function NavLogo({ collapsed = false, className }: NavLogoProps) {
  return (
    <div className={cn('flex items-center gap-2 px-4 py-6', className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
        <Watch className="h-6 w-6" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900">LuxWatch</span>
          <span className="text-xs text-gray-500">POS System</span>
        </div>
      )}
    </div>
  );
}
