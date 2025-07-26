import React from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const TableRow: React.FC<TableRowProps> = ({ children, onClick, style }) => {
  return (
    <StyledTableRow onClick={onClick} style={style}>
      {children}
    </StyledTableRow>
  );
};

const StyledTableRow = styled.tr`
  &:hover {
    background-color: ${colors.Light};
  }

  td {
    padding: 16px 24px;
    color: ${colors.Black};
    font-weight: ${fontWeight.Regular};
    font-size: 14px;
    white-space: nowrap;
    border-bottom: 1px solid #f2f2f2;
    overflow: hidden;
  }
`;

export const TableCell = styled.td<{ align?: 'left' | 'center' | 'right' }>`
  white-space: nowrap;
  text-align: ${({ align }) => align || 'left'};
  overflow: hidden;
`;
