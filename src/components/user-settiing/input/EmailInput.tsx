import React from 'react';
import styled from 'styled-components';
import { colors } from '@/styles/index';
import { EmailInputProps } from './EmailInput.types';

const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  onKeyDown,
  hasError = false,
  placeholder = '이메일을 입력하세요',
}) => {
  return (
    <StyledEmailInput
      type="email"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      $hasError={hasError}
    />
  );
};

const StyledEmailInput = styled.input<{ $hasError?: boolean }>`
  height: 32px;
  padding: 0 12px;
  border: 1px solid ${({ $hasError }) => ($hasError ? colors.MainRed : colors.BoxStroke)};
  border-radius: 4px;
  font-size: 12px;
  outline: none;
  transition: border-color 0.2s;
  text-align: center;

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? colors.MainRed : colors.Normal)};
  }

  &::placeholder {
    color: ${colors.BoxText};
  }
`;

export default EmailInput;
