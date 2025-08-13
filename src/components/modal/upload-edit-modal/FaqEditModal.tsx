import React from 'react';
import BaseUploadEditModal from './BaseUploadEditModal';
import { UPLOAD_MODAL_CONSTANTS } from '@/constants/Modal.constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: { file?: File; description: string; version: string }) => void;
  originalFileName: string;
  originalVersion: string;
}

export const FaqEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  originalFileName,
  originalVersion,
}) => {
  return (
    <BaseUploadEditModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      originalFileName={originalFileName}
      originalVersion={originalVersion}
      title="FAQ 데이터 수정"
      acceptFileType={UPLOAD_MODAL_CONSTANTS.CSV_ACCEPT}
    />
  );
};

export default FaqEditModal;
