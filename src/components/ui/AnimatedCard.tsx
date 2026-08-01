'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'teal' | 'blue' | 'none';
}

export default function AnimatedCard({
  children,
  className,
  hover = true,
  glow = 'none',
}: AnimatedCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-100 bg-white transition-all duration-500',
        hover && 'hover:-translate-y-1 hover:shadow-2xl',
        glow === 'teal' && 'hover:shadow-[0_20px_50px_rgba(34,188,159,0.2)] hover:border-[#22BC9F]/30',
        glow === 'blue' && 'hover:shadow-[0_20px_50px_rgba(0,127,183,0.2)] hover:border-[#007FB7]/30',
        className
      )}
    >
      {children}
    </div>
  );
}
