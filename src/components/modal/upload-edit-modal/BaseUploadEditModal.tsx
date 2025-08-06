import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { Button } from '@/components/common/button/Button';
import { colors, fontWeight } from '@/styles/index';
import { VersionSelector } from '@/components/common/version/VersionCard';
import { UploadInput } from '@/components/common/file-upload/FileUpload';
import Divider from '@/components/common/divider/FlatDivider';
import { MODAL_STYLE, UPLOAD_MODAL_CONSTANTS } from '@/constants/Modal.constants';

interface BaseUploadEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: { title: string; description: string; version: string }) => void;
  originalFileName: string;
  originalVersion: string;
  title: string;
  acceptFileType: string;
  children?: React.ReactNode;
}

const BaseUploadEditModal: React.FC<BaseUploadEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  originalFileName,
  originalVersion,
  title,
  acceptFileType,
  children,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState(originalVersion);
  const [isVersionSelected, setIsVersionSelected] = useState(false);
  const [fileError, setFileError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConfirm = () => {
    onSubmit({
      title: file?.name || originalFileName,
      description: description.trim(),
      version,
    });

    setFile(null);
    setDescription('');
    setVersion('');
    setFileError('');
    onClose();

    setTimeout(() => {
      (window as { showToast?: (_message: string, _type: string) => void }).showToast?.(
        UPLOAD_MODAL_CONSTANTS.SUCCESS_EDIT_MESSAGE,
        'success'
      );
    }, MODAL_STYLE.TOAST_DELAY);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 파일 크기 검증 (20MB)
    const FILE_SIZE_LIMIT = 20 * 1024 * 1024;
    if (selectedFile.size > FILE_SIZE_LIMIT) {
      setFileError('20MB가 넘는 파일입니다.');
      return;
    }

    // 파일 확장자 검증
    const fileExtension = selectedFile.name.toLowerCase();
    if (!fileExtension.endsWith(acceptFileType.toLowerCase())) {
      setFileError('지원하지 않는 확장자입니다.');
      return;
    }

    setFile(selectedFile);
    setFileError('');
  };

  const handleVersionSelect = (ver: string) => {
    setVersion(ver);
    setIsVersionSelected(true);
  };

  const isDisabled = (!file && !originalFileName) || !isVersionSelected || !!fileError;

  return (
    <>
      {isOpen && (
        <Overlay>
          <ModalBox>
            <Title>{title}</Title>
            <Divider />

            <UploadRow>
              <FileInputContainer>
                {fileError && <ErrorText>{fileError}</ErrorText>}
                <UploadInput
                  fileType={acceptFileType === '.csv' ? 'csv' : 'pdf'}
                  value={file?.name || originalFileName}
                  readOnly={true}
                  onFileSelect={() => {}}
                />
              </FileInputContainer>
              <UploadButtonWrapper>
                <HiddenFileInput
                  type="file"
                  accept={acceptFileType}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {UPLOAD_MODAL_CONSTANTS.UPLOAD_BUTTON}
                </Button>
              </UploadButtonWrapper>
            </UploadRow>

            <DescriptionInput
              label="히스토리 설명"
              placeholder="히스토리 설명을 작성해주세요."
              maxLength={30}
              value={description}
              onChange={setDescription}
              errorMessage="히스토리 설명을 입력해주세요."
            />

            <VersionSelector onSelect={handleVersionSelect} />
            {children}

            <ButtonRow>
              <Button variant="dark" onClick={onClose}>
                {UPLOAD_MODAL_CONSTANTS.CANCEL_BUTTON}
              </Button>
              <Button onClick={handleConfirm} disabled={isDisabled}>
                {UPLOAD_MODAL_CONSTANTS.EDIT_BUTTON}
              </Button>
            </ButtonRow>
          </ModalBox>
        </Overlay>
      )}
    </>
  );
};

export default BaseUploadEditModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${MODAL_STYLE.OVERLAY_BACKGROUND};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${MODAL_STYLE.OVERLAY_Z_INDEX};
`;

const ModalBox = styled.div`
  background: ${colors.White};
  padding: ${MODAL_STYLE.PADDING};
  border-radius: ${MODAL_STYLE.BORDER_RADIUS};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: ${MODAL_STYLE.WIDTH};
  display: flex;
  flex-direction: column;
  gap: ${MODAL_STYLE.MODAL_GAP};
`;

const Title = styled.h3`
  font-size: ${MODAL_STYLE.TITLE_FONT_SIZE};
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Dark};
`;

const UploadRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
`;

const UploadButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${MODAL_STYLE.BUTTON_GAP};
  margin-top: 8px;
`;

const FileInputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ErrorText = styled.div`
  color: ${colors.MainRed};
  font-size: 10px;
  text-align: right;
`;
