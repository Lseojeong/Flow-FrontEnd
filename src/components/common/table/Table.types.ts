import React from 'react';

export type AlignType = 'left' | 'center' | 'right';

export interface Column {
  label: string | React.ReactNode;
  width?: string;
  align?: AlignType;
}

export interface TableLayoutProps {
  children: React.ReactNode;
  maxHeight?: string;
}

export interface TableHeaderProps {
  columns: Column[];
}

export interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export interface ScrollableCellProps {
  children: React.ReactNode;
  align?: AlignType;
  maxWidth?: string;
}

export interface TableCellProps {
  align?: AlignType;
}
