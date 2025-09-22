import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) => `$${(value / 100).toFixed(2)}`;
