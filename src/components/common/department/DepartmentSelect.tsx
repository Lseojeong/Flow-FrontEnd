import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors } from '@/styles/index';
import {
  INPUT_HEIGHT,
  INPUT_FONT_SIZE,
  INPUT_FONT_WEIGHT,
} from '@/components/common/input/input.constants';
import DepartmentSelectItem from './DepartmentSelectItem';
import { ArrowIcon } from '@/assets/icons/common/index';

interface DepartmentSelectProps {
  options?: string[];
  value?: string;
  onChange: (_value: string) => void;
  placeholder?: string;
}

const Department_OPTIONS = ['전체', '기술 전략실', '재무실'];

const DepartmentSelect: React.FC<DepartmentSelectProps> = ({
  options = Department_OPTIONS,
  value = '전체',
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

  return (
    <DropdownContainer ref={ref}>
      <DropdownButton onClick={() => setOpen((prev) => !prev)} $open={open}>
        {value || <span className="placeholder">{placeholder}</span>}
        <Arrow $open={open}>
          <ArrowIcon />
        </Arrow>
      </DropdownButton>
      {open && (
        <DropdownList>
          {options.map((option) => (
            <DepartmentSelectItem
              key={option}
              option={option}
              selected={option === value}
              onClick={() => {
                onChange(option);
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

const DropdownButton = styled.button<{ $open: boolean }>`
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

const Arrow = styled.span<{ $open: boolean }>`
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
