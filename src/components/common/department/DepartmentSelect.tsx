import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
import { MOCK_DEPARTMENTS } from '@/pages/mock/dictMock';

// 프론트엔드에서만 "전체" 옵션 추가
const ALL_OPTION: Department = {
  departmentId: 'all',
  departmentName: '전체',
};

const DepartmentSelect: React.FC<DepartmentSelectProps> = ({
  options = MOCK_DEPARTMENTS,
  value = null,
  onChange,
  showAllOption = true, // "전체" 옵션 표시 여부 (기본값: true)
  placeholder = '부서', // placeholder 텍스트 (기본값: '부서')
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
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

  const handleDropdownToggle = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen((prev) => !prev);
  };

  // showAllOption이 true일 때만 "전체" 옵션 추가
  const allOptions = showAllOption ? [ALL_OPTION, ...options] : options;
  const selectedDepartment = allOptions.find((dept) => dept.departmentId === value);

  // 표시할 텍스트 결정
  const displayText =
    value === null
      ? showAllOption
        ? '전체'
        : placeholder
      : selectedDepartment?.departmentName || placeholder;

  return (
    <DropdownContainer ref={ref}>
      <DropdownButton onClick={handleDropdownToggle} $open={open}>
        <span className={value === null && !showAllOption ? 'placeholder' : ''}>{displayText}</span>
        <Arrow $open={open}>
          <ArrowIcon />
        </Arrow>
      </DropdownButton>
      {open &&
        createPortal(
          <DropdownList
            style={{
              position: 'absolute',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
            {allOptions.map((option) => (
              <DepartmentSelectItem
                key={option.departmentId}
                option={option}
                selected={
                  option.departmentId === 'all' ? value === null : option.departmentId === value
                }
                onClick={() => {
                  // "전체" 선택 시 null, 그 외에는 departmentId 전달
                  const selectedValue = option.departmentId === 'all' ? null : option.departmentId;
                  onChange(selectedValue);
                  setOpen(false);
                }}
              />
            ))}
          </DropdownList>,
          document.body
        )}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  height: ${INPUT_HEIGHT};
  width: 152px;
  position: relative;
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
  background: ${colors.White};
  border: 1px solid ${colors.BoxStroke};
  border-radius: 4px;
  z-index: 3000;
  margin: 0;
  list-style: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export default DepartmentSelect;
