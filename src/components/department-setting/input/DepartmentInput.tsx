import React from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { DepartmentInputProps } from './DepartmentInput.types';

const DepartmentInput: React.FC<DepartmentInputProps> = ({ value, onChange, onKeyDown, error }) => {
  return (
    <InputContainer>
      <Label>부서</Label>
      <StyledInput
        type="text"
        placeholder="부서를 입력해주세요.(최대 10자)"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        maxLength={10}
        hasError={!!error}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

const InputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Black};
  margin-bottom: 8px;
`;

const StyledInput = styled.input<{ hasError: boolean }>`
  height: 32px;
  padding: 0 12px;
  border: 1px solid ${(props) => (props.hasError ? colors.MainRed : colors.BoxStroke)};
  border-radius: 4px;
  font-size: 12px;
  outline: none;
  transition: border-color 0.2s;
  text-align: center;

  &:focus {
    border-color: ${(props) => (props.hasError ? colors.MainRed : colors.Normal)};
  }

  &::placeholder {
    color: ${colors.BoxText};
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.MainRed};
  font-size: 12px;
  margin-top: 4px;
`;

export default DepartmentInput;
