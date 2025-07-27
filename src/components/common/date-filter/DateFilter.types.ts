import React from 'react';

export interface DateFilterProps {
  startDate: string | null;
  endDate: string | null;
  onDateChange: (_startDate: string | null, _endDate: string | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export interface CustomNavigationProps {
  className?: string;
  onClick: () => void;
  type: 'previous' | 'next';
  disabled?: boolean;
}

export interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  hasValue?: boolean;
}
