import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 
 * @param inputs - Class names to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price to VND (Vietnamese Đồng) currency format
 * @param price - The price to format (in VND)
 * @returns Formatted price string with VND symbol
 */
export function formatPrice(price: number | string): string {
  // Convert string to number if needed
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Format number with dots as thousand separators
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice);
}
