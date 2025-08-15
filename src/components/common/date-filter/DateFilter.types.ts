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

export interface NavigationProps {
  className?: string;
  onClick: () => void;
  type: 'previous' | 'next';
  disabled?: boolean;
}

export interface InputProps {
  value?: string;
  onClick?: () => void;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange?: (_startDate: string | null, _endDate: string | null) => void;
  setTempStartDate?: React.Dispatch<React.SetStateAction<Date | null>>;
  setTempEndDate?: React.Dispatch<React.SetStateAction<Date | null>>;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  hasValue?: boolean;
}
