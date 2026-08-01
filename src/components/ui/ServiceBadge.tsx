'use client';

import React from 'react';
import { Sparkles, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceBadgeProps {
  itemType?: 'product' | 'service';
  className?: string;
  size?: 'sm' | 'md';
}

export default function ServiceBadge({
  itemType = 'product',
  className,
  size = 'md',
}: ServiceBadgeProps) {
  const isService = itemType === 'service';

  const sizeClass = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-bold',
        isService
          ? 'bg-[#22BC9F]/10 text-[#22BC9F] border border-[#22BC9F]/20'
          : 'bg-[#007FB7]/10 text-[#007FB7] border border-[#007FB7]/20',
        sizeClass,
        className
      )}
    >
      {isService ? <Sparkles className="w-3 h-3" /> : <Package className="w-3 h-3" />}
      {isService ? 'خدمة' : 'منتج'}
    </span>
  );
}
