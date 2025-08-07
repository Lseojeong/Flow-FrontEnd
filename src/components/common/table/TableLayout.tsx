import React from 'react';
import styled from 'styled-components';
import { TableLayoutProps } from './Table.types';

export const TableLayout: React.FC<TableLayoutProps> = ({ children }) => {
  return (
    <TableWrapper>
      <StyledTable>{children}</StyledTable>
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  width: 100%;
  border-radius: 4px;
`;

const StyledTable = styled.table`
  width: 100%;
  table-layout: auto;
  border-collapse: separate;
  border-radius: 4px 4px 0 0;
  border-spacing: 0;
  overflow: hidden;
`;
