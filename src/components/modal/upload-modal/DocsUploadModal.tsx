import React from 'react';
import BaseUploadModal from './BaseUploadModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: { title: string; description: string; version: string }) => void;
}

export const DocsUploadModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <BaseUploadModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title="사내문서 데이터 등록"
      fileType="pdf"
    />
  );
};

export default DocsUploadModal;
