export const normalizeCategory = <
  T extends {
    lastModifiedDate?: string;
    updatedAt?: string;
    createdAt?: string;
    status?: Record<string, number>;
  },
>(
  category: T,
  defaultStatus: Record<string, number>
): T & { lastModifiedDate: string; status: Record<string, number>; timestamp: string } => ({
  ...category,
  lastModifiedDate: category.lastModifiedDate ?? (category.updatedAt ?? '').slice(0, 10),
  status: category.status ?? defaultStatus,
  timestamp: category.updatedAt ?? category.createdAt ?? '',
});

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const showToast = (message: string) => {
  (window as { showToast?: (_message: string) => void }).showToast?.(message);
};

export const showErrorToast = (message: string) => {
  (window as { showErrorToast?: (_message: string) => void }).showErrorToast?.(message);
};

export const handleApiError = (error: unknown, defaultMessage: string): string => {
  const errorMessage =
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    defaultMessage;

  showErrorToast(errorMessage);
  return errorMessage;
};
