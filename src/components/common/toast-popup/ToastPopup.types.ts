import React from 'react';

export interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export interface ToastItem {
  id: string;
  message: string;
}

export interface ToastContainerProps {
  children?: React.ReactNode;
}
