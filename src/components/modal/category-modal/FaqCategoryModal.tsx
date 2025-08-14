import React from 'react';
import { Department } from '@/components/common/department/Department.types';
import BaseCategoryModal from './BaseCategoryModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_: { name: string; description: string; departments: string[] }) => void;
  onSuccess?: () => void;
  departments: Department[];
}

const FaqCategoryModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, departments }) => {
  const handleSubmit = (data: { name: string; description: string; departments?: string[] }) => {
    onSubmit({
      name: data.name,
      description: data.description,
      departments: data.departments ?? [],
    });
  };

  return (
    <BaseCategoryModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="FAQ 카테고리 등록"
      departments={departments}
      showDepartmentCheck={true}
    />
  );
};

export default FaqCategoryModal;
