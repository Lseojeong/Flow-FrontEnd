import React from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { Props } from './CheckBox.types';

export const CheckBox: React.FC<Props> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <Label htmlFor={id} className={className}>
      <HiddenCheckbox
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <CustomBox $checked={checked} $disabled={disabled} />
      <Text $disabled={disabled}>{label}</Text>
    </Label>
  );
};

const Label = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
`;

const HiddenCheckbox = styled.input`
  display: none;
`;

const CustomBox = styled.span<{ $checked: boolean; $disabled: boolean }>`
  width: 12px;
  height: 12px;
  border: 0.3px solid ${({ $checked }) => ($checked ? colors.Normal : colors.BoxStroke)};
  background-color: ${({ $checked }) => ($checked ? colors.Normal : 'transparent')};
  border-radius: 2px;
  position: relative;
  transition: all 0.2s;

  ${({ $checked }) =>
    $checked &&
    `
    &::after {
      content: '';
      position: absolute;
      left: 30%;
      bottom: 30%;
      width: 3px;
      height: 6px;
      border: solid white;
      border-width: 0 1px 1px 0;
      transform: rotate(45deg);
    }
  `}

  ${({ $disabled }) =>
    $disabled &&
    `
    opacity: 0.4;
    cursor: not-allowed;
  `}

  ${({ $disabled, $checked }) =>
    !$disabled &&
    `
    label:hover & {
      border-color: ${colors.Normal};
      background-color: ${$checked ? 'rgba(15, 66, 157, 0.9)' : 'colors.Normal'};
    }
  `}
`;

const Text = styled.span<{ $disabled: boolean }>`
  font-size: 12px;
  color: ${({ $disabled }) => ($disabled ? colors.BoxStroke : colors.Black)};
  font-weight: ${fontWeight.Regular};
`;
