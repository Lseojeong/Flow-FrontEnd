import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { Button } from '@/components/common/button/Button';
import { colors, fontWeight } from '@/styles/index';
import { VersionSelector } from '@/components/common/version/VersionCard';
import { UploadInput } from '@/components/common/file-upload/FileUpload';
import Divider from '@/components/common/divider/FlatDivider';
import { MODAL_STYLE, UPLOAD_MODAL_CONSTANTS } from '@/constants/Modal.constants';
import { Toast as ErrorToast } from '@/components/common/toast-popup/ErrorToastPopup';

interface BaseUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: {
    file: File;
    fileName: string;
    description: string;
    version: string;
    fileUrl: string;
  }) => Promise<void> | void;
  onSuccess?: () => void;
  title: string;
  fileType: 'csv' | 'pdf';
  downloadLink?: string;
  children?: React.ReactNode;
}

const BaseUploadModal: React.FC<BaseUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
  title,
  fileType,
  downloadLink,
  children,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('');
  const [fileError, setFileError] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!file || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await Promise.resolve(
        onSubmit({
          file,
          fileName: file.name,
          description: description.trim(),
          version,
          fileUrl,
        })
      );

      onSuccess?.();

      setFile(null);
      setDescription('');
      setVersion('');
      setFileError('');
      setFileUrl('');
      onClose();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '파일 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.';
      setErrorToastMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setFileError('');
    const localUrl = URL.createObjectURL(selectedFile);
    setFileUrl(localUrl);
  };

  const handleVersionSelect = (ver: string) => {
    setVersion(ver);
  };

  const isDisabled = !file || version === '' || !!fileError || isSubmitting;

  return (
    <>
      {isOpen && (
        <Overlay>
          <ModalBox>
            <Title>{title}</Title>
            <Divider />

            {downloadLink && (
              <DescriptionRow>
                <span>
                  양식을 다운로드하여 내용을 채우고 업로드 해주세요.
                  <DownloadLink href={downloadLink} download>
                    양식 다운로드
                  </DownloadLink>
                </span>
              </DescriptionRow>
            )}

            <UploadRow>
              <UploadInput
                onFileSelect={handleFileSelect}
                onError={setFileError}
                fileType={fileType}
              />
              <UploadButtonWrapper>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => {
                    document.getElementById('hidden-input')?.click();
                  }}
                  disabled={isSubmitting}
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
              <Button variant="dark" onClick={onClose} disabled={isSubmitting}>
                {UPLOAD_MODAL_CONSTANTS.CANCEL_BUTTON}
              </Button>
              <Button onClick={handleConfirm} disabled={isDisabled} isLoading={isSubmitting}>
                {UPLOAD_MODAL_CONSTANTS.REGISTER_BUTTON}
              </Button>
            </ButtonRow>
          </ModalBox>

          {errorToastMessage && (
            <ErrorToastWrapper>
              <ErrorToast message={errorToastMessage} onClose={() => setErrorToastMessage(null)} />
            </ErrorToastWrapper>
          )}
        </Overlay>
      )}
    </>
  );
};

export default BaseUploadModal;

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
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 724px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h3`
  font-size: ${MODAL_STYLE.TITLE_FONT_SIZE};
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Dark};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

const UploadRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 12px;
  height: 60px;
`;

const UploadButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

const DescriptionRow = styled.div`
  font-size: 14px;
  color: ${colors.Black};
  margin: 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DownloadLink = styled.a`
  color: ${colors.Normal};
  text-decoration: underline;
  font-weight: ${fontWeight.Medium};
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    color: rgb(255, 184, 77);
  }
`;

const ErrorToastWrapper = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
  pointer-events: none;
`;
