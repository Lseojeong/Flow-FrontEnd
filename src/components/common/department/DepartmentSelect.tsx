import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors } from '@/styles/index';
import {
  INPUT_HEIGHT,
  INPUT_FONT_SIZE,
  INPUT_FONT_WEIGHT,
} from '@/constants/FilterSearch.constants';
import { ArrowIcon } from '@/assets/icons/common/index';
import { DepartmentSelectProps, DropdownStateProps, Department } from './Department.types';
import DepartmentSelectItem from './DepartmentSelectItem';

//더미 데이터
const MOCK_DEPARTMENTS: Department[] = [
  {
    departmentId: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
    departmentName: '고객지원팀',
  },
  {
    departmentId: 'b2c3d4e5-f6a1-8901-bcda-2345678901bc',
    departmentName: '기술지원팀',
  },
];

const DepartmentSelect: React.FC<DepartmentSelectProps> = ({
  options = MOCK_DEPARTMENTS,
  value,
  onChange,
  placeholder = '부서를 선택하세요',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectedDepartment = options.find((dept) => dept.departmentId === value);

  return (
    <DropdownContainer ref={ref}>
      <DropdownButton onClick={() => setOpen((prev) => !prev)} $open={open}>
        {selectedDepartment?.departmentName || <span className="placeholder">{placeholder}</span>}
        <Arrow $open={open}>
          <ArrowIcon />
        </Arrow>
      </DropdownButton>
      {open && (
        <DropdownList>
          {options.map((option) => (
            <DepartmentSelectItem
              key={option.departmentId}
              option={option}
              selected={option.departmentId === value}
              onClick={() => {
                onChange(option.departmentId);
                setOpen(false);
              }}
            />
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  height: ${INPUT_HEIGHT};
  width: 152px;
`;

const DropdownButton = styled.button<DropdownStateProps>`
  width: 152px;
  height: ${INPUT_HEIGHT};
  background: ${colors.White};
  border: 1px solid ${colors.BoxStroke};
  border-radius: 4px;
  font-size: ${INPUT_FONT_SIZE};
  color: ${colors.BoxText};
  font-weight: ${INPUT_FONT_WEIGHT};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  cursor: pointer;
  transition: border-color 0.2s;
  outline: none;

  .placeholder {
    color: ${colors.BoxText};
    font-weight: ${INPUT_FONT_WEIGHT};
    font-size: ${INPUT_FONT_SIZE};
  }

  &:hover,
  &:focus {
    border-color: ${colors.Normal};
  }
`;

const Arrow = styled.span<DropdownStateProps>`
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 16px;
    height: 16px;
  }
`;

const DropdownList = styled.ul`
  width: 152px;
  position: absolute;
  background: ${colors.White};
  border: 1px solid ${colors.BoxStroke};
  border-radius: 4px;
  z-index: 10;
  margin: 0;
  list-style: none;
`;

export default DepartmentSelect;
