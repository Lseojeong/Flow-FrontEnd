import React from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { DepartmentTagProps } from './Department.types';

export const DepartmentTag: React.FC<DepartmentTagProps> = ({
  department,
  onClick,
  removable = false,
  onRemove,
}) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <TagContainer onClick={onClick} $clickable={!!onClick}>
      <TagText>{department.departmentName}</TagText>
      {removable && (
        <RemoveButton onClick={handleRemove} aria-label={`${department.departmentName} 제거`}>
          ×
        </RemoveButton>
      )}
    </TagContainer>
  );
};

const TagContainer = styled.div<{ $clickable: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background-color: ${colors.Light};
  border-radius: 4px;
  font-size: 10px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Normal};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const TagText = styled.span`
  white-space: nowrap;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${colors.BoxText};
  cursor: pointer;
  font-size: 12px;
  margin-left: 4px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${colors.Dark_hover};
  }
`;

export default DepartmentTag;
