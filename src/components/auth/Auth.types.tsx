import React from 'react';

export interface Props {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  label: string;
  error?: string;
  hasMarginBottom?: boolean;
  maxLength?: number;
  width?: string;
}
