'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'teal' | 'gold' | 'saudi';
}

export default function GradientText({
  children,
  className,
  variant = 'teal',
}: GradientTextProps) {
  const variantClass = {
    teal: 'text-gradient',
    gold: 'text-gradient-gold',
    saudi: 'bg-gradient-to-l from-[#006C35] to-[#22BC9F] bg-clip-text text-transparent',
  }[variant];

  return <span className={cn(variantClass, className)}>{children}</span>;
}
