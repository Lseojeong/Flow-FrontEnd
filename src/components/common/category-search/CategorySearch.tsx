import React from 'react';
import styled from 'styled-components';
import { SearchIcon } from '@/assets/icons/common';
import {
  INPUT_WIDTH,
  INPUT_HEIGHT,
  INPUT_ICON_SIZE,
  INPUT_FONT_SIZE,
  INPUT_FONT_WEIGHT,
  INPUT_TEXT_COLOR,
  INPUT_PLACEHOLDER_COLOR,
  INPUT_BORDER_COLOR,
  INPUT_FOCUS_COLOR,
  INPUT_BG_COLOR,
  INPUT_RADIUS,
  INPUT_PADDING,
} from '@/components/common/input/input.constants';

interface CategorySearchProps {
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const CategorySearch: React.FC<CategorySearchProps> = ({
  value,
  onChange,
  placeholder = '카테고리 검색',
}) => (
  <SearchBox>
    <SearchIconWrapper>
      <SearchIcon />
    </SearchIconWrapper>
    <StyledInput value={value} onChange={onChange} placeholder={placeholder} autoComplete="off" />
  </SearchBox>
);

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: ${INPUT_WIDTH};
  height: ${INPUT_HEIGHT};
  border: 1px solid ${INPUT_BORDER_COLOR};
  border-radius: ${INPUT_RADIUS};
  background: ${INPUT_BG_COLOR};
  padding: ${INPUT_PADDING};
  transition: border-color 0.2s;

  &:hover,
  &:focus-within {
    border-color: ${INPUT_FOCUS_COLOR};
  }
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
  color: ${INPUT_BORDER_COLOR};
  svg {
    width: ${INPUT_ICON_SIZE};
    height: ${INPUT_ICON_SIZE};
    display: block;
  }
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: ${INPUT_FONT_SIZE};
  font-weight: ${INPUT_FONT_WEIGHT};
  color: ${INPUT_TEXT_COLOR};
  padding: 0;

  &::placeholder {
    color: ${INPUT_PLACEHOLDER_COLOR};
    opacity: 0.7;
  }
`;

export default CategorySearch;
