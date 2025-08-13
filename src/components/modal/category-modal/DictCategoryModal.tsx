import React from 'react';
import BaseCategoryModal from './BaseCategoryModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_: { name: string; description: string }) => void;
  existingCategoryNames: string[];
}

const DictCategoryModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <BaseCategoryModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title="카테고리 등록"
    />
  );
};

export default DictCategoryModal;
