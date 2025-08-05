import React from 'react';
import BaseUploadEditModal from './BaseUploadEditModal';
import { UPLOAD_EDIT_MODAL_CONSTANTS } from '@/constants/Modal.constants';

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
  return (
    <BaseUploadEditModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      originalFileName={originalFileName}
      originalVersion={originalVersion}
      title="사내문서 데이터 수정"
      acceptFileType={UPLOAD_EDIT_MODAL_CONSTANTS.PDF_ACCEPT}
    />
  );
};

export default DocsEditModal;
