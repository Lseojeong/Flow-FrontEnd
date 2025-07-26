import React from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';

interface Column {
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableHeaderProps {
  columns: Column[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => {
  return (
    <StyledThead>
      <tr>
        {columns.map((col, idx) => (
          <th key={idx} style={{ width: col.width, textAlign: col.align || 'left' }}>
            {col.label}
          </th>
        ))}
      </tr>
    </StyledThead>
  );
};

const StyledThead = styled.thead`
  background-color: ${colors.Normal};
  color: white;

  th {
    padding: 16px 24px;
    font-size: 14px;
    font-weight: ${fontWeight.Medium};
    white-space: nowrap;
    overflow: hidden;
  }
`;
