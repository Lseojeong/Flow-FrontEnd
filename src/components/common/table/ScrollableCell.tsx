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
  width,
}) => {
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const finalWidth = width || maxWidth;

  return (
    <CellContainer $align={align} $width={finalWidth}>
      <ScrollableContent $align={align} onWheel={handleWheel} onMouseDown={handleMouseDown}>
        {children}
      </ScrollableContent>
    </CellContainer>
  );
};

const CellContainer = styled.td<{ $align: string; $width: string }>`
  width: ${({ $width }) => $width} !important;
  max-width: ${({ $width }) => $width} !important;
  min-width: ${({ $width }) => $width} !important;
  text-align: ${({ $align }) => $align};
  padding: 8px 24px;
  color: ${colors.Black};
  font-weight: 400;
  font-size: 14px;
  border-bottom: 1px solid #f2f2f2;
  flex-shrink: 0;
  box-sizing: border-box;
`;

const ScrollableContent = styled.div<{ $align: string }>`
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
  text-align: ${({ $align }) => $align};
  padding-right: 8px;
  min-width: 0;
  padding-bottom: 8px;
  margin-top: 8px;

  scrollbar-width: thin;
  scrollbar-color: ${colors.Light_active} transparent;

  &::-webkit-scrollbar {
    height: 2px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin-bottom: 1px;
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
