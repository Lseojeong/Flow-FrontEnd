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

export const formatDateTimeUTC = (date: Date | string | null | undefined): string => {
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

    const utcYear = dateObj.getUTCFullYear();
    const utcMonth = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const utcDay = String(dateObj.getUTCDate()).padStart(2, '0');
    const utcHours = String(dateObj.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(dateObj.getUTCMinutes()).padStart(2, '0');

    return `${utcYear}.${utcMonth}.${utcDay} ${utcHours}:${utcMinutes}`;
  } catch {
    return '-';
  }
};
