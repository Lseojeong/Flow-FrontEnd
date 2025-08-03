import React from 'react';

export interface EmailInputProps {
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (_e: React.KeyboardEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  placeholder?: string;
}
