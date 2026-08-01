'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DealCountdownProps {
  targetDate?: Date | string;
  className?: string;
  label?: string;
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default function DealCountdown({
  targetDate,
  className,
  label = 'ينتهي العرض خلال',
}: DealCountdownProps) {
  const targetRef = useRef<number | null>(null);
  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (targetRef.current === null) {
      targetRef.current = targetDate
        ? new Date(targetDate).getTime()
        : Date.now() + 48 * 60 * 60 * 1000;
    }

    const tick = () => {
      setRemaining(formatTime(targetRef.current! - Date.now()));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span
      dir="rtl"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#22BC9F] shadow-[0_8px_30px_rgba(0,0,0,0.06)]',
        className
      )}
    >
      <Timer className="w-3.5 h-3.5" />
      {label}
      {remaining && (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={remaining}
            dir="ltr"
            initial={{ scale: 1.15, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="tabular-nums font-mono"
          >
            {remaining}
          </motion.span>
        </AnimatePresence>
      )}
    </span>
  );
}
