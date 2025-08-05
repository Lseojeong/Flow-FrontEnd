import React from 'react';
import BaseUploadModal from './BaseUploadModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: { title: string; description: string; version: string }) => void;
}

export const FaqUploadModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <BaseUploadModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title="FAQ 데이터 등록"
      fileType="csv"
      downloadLink="/assets/faq-template.csv"
    />
  );
};

export default FaqUploadModal;
