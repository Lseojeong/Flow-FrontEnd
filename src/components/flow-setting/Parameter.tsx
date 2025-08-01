import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { ParameterProps } from './FlowSetting.types';

export const Parameter: React.FC<ParameterProps> = ({
  min = 0,
  max = 100,
  defaultValue = 50,
  value,
  onChange,
  label,
  showValue = true,
}) => {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const currentValue = value ?? internalValue;

  const getStep = () => {
    if (max === 1) return 0.1;
    if (max === 1024) return 128;
    return 1;
  };

  const percentage = ((currentValue - min) / (max - min)) * 100;

  const getValuePosition = () => {
    if (percentage <= 50) {
      return { left: `calc(${percentage}% - ${percentage * 0.48}px)` };
    }
    const rightPercentage = 100 - percentage;
    return { right: `calc(${rightPercentage}% - ${rightPercentage * 0.48}px)` };
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Container>
      {label && (
        <LabelRow>
          <Label>{label}</Label>
        </LabelRow>
      )}
      <SliderContainer>
        {showValue && <ValueDisplay style={getValuePosition()}>{currentValue}</ValueDisplay>}
        <SliderInput
          type="range"
          min={min}
          max={max}
          step={getStep()}
          value={currentValue}
          onChange={handleChange}
          $percentage={percentage}
        />
      </SliderContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 360px;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Label = styled.label`
  display: block;
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
`;

const ValueDisplay = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: ${fontWeight.Medium};
  color: white;
  width: 48px;
  height: 24px;
  border-radius: 16px;
  pointer-events: none;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  text-align: center;
  box-sizing: border-box;
  background: ${colors.Normal};
`;

const SliderInput = styled.input<{ $percentage: number }>`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;

  width: 100%;
  height: 16px;
  border-radius: 8px;
  cursor: pointer;

  background: linear-gradient(
    to right,
    rgba(233, 235, 248, 1) 0%,
    rgba(15, 66, 157, 1) ${(props) => props.$percentage}%,
    ${colors.GridLine} ${(props) => props.$percentage}%,
    ${colors.GridLine} 100%
  );

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    border: none;
    width: 48px;
    height: 24px;
    background: ${colors.Normal};
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    transform-origin: center;
  }

  &::-webkit-slider-thumb:hover {
    background: linear-gradient(135deg, rgba(15, 66, 157, 1), rgba(15, 66, 157, 0.8));
    box-shadow: 0 4px 12px rgba(15, 66, 157, 0.4);
  }

  &::-moz-range-thumb {
    border: none;
    width: 48px;
    height: 24px;
    background: ${colors.Normal};
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  &::-moz-range-thumb:hover {
    background: linear-gradient(135deg, rgba(15, 66, 157, 1), rgba(15, 66, 157, 0.8));
    box-shadow: 0 4px 12px rgba(15, 66, 157, 0.4);
  }
`;
