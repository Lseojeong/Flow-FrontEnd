import React, { useState } from 'react';
import styled from 'styled-components';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { Button } from '@/components/common/button/Button';
import { colors, fontWeight } from '@/styles/index';
import { Popup } from '@/components/common/popup/Popup';
import { VersionSelector } from '@/components/common/version/VersionCard';
import { UploadInput } from '@/components/common/file-upload/FileUpload';
import Divider from '@/components/common/divider/FlatDivider';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: { title: string; description: string; version: string }) => void;
}

export const FaqUploadModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('');
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
    if (!file) {
      setError('PDF 파일을 업로드해주세요.');
      return;
    }

    const trimmedDesc = description.trim();

    onSubmit({
      title: file.name,
      description: trimmedDesc,
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

  const isDisabled = !file || version === '';

  return (
    <>
      <Popup
        isOpen={isSuccessPopupOpen}
        isAlert
        title="등록 완료"
        message="데이터가 등록되었습니다."
        alertButtonText="확인"
        onClose={() => setIsSuccessPopupOpen(false)}
      />

      {isOpen && (
        <Overlay>
          <ModalBox>
            <Title>FAQ 데이터 등록</Title>
            <Divider />    
            <DescriptionRow>
              <span>양식을 다운로드하여 내용을 채우고 업로드 해주세요.
              <DownloadLink href="/assets/faq-template.csv" download>
                양식 다운로드
              </DownloadLink></span>
            </DescriptionRow>         

            <UploadRow>
              <UploadInput
                onFileSelect={(selectedFile) => {
                  setFile(selectedFile);
                  setError('');
                }}
                fileType="csv"
              />
              <UploadButtonWrapper>
              <Button
                variant="primary"
                size="medium"
                onClick={() => {document.getElementById('hidden-input')?.click(); 

                }}
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
                        errorMessage="히스토리 설명을 입력해주세요."
                      />

            <VersionSelector onSelect={(ver: string) => setVersion(ver)} />

            <ButtonRow>
              <Button variant="dark" onClick={onClose}>
                취소
              </Button>
              <Button onClick={handleConfirm} disabled={isDisabled}>
                등록
              </Button>
            </ButtonRow>
          </ModalBox>
        </Overlay>
      )}
    </>
  );
};

export default FaqUploadModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
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
  gap : 8px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Black};
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

const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UploadButtonWrapper = styled.div`
  button {
    height : 48px;
    width: 120px;
  }
`;

const DescriptionRow = styled.div`
  font-size: 14px;
  color: ${colors.Black};
  margin: 8px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DownloadLink = styled.a`
  color: ${colors.Normal}; 
  text-decoration: underline;
  font-weight: ${fontWeight.Medium};
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`;