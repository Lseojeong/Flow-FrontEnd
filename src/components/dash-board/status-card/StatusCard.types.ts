import React from 'react';

export interface StatusItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export interface StatusCardProps {
  title: string;
  count: number | string;
  items?: StatusItem[];
}
