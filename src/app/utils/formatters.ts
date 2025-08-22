import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatPrice = (price: unknown) => {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericPrice);
};

export const formatOrderDate = (dateString: unknown) => {
  if (typeof dateString !== 'string') return 'Ngày không hợp lệ';
  try {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
  } catch {
    return dateString;
  }
};