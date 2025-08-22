import { format, parseISO, isValid } from 'date-fns';

export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) {
    return '-';
  }

  if (typeof date === 'string' && date.trim() === '') {
    return '-';
  }

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) {
      return '-';
    }

    return format(dateObj, 'yyyy.MM.dd HH:mm');
  } catch {
    return '-';
  }
};
