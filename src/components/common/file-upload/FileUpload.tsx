import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { ErrorIcon } from '@/assets/icons/common/index';
import { colors, fontWeight } from '@/styles/index';
import { Props } from './FileUpload.types';

export const UploadInput: React.FC<Props> = ({ onFileSelect }) => {
  const [error, setError] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isCSV = file.name.endsWith('.csv');
    const isUnder20MB = file.size <= 20 * 1024 * 1024;

    if (!isCSV) {
      setError('지원하지 않는 확장자입니다.');
      setSelectedFileName('');
      return;
    }
    if (!isUnder20MB) {
      setError('20MB가 넘는 파일입니다.');
      setSelectedFileName('');
      return;
    }

    setError('');
    setSelectedFileName(file.name);
    onFileSelect(file);
  };

  return (
    <Wrapper>
      {error && (
        <ErrorMessages>
          {error.includes('확장자') && <div>지원하지 않는 확장자입니다.</div>}
          {error.includes('20MB') && <div>20MB가 넘는 파일입니다.</div>}
        </ErrorMessages>
      )}
      <Label $hasError={!!error} $hasFile={!!selectedFileName}>
        <HiddenInput type="file" accept=".csv" onChange={handleFileChange} />
        <Text $hasFile={!!selectedFileName}>
          {selectedFileName || '파일을 업로드(파일은 .csv만 가능 / 최대 20MB)'}
        </Text>
        {error && (
          <ErrorIconWrapper>
            <ErrorIcon />
          </ErrorIconWrapper>
        )}
      </Label>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 560px;
`;

const ErrorMessages = styled.div`
  color: ${colors.MainRed};
  font-size: 10px;
  margin-bottom: 8px;
  text-align: right;
`;

const Label = styled.label<{ $hasError: boolean; $hasFile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border: 1px solid
    ${({ $hasError, $hasFile }) => {
      if ($hasError) return colors.MainRed;
      if ($hasFile) return colors.Normal;
      return colors.BoxStroke;
    }};
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  padding: 0 12px;
  box-sizing: border-box;
  position: relative;
  &:hover {
    border-color: ${({ $hasError }) => ($hasError ? colors.MainRed : colors.Normal)};
    background-color: ${({ $hasError }) => ($hasError ? colors.GridLine : colors.Light)};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Text = styled.span<{ $hasFile: boolean }>`
  font-size: 12px;
  font-weight: ${fontWeight.Regular};
  color: ${({ $hasFile }) => ($hasFile ? colors.Black : colors.BoxText)};
`;

const ErrorIconWrapper = styled.div`
  position: absolute;
  right: 12px;
  svg {
    width: 20px;
    height: 20px;
  }
`;
