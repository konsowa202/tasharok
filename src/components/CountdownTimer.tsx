'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endDate: string | Date;
  isAdminOrVendor?: boolean;
  onStop?: () => void;
  compact?: boolean;
}

export default function CountdownTimer({ endDate, isAdminOrVendor = false, onStop, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded-md">
        <Clock className="w-3.5 h-3.5" />
        انتهى العرض
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#22BC9F] bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-lg shadow-sm border border-[#22BC9F]/20">
        <Clock className="w-3.5 h-3.5 animate-pulse" />
        <div dir="ltr" className="flex items-center gap-0.5">
          <span>{formatNumber(timeLeft.days)}ي</span>:
          <span>{formatNumber(timeLeft.hours)}س</span>:
          <span>{formatNumber(timeLeft.minutes)}د</span>:
          <span>{formatNumber(timeLeft.seconds)}ث</span>
        </div>
        {isAdminOrVendor && onStop && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStop();
            }}
            className="mr-2 text-rose-500 hover:text-rose-600 underline text-[9px] bg-rose-50 px-1.5 py-0.5 rounded"
          >
            إيقاف
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full bg-white/50 p-1 rounded-2xl">
      <div className="flex items-center justify-center gap-2 text-slate-700">
        <Clock className="w-4 h-4 text-[#22BC9F] animate-pulse" />
        <span className="font-bold text-sm">ينتهي العرض خلال:</span>
      </div>
      
      <div className="flex items-center gap-2 w-full" dir="ltr">
        {/* Days */}
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-xl py-2.5 border border-slate-100 shadow-sm">
          <span className="text-[#22BC9F] font-black text-xl leading-none">{formatNumber(timeLeft.days)}</span>
          <span className="text-[10px] font-bold text-slate-400 mt-1">يوم</span>
        </div>
        
        {/* Hours */}
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-xl py-2.5 border border-slate-100 shadow-sm">
          <span className="text-[#22BC9F] font-black text-xl leading-none">{formatNumber(timeLeft.hours)}</span>
          <span className="text-[10px] font-bold text-slate-400 mt-1">ساعة</span>
        </div>

        {/* Minutes */}
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-xl py-2.5 border border-slate-100 shadow-sm">
          <span className="text-[#22BC9F] font-black text-xl leading-none">{formatNumber(timeLeft.minutes)}</span>
          <span className="text-[10px] font-bold text-slate-400 mt-1">دقيقة</span>
        </div>

        {/* Seconds */}
        <div className="flex-1 flex flex-col items-center justify-center bg-rose-50/50 rounded-xl py-2.5 border border-rose-100 shadow-sm">
          <span className="text-rose-500 font-black text-xl leading-none">{formatNumber(timeLeft.seconds)}</span>
          <span className="text-[10px] font-bold text-rose-400 mt-1">ثانية</span>
        </div>
      </div>

      {isAdminOrVendor && onStop && (
        <button
          onClick={onStop}
          className="w-full text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2.5 rounded-xl font-bold transition-colors border border-red-100 mt-2"
        >
          إيقاف الموقت
        </button>
      )}
    </div>
  );
}
