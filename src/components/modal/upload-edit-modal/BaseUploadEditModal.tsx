import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { Button } from '@/components/common/button/Button';
import { colors, fontWeight } from '@/styles/index';
import { VersionSelector } from '@/components/common/version/VersionCard';
import Divider from '@/components/common/divider/FlatDivider';
import { MODAL_STYLE, UPLOAD_EDIT_MODAL_CONSTANTS } from '@/constants/Modal.constants';

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
    onClose();

    setTimeout(() => {
      (window as { showToast?: (_message: string, _type: string) => void }).showToast?.(
        UPLOAD_EDIT_MODAL_CONSTANTS.SUCCESS_EDIT_MESSAGE,
        'success'
      );
    }, MODAL_STYLE.TOAST_DELAY);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
  };

  const handleVersionSelect = (ver: string) => {
    setVersion(ver);
    setIsVersionSelected(true);
  };

  const isDisabled = (!file && !originalFileName) || !isVersionSelected;

  return (
    <>
      {isOpen && (
        <Overlay>
          <ModalBox>
            <Title>{title}</Title>
            <Divider />

            <UploadRow>
              <ReadOnlyInput value={file?.name || originalFileName} readOnly />
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
                  {UPLOAD_EDIT_MODAL_CONSTANTS.UPLOAD_BUTTON}
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
                {UPLOAD_EDIT_MODAL_CONSTANTS.CANCEL_BUTTON}
              </Button>
              <Button onClick={handleConfirm} disabled={isDisabled}>
                {UPLOAD_EDIT_MODAL_CONSTANTS.EDIT_BUTTON}
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
  align-items: center;
  gap: ${MODAL_STYLE.CONTAINER_GAP};
`;

const UploadButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ReadOnlyInput = styled.input`
  flex: 1;
  height: 38px;
  padding: 0 12px;
  border: 1px solid ${colors.BoxStroke};
  border-radius: 4px;
  font-size: 12px;
  background-color: ${colors.GridLine};
  color: ${colors.BoxText};
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
