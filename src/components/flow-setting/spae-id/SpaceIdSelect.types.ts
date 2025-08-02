import React from 'react';

export interface SpaceidSelectProps {
  value: string;
  onChange: (_value: string) => void;
  options: Array<{ value: string; label: string }>;
  children?: React.ReactNode;
}

export interface SpaceidOption {
  value: string;
  label: string;
}
