import React from 'react';

export interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'dark';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export type ButtonVariant = 'primary' | 'dark';
export type ButtonSize = 'small' | 'medium' | 'large';
