import React from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { INPUT_FONT_SIZE } from '@/constants/FilterSearch.constants';
import { DepartmentSelectItemProps, DropdownItemStateProps } from './Department.types';

const DepartmentSelectItem: React.FC<DepartmentSelectItemProps> = ({
  option,
  selected,
  onClick,
}) => (
  <DropdownItem $selected={selected} onClick={onClick}>
    {option.departmentName}
  </DropdownItem>
);

const DropdownItem = styled.li<DropdownItemStateProps>`
  width: 100%;
  padding: 8px 12px;
  font-size: ${INPUT_FONT_SIZE};
  border-radius: 4px;
  color: ${({ $selected }) => ($selected ? colors.Normal : colors.BoxText)};
  background: ${({ $selected }) => ($selected ? colors.Light : 'transparent')};
  cursor: pointer;
  font-weight: ${({ $selected }) => ($selected ? fontWeight.SemiBold : fontWeight.Regular)};
  transition: background 0.15s;

  &:hover {
    color: ${colors.Dark_hover};
  }
`;

export default DepartmentSelectItem;
