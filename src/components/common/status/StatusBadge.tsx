import React from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';

interface StatusBadgeProps {
  status: string;
  children: React.ReactNode;
}

type StatusType = 'Completed' | 'Processing' | 'Fail';

const STATUS_COLORS = {
  Completed: {
    background: 'rgba(59.97, 157, 15, 0.10)',
    text: '#3C9D0F',
    border: '#3C9D0F',
  },
  Processing: {
    background: 'rgba(230.38, 138.23, 0, 0.10)',
    text: '#E68A00',
    border: '#E68A00',
  },
  Fail: {
    background: 'rgba(214.73, 0, 0, 0.10)',
    text: '#D70000',
    border: '#D70000',
  },
} as const;

const getStatusColor = (status: string): string => {
  const statusKey = status as StatusType;
  return STATUS_COLORS[statusKey]?.background || colors.BoxText;
};

const getTextColor = (status: string): string => {
  const statusKey = status as StatusType;
  return STATUS_COLORS[statusKey]?.text || 'white';
};

const getBorderColor = (status: string): string => {
  const statusKey = status as StatusType;
  return STATUS_COLORS[statusKey]?.border || 'transparent';
};

const StyledStatusBadge = styled.span<{ status: string }>`
  min-width: 72px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ status }) => getStatusColor(status)};
  color: ${({ status }) => getTextColor(status)};
  border: 1px solid ${({ status }) => getBorderColor(status)};
  border-radius: 12px;
  font-size: 10px;
  font-weight: ${fontWeight.Medium};
  padding: 0 8px;
`;

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  return <StyledStatusBadge status={status}>{children}</StyledStatusBadge>;
};
