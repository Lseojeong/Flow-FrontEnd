import React from 'react';

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  description?: React.ReactNode;
  position?: 'left' | 'center' | 'right';
}
