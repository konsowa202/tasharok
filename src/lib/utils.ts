import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(Number(price))) {
    return '0';
  }
  return Number(price).toLocaleString('en-US');
}

export function calculateSavings(original: number, tasharok: number): number {
  if (!original || original <= tasharok) return 0;
  return Math.round(((original - tasharok) / original) * 100);
}
