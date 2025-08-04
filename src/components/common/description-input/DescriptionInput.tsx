import React, { useState } from 'react';
import styled from 'styled-components';
import { fontWeight, colors } from '@/styles/index';
import { Props } from './DescriptionInput.types';

/**
 * Note: 카테고리 설명, 히스토리 설명 입력 필드 공통 컴포넌트
 * Playground 테스트 코드 참고: src/playground/InputPlayground.tsx
 */

const DEFAULT_CONFIG = {
  MAX_LENGTH: 50,
  PLACEHOLDER: '카테고리 설명을 작성해주세요.',
  LABEL: '카테고리 설명',
  ERROR_MESSAGE: '카테고리 설명을 입력해주세요.',
} as const;

const COLOR_THRESHOLDS = {
  WARNING: 0.8,
  CRITICAL: 1.0,
} as const;

const COUNTER_COLORS = {
  NORMAL: colors.BoxText,
  WARNING: '#FFB560',
  CRITICAL: '#FF8902',
} as const;

const getCounterColor = (currentLength: number, maxLength: number): string => {
  const warningThreshold = Math.floor(maxLength * COLOR_THRESHOLDS.WARNING);
  const criticalThreshold = maxLength * COLOR_THRESHOLDS.CRITICAL;

  if (currentLength >= criticalThreshold) return COUNTER_COLORS.CRITICAL;
  if (currentLength >= warningThreshold) return COUNTER_COLORS.WARNING;
  return COUNTER_COLORS.NORMAL;
};

const validateInput = (value: string, touched: boolean, errorMessage: string): string => {
  if (!touched || value.trim().length > 0) return '';
  return errorMessage;
};

const shouldLimitInput = (newValue: string, maxLength: number): boolean => {
  return newValue.length <= maxLength;
};

export const DescriptionInput: React.FC<Props> = ({
  label = DEFAULT_CONFIG.LABEL,
  placeholder = DEFAULT_CONFIG.PLACEHOLDER,
  maxLength = DEFAULT_CONFIG.MAX_LENGTH,
  errorMessage = DEFAULT_CONFIG.ERROR_MESSAGE,
  value: controlledValue,
  onChange,
  onBlur,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [touched, setTouched] = useState(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const handleValueChange = onChange || setInternalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;

    if (shouldLimitInput(newValue, maxLength)) {
      handleValueChange(newValue);
    }
  };

  const handleBlur = (): void => {
    setTouched(true);
    onBlur?.();
  };

  const validationError = validateInput(value, touched, errorMessage);
  const hasError = !!validationError;
  const hasValue = !!value.trim();
  const counterColor = getCounterColor(value.length, maxLength);

  return (
    <Container>
      <LabelRow>
        <Label>{label}</Label>
        {validationError && <ErrorMessage>*{validationError}</ErrorMessage>}
      </LabelRow>

      <InputWrapper>
        <Input
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          $hasError={hasError}
          $hasValue={hasValue}
        />
        <CharacterCounter>
          <CurrentCount $color={counterColor}>{value.length}</CurrentCount>
          <MaxCount>/{maxLength}</MaxCount>
        </CharacterCounter>
      </InputWrapper>
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

const InputWrapper = styled.div`
  position: relative;
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
  font-family: inherit;
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

const CharacterCounter = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  font-size: 12px;
  background-color: transparent;
  padding: 2px 4px;
  pointer-events: none;
`;

const CurrentCount = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-weight: ${fontWeight.Medium};
`;

const MaxCount = styled.span`
  color: ${colors.BoxText};
`;
