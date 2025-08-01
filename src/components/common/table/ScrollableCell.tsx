import React from 'react';
import styled from 'styled-components';
import { colors } from '@/styles/index';
import { ScrollableCellProps } from './Table.types';

/**
 * @description 스크롤 가능한 셀 컴포넌트(부서 목록 셀)
 */

export const ScrollableCell: React.FC<ScrollableCellProps> = ({
  children,
  align = 'left',
  maxWidth = '200px',
}) => {
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <CellContainer $align={align} $maxWidth={maxWidth}>
      <ScrollableContent $align={align} onWheel={handleWheel} onMouseDown={handleMouseDown}>
        {children}
      </ScrollableContent>
    </CellContainer>
  );
};

const CellContainer = styled.td<{ $align: string; $maxWidth: string }>`
  max-width: ${({ $maxWidth }) => $maxWidth};
  text-align: ${({ $align }) => $align};
  padding: 16px 24px;
  color: ${colors.Black};
  font-weight: 400;
  font-size: 14px;
  border-bottom: 1px solid #f2f2f2;
`;

const ScrollableContent = styled.div<{ $align: string }>`
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
  text-align: ${({ $align }) => $align};
  padding-right: 8px;
  padding-bottom: 8px;
  min-width: 0;

  scrollbar-width: thin;
  scrollbar-color: ${colors.Light_active} transparent;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin-bottom: 2px;
    border: none;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.Light_active};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.Normal};
  }
`;
