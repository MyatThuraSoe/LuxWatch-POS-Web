import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileNavToggleProps {
  onToggle: () => void;
  isOpen?: boolean;
}

export function MobileNavToggle({ onToggle, isOpen = false }: MobileNavToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn('md:hidden', isOpen && 'bg-gray-100')}
      aria-label="Toggle navigation menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
