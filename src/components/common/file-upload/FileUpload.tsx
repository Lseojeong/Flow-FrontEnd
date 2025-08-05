import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { ErrorIcon } from '@/assets/icons/common/index';
import { colors, fontWeight } from '@/styles/index';
import { UploadInputProps } from './FileUpload.types';

const FILE_SIZE_LIMIT = 20 * 1024 * 1024;

type FileType = 'csv' | 'pdf';

const FILE_TYPE_CONFIG = {
  csv: {
    extension: '.csv',
    accept: '.csv',
    placeholder: '파일을 업로드(.csv 파일 / 최대 20MB)',
    label: 'CSV',
  },
  pdf: {
    extension: '.pdf',
    accept: '.pdf',
    placeholder: '파일을 업로드(.pdf 파일 / 최대 20MB)',
    label: 'PDF',
  },
} as const;

const ERROR_MESSAGES = {
  INVALID_EXTENSION: '지원하지 않는 확장자입니다.',
  FILE_TOO_LARGE: '20MB가 넘는 파일입니다.',
} as const;

const isValidFileExtension = (fileName: string, fileType: FileType): boolean => {
  const config = FILE_TYPE_CONFIG[fileType];
  return fileName.toLowerCase().endsWith(config.extension);
};

const isValidFileSize = (fileSize: number): boolean => {
  return fileSize <= FILE_SIZE_LIMIT;
};

const validateFile = (file: File, fileType: FileType): string | null => {
  if (!isValidFileExtension(file.name, fileType)) {
    return ERROR_MESSAGES.INVALID_EXTENSION;
  }

  if (!isValidFileSize(file.size)) {
    return ERROR_MESSAGES.FILE_TOO_LARGE;
  }

  return null;
};

export const UploadInput: React.FC<UploadInputProps> = ({ onFileSelect, fileType = 'csv' }) => {
  const [error, setError] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const resetFileSelection = (): void => {
    setSelectedFileName('');
  };

  const handleFileSelection = (file: File): void => {
    setSelectedFileName(file.name);
    onFileSelect(file);
  };

  const handleValidationError = (errorMessage: string): void => {
    setError(errorMessage);
    resetFileSelection();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validationError = validateFile(file, fileType);

    if (validationError) {
      handleValidationError(validationError);
      return;
    }

    setError('');
    handleFileSelection(file);
  };

  const currentConfig = FILE_TYPE_CONFIG[fileType];
  const hasError = !!error;
  const hasFile = !!selectedFileName;
  const displayText = selectedFileName || currentConfig.placeholder;

  return (
    <Wrapper>
      {hasError && (
        <ErrorMessages>
          {error.includes('확장자') && <div>{ERROR_MESSAGES.INVALID_EXTENSION}</div>}
          {error.includes('20MB') && <div>{ERROR_MESSAGES.FILE_TOO_LARGE}</div>}
        </ErrorMessages>
      )}
      <Label $hasError={hasError} $hasFile={hasFile}>
        <HiddenInput
          id="hidden-input"
          type="file"
          accept={currentConfig.accept}
          onChange={handleFileChange}
        />
        <Text $hasFile={hasFile}>{displayText}</Text>
        {hasError && (
          <ErrorWrapper>
            <ErrorIcon />
          </ErrorWrapper>
        )}
      </Label>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 556px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 48px;
`;

const ErrorMessages = styled.div`
  color: ${colors.MainRed};
  font-size: 10px;
  margin-bottom: 8px;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  visibility: ${({ children }) => (children ? 'visible' : 'hidden')};
`;

const Label = styled.label<{ $hasError: boolean; $hasFile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
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
  flex: 1;
  text-align: center;
`;

const ErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 20px;
    height: 20px;
  }
`;
