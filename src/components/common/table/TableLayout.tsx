import React from 'react';
import styled from 'styled-components';

interface TableLayoutProps {
  children: React.ReactNode;
}

export const TableLayout: React.FC<TableLayoutProps> = ({ children }) => {
  return (
    <TableWrapper>
      <StyledTable>{children}</StyledTable>
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  width: 1152px;
  border-radius: 4px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-radius: 4px 4px 0 0;
  border-spacing: 0;
  overflow: hidden;
`;
