import React from 'react';

export interface SpaceidSelectProps {
  value: string;
  onChange: (_value: string) => void;
  options: Array<{ value: string; label: string }>;
  isLoading?: boolean;
  children?: React.ReactNode;
}

// 백엔드에서 받을 데이터 형태
export interface SpaceData {
  spaceId: number;
  spaceName: string;
}

// react-select용 옵션 형태
export interface SpaceidOption {
  value: string;
  label: string;
}
