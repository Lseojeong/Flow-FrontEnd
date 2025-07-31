import React from 'react';

export interface RangeSliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (_value: number) => void;
  label?: string;
  showValue?: boolean;
}

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  description?: string;
}
