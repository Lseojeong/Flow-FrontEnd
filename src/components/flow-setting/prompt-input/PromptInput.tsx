import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { PromptInputProps } from './PromptInput.types';
import { ResetIcon } from '@/assets/icons/common/index';

const COUNTER_COLORS = {
  NORMAL: colors.BoxText,
  WARNING: '#FFB560',
  CRITICAL: colors.MainRed,
} as const;

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  placeholder = '프롬프트를 입력해주세요(ex. 답변은 존댓말로 공손하고 친절하게 작성해)',
  maxLength = 300,
  label = '프롬프트',
  defaultValue,
}) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    if (newValue.length <= maxLength) {
      setInternalValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const getCounterColor = (length: number) => {
    if (length >= 290) return COUNTER_COLORS.CRITICAL; // 290자 이상
    if (length >= 250) return COUNTER_COLORS.WARNING; // 250자 이상
    return COUNTER_COLORS.NORMAL;
  };

  const handleReset = () => {
    const resetValue = defaultValue || '';
    setInternalValue(resetValue);
    onChange?.(resetValue);
  };

  return (
    <Container>
      <LabelRow>
        <Label>{label}</Label>
        <ResetButton
          onClick={handleReset}
          disabled={!currentValue || currentValue === defaultValue}
        >
          <ResetIcon />
        </ResetButton>
      </LabelRow>
      <TextAreaContainer>
        <TextArea
          value={currentValue}
          onChange={handleChange}
          placeholder={isFocused || currentValue ? '' : placeholder}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <CharacterCount>
          <CounterNumber $color={getCounterColor(currentValue.length)}>
            {currentValue.length}
          </CounterNumber>
          <CounterMax>/{maxLength}</CounterMax>
        </CharacterCount>
      </TextAreaContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Dark_active};
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  color: ${colors.BoxText};

  &:hover:not(:disabled) {
    background: ${colors.background};
    color: ${colors.Normal};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const TextAreaContainer = styled.div`
  position: relative;
  width: 100%;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 0;
  border: 1px solid ${colors.BoxStroke};
  font-size: 14px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.Black};
  background-color: white;
  resize: none;
  outline: none;
  box-sizing: border-box;
  border-radius: 4px;

  text-align: center;
  line-height: 118px;

  &::placeholder {
    color: ${colors.BoxText};
  }

  &:focus {
    border-color: ${colors.Normal};
    line-height: 1.5;
    padding: 16px;
    text-align: left;
  }

  &:not(:placeholder-shown) {
    line-height: 1.5;
    padding: 16px;
    text-align: left;
  }
`;

const CharacterCount = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: ${fontWeight.Regular};
  display: flex;
  align-items: center;
`;

const CounterNumber = styled.span<{ $color: string }>`
  color: ${(props) => props.$color};
`;

const CounterMax = styled.span`
  color: ${colors.BoxText};
`;
