import React, { useState } from 'react';
import styled from 'styled-components';
import { fontWeight, colors } from '@/styles/index';

const MAX_LENGTH = 50;
const PLACEHOLDER = '카테고리 설명을 작성해주세요.';
const EMPTY_VALUE_ERROR = '카테고리 설명을 입력해주세요.';

export const CategoryDescription: React.FC = () => {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_LENGTH) {
      setValue(newValue);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const getErrorMessage = (): string => {
    const shouldShowValidation = touched;
    const isEmpty = value.trim() === '';

    if (shouldShowValidation && isEmpty) {
      return EMPTY_VALUE_ERROR;
    }

    return '';
  };

  const getCounterColor = (): string => {
    if (value.length >= 50) return '#FF8902';
    if (value.length >= 40) return '#FFB560';
    return colors.BoxText;
  };

  const errorMessage = getErrorMessage();
  const hasError = !!errorMessage;

  return (
    <Container>
      <LabelRow>
        <Label>설명</Label>
        {errorMessage && <ErrorMessage>*{errorMessage}</ErrorMessage>}
      </LabelRow>
      <TextAreaWrapper>
        <Input
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={PLACEHOLDER}
          $hasError={hasError}
          $hasValue={!!value.trim()}
        />
        <CharCount>
          <CurrentCount $color={getCounterColor()}>{value.length}</CurrentCount>
          <MaxCount>/{MAX_LENGTH}</MaxCount>
        </CharCount>
      </TextAreaWrapper>
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

const TextAreaWrapper = styled.div`
  position: relative;
`;

const Input = styled.input<{ $hasError?: boolean; $hasValue: boolean }>`
  width: 660px;
  height: 48px;
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

const CharCount = styled.div`
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
