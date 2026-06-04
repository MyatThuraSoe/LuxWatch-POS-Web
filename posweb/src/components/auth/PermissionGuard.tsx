import React from 'react';
import { useAuthStore } from '@/stores/authStore';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermissions: string[];
  fallback?: React.ReactNode;
}

export function PermissionGuard({ 
  children, 
  requiredPermissions,
  fallback = null 
}: PermissionGuardProps) {
  const { user } = useAuthStore();

  if (!user || !user.permissions) {
    return <>{fallback}</>;
  }

  const hasPermission = requiredPermissions.every((perm) =>
    user.permissions?.includes(perm)
  );

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Helper hook to check permissions
export function useHasPermission(requiredPermissions: string[]): boolean {
  const { user } = useAuthStore();

  if (!user || !user.permissions) {
    return false;
  }

  return requiredPermissions.every((perm) => user.permissions?.includes(perm));
}
