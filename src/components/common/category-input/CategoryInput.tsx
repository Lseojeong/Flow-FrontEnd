import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { Props } from './CategoryInput.types';

// TODO: 카테고리 중복 체크 로직 추가

const MAX_LENGTH = 10;
const PLACEHOLDER_TEXT = `카테고리를 등록해주세요.(최대 ${MAX_LENGTH}글자)`;
const EMPTY_VALUE_ERROR = '카테고리를 입력해주세요.';

export const CategoryInput: React.FC<Props> = ({
  value,
  onChange,
  onBlur,
  error,
  showValidation = false,
}) => {
  const [touched, setTouched] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue.length <= MAX_LENGTH) {
      onChange(inputValue);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  const getErrorMessage = (): string => {
    if (error) return error;

    const shouldShowValidation = showValidation || touched;
    const isEmpty = value.trim() === '';

    if (shouldShowValidation && isEmpty) {
      return EMPTY_VALUE_ERROR;
    }

    return '';
  };

  const errorMessage = getErrorMessage();
  const hasError = !!errorMessage;

  return (
    <Container>
      <LabelRow>
        <Label>카테고리</Label>
        {errorMessage && <ErrorMessage>*{errorMessage}</ErrorMessage>}
      </LabelRow>
      <Input
        type="text"
        value={value}
        maxLength={MAX_LENGTH}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={PLACEHOLDER_TEXT}
        $hasError={hasError}
        $hasValue={!!value.trim()}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 660px;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Black};
`;

const ErrorMessage = styled.span`
  font-size: 10px;
  color: ${colors.MainRed};
`;

const Input = styled.input<{ $hasError: boolean; $hasValue: boolean }>`
  width: 660px;
  height: 38px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: ${fontWeight.Regular};
  border-radius: 4px;
  border: 1px solid
    ${({ $hasError, $hasValue }) => {
      if ($hasError) return colors.MainRed;
      if ($hasValue) return colors.Normal;
      return colors.BoxStroke;
    }};
  background-color: ${colors.White};
  color: ${colors.Black};
  line-height: 48px;
  text-align: center;

  &::placeholder {
    color: ${colors.BoxText};
  }
  &:hover {
    border-color: ${({ $hasError }) => ($hasError ? colors.MainRed : colors.Normal)};
    background-color: ${({ $hasError }) => ($hasError ? colors.GridLine : colors.Light)};
  }
  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? colors.MainRed : colors.Normal)};
  }
`;
