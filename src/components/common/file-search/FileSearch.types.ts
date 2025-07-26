import React from 'react';

export interface FileSearchProps {
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}
