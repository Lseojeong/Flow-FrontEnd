import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { TableRowProps, TableCellProps } from './Table.types';

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, onClick, style }, ref) => {
    return (
      <StyledTableRow ref={ref} onClick={onClick} style={style}>
        {children}
      </StyledTableRow>
    );
  }
);

TableRow.displayName = 'TableRow';

const StyledTableRow = styled.tr`
  &:hover {
    background-color: #f4f8ff;
  }

  td {
    padding: 16px 24px;
    color: ${colors.Black};
    font-weight: ${fontWeight.Regular};
    font-size: 14px;
    white-space: nowrap;
    border-bottom: 1px solid #f2f2f2;
    overflow: hidden;
    max-width: 0;
    vertical-align: middle;
  }
`;

export const TableCell = styled.td<TableCellProps>`
  white-space: nowrap;
  text-align: ${({ align }) => align || 'left'};
  overflow: hidden;
  max-width: 0;
`;
