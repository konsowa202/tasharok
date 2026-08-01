'use client';

import React from 'react';
import { Users, CheckCircle2, Flame } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  target: number;
  showDetails?: boolean;
  variant?: 'default' | 'compact';
}

export default function ProgressBar({ current, target, showDetails = true, variant = 'default' }: ProgressBarProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const remaining = Math.max(target - current, 0);
  const isCompleted = current >= target;

  if (variant === 'compact') {
    return (
      <div className="w-full font-arabic flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
          <span className={isCompleted ? 'text-[#22BC9F]' : ''}>
            {isCompleted ? 'اكتملت المجموعة 🎉' : `${current} / ${target} محجوز`}
          </span>
          {percentage > 0 && <span>{percentage}%</span>}
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out bg-[#22BC9F] ${
              isCompleted ? 'animate-pulse' : ''
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-arabic space-y-3">
      {showDetails && (
        <div className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Users className="w-4 h-4 text-[#007FB7]" />
            <span>
              تم حجز <strong className="text-slate-900 font-bold">{current}</strong> من أصل{' '}
              <strong className="text-slate-900 font-bold">{target}</strong>
            </span>
          </div>

          {isCompleted ? (
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> اكتمل الخصم! 🎉
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-500 animate-bounce" /> متبقي {remaining} لتفعيل الخصم
            </span>
          )}
        </div>
      )}

      {/* Bar container - ultra thin and sleek */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#22BC9F] to-[#007FB7] ${
            isCompleted ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs font-medium text-slate-400">
        <span>0%</span>
        <span className="text-[#007FB7] font-bold">{percentage}%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
