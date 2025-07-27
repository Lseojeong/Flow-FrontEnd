import React from 'react';

export type StatusType = 'Completed' | 'Processing' | 'Fail';

export interface StatusItemData {
  type: 'Completed' | 'Processing' | 'Fail';
  count: number;
}

export interface Props {
  items: StatusItemData[];
}

export interface StatusBadgeProps {
  status: string;
  children: React.ReactNode;
}
