import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { Button } from '@/components/common/button/Button';
import { colors, fontWeight } from '@/styles/index';
import { Popup } from '@/components/common/popup/Popup';
import { VersionSelector } from '@/components/common/version/VersionCard';
import Divider from '@/components/common/divider/FlatDivider';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: { title: string; description: string; version: string }) => void;
  originalFileName: string;
  originalVersion: string;
}

export const DocsEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  originalFileName,
  originalVersion,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState(originalVersion);
  const [isVersionSelected, setIsVersionSelected] = useState(false);
  const [error, setError] = useState('');
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

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
    if (!file && !originalFileName) {
      setError('PDF 파일을 업로드해주세요.');
      return;
    }

    if (description.trim() === '') {
      setError('히스토리 설명을 입력해주세요.');
      return;
    }
    if (!isVersionSelected) {
      setError('버전을 선택해주세요.');
      return;
    }

    onSubmit({
      title: file?.name || originalFileName,
      description: description.trim(),
      version,
    });

    setFile(null);
    setDescription('');
    setVersion('');
    setError('');
    onClose();

    setTimeout(() => {
      setIsSuccessPopupOpen(true);
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');
  };

  const isDisabled = false;

  return (
    <>
      <Popup
        isOpen={isSuccessPopupOpen}
        isAlert
        title="수정 완료"
        message="데이터가 수정되었습니다."
        alertButtonText="확인"
        onClose={() => setIsSuccessPopupOpen(false)}
      />

      {isOpen && (
        <Overlay>
          <ModalBox>
            <Title>사내문서 데이터 수정</Title>
            <Divider />

            <UploadRow>
              <ReadOnlyInput value={file?.name || originalFileName} readOnly />
              <UploadButtonWrapper>
                <HiddenFileInput
                  type="file"
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => fileInputRef.current?.click()}
                >
                  + 업로드
                </Button>
              </UploadButtonWrapper>
            </UploadRow>
            {error && <ErrorText>{error}</ErrorText>}

            <DescriptionInput
              label="히스토리 설명"
              placeholder="히스토리 설명을 작성해주세요."
              maxLength={30}
              value={description}
              onChange={setDescription}
              errorMessage={error}
            />

            <VersionSelector
              onSelect={(ver: string) => {
                setVersion(ver);
                setIsVersionSelected(true);
                setError('');
              }}
            />
            {!isVersionSelected && error === '버전을 선택해주세요.' && (
              <ErrorText>버전을 선택해주세요.</ErrorText>
            )}

            <ButtonRow>
              <Button variant="dark" onClick={onClose}>
                취소
              </Button>
              <Button onClick={handleConfirm} disabled={isDisabled}>
                수정
              </Button>
            </ButtonRow>
          </ModalBox>
        </Overlay>
      )}
    </>
  );
};

export default DocsEditModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalBox = styled.div`
  background: ${colors.White};
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 720px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Dark};
`;

const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ReadOnlyInput = styled.input`
  flex: 1;
  height: 48px;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  background-color: #f5f5f5;
  color: #666;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadButtonWrapper = styled.div`
  button {
    height: 48px;
    width: 120px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
`;
const ErrorText = styled.p`
  color: ${colors.MainRed};
  font-size: 12px;
  margin: -8px 0 0 4px;
`;
