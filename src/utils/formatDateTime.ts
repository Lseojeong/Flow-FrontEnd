import { format, parseISO } from 'date-fns';

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy.MM.dd HH:mm');
};
