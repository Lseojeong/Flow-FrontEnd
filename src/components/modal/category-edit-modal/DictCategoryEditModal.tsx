import React from 'react';
import BaseCategoryEditModal from './BaseCategoryEditModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_: { name: string; description: string }) => void;
  initialName: string;
  initialDescription: string;
}

const DictCategoryModalEdit: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName,
  initialDescription,
}) => {
  return (
    <BaseCategoryEditModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      initialName={initialName}
      initialDescription={initialDescription}
      title="카테고리 수정"
    />
  );
};

export default DictCategoryModalEdit;
