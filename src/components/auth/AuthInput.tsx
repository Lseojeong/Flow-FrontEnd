import { useMemo } from 'react';
import styled from 'styled-components';
import { fontWeight, colors } from '@/styles/index';
import { FormInputProps } from './auth.types';

const DEFAULT_WIDTH = '368px';

export function FormInput({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  label,
  error,
  hasMarginBottom = true,
  maxLength,
  width = DEFAULT_WIDTH,
}: FormInputProps) {
  const finalMaxLength = useMemo(() => {
    return maxLength ?? getDefaultMaxLength(id);
  }, [id, maxLength]);

  return (
    <>
      <InputLabelRow $width={width}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        {error && <ErrorText>{error}</ErrorText>}
      </InputLabelRow>
      <InputWrapper $hasMarginBottom={hasMarginBottom} $width={width}>
        <StyledInput
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          $isError={!!error}
          maxLength={finalMaxLength}
        />
      </InputWrapper>
    </>
  );
}

//maxLength 기본값 설정
function getDefaultMaxLength(id: string): number | undefined {
  const maxLengths: Record<string, number> = {
    'login-nickname': 4,
    'login-id': 12,
    'login-pw': 32,
  };
  return maxLengths[id];
}

const InputLabelRow = styled.div<{ $width: string }>`
  display: flex;
  align-items: center;
  width: ${({ $width }) => $width};
  margin-bottom: 8px;
`;

const InputLabel = styled.label`
  font-size: 14px;
  color: ${colors.Black};
  font-weight: ${fontWeight.Regular};
  text-align: left;
`;

const ErrorText = styled.span`
  margin-left: auto;
  color: ${colors.MainRed};
  font-size: 10px;
  font-weight: ${fontWeight.Regular};
`;

const InputWrapper = styled.div<{ $hasMarginBottom: boolean; $width: string }>`
  position: relative;
  width: ${({ $width }) => $width};
  margin-bottom: ${({ $hasMarginBottom }) => ($hasMarginBottom ? '20px' : '0')};
`;

const StyledInput = styled.input<{ $isError?: boolean }>`
  width: 100%;
  height: 52px;
  padding: 12px;
  font-size: 12px;
  text-align: center;
  border: 1px solid ${({ $isError }) => ($isError ? colors.MainRed : colors.BoxStroke)};
  border-radius: 4px;
  background-color: ${colors.White};
  box-sizing: border-box;
  transition:
    border-color 0.2s,
    background-color 0.2s;

  &:hover {
    background-color: ${({ $isError }) => ($isError ? colors.GridLine : colors.Light)};
    border-color: ${({ $isError }) => ($isError ? colors.MainRed : colors.Normal)};
  }

  &:focus {
    border-color: ${({ $isError }) => ($isError ? colors.MainRed : colors.Normal)};
    outline: none;
  }
`;
