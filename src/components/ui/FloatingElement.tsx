'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: 'none' | 'short' | 'medium' | 'long';
  duration?: 'slow' | 'normal';
}

export default function FloatingElement({
  children,
  className,
  delay = 'none',
  duration = 'normal',
}: FloatingElementProps) {
  const delayClass = {
    none: '',
    short: '[animation-delay:1s]',
    medium: '[animation-delay:2s]',
    long: '[animation-delay:3s]',
  }[delay];

  const durationClass = duration === 'slow' ? 'animate-float-slow' : 'animate-float';

  return (
    <div className={cn('animate-float', durationClass, delayClass, className)}>
      {children}
    </div>
  );
}
