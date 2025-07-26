import React from 'react';
import styled from 'styled-components';
import { colors } from '@/styles/index';

/**
 * @description 스크롤 가능한 셀 컴포넌트(부서 목록 셀)
 */
interface ScrollableCellProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  maxWidth?: string;
}

export const ScrollableCell: React.FC<ScrollableCellProps> = ({
  children,
  align = 'left',
  maxWidth = '200px',
}) => {
  return (
    <CellContainer align={align} maxWidth={maxWidth}>
      <ScrollableContent align={align}>{children}</ScrollableContent>
    </CellContainer>
  );
};

const CellContainer = styled.td<{ align: string; maxWidth: string }>`
  max-width: ${({ maxWidth }) => maxWidth};
  text-align: ${({ align }) => align};
  overflow: hidden;
  padding: 16px 24px;
  color: ${colors.Black};
  font-weight: 400;
  font-size: 14px;
  white-space: nowrap;
  border-bottom: 1px solid #f2f2f2;
`;

const ScrollableContent = styled.div<{ align: string }>`
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
  text-align: ${({ align }) => align};

  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
`;
