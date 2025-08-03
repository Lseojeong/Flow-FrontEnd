import React from 'react';

export interface DepartmentInputProps {
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (_e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
}
