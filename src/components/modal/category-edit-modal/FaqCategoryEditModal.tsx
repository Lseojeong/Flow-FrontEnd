import React from 'react';
import { Department } from '@/components/common/department/Department.types';
import BaseCategoryEditModal from './BaseCategoryEditModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_: { name: string; description: string; departments: string[] }) => void;
  initialName: string;
  initialDescription: string;
  initialDepartments: string[];
  departments: Department[];
}

const FaqCategoryEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName,
  initialDescription,
  initialDepartments,
  departments,
}) => {
  return (
    <BaseCategoryEditModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      initialName={initialName}
      initialDescription={initialDescription}
      initialDepartments={initialDepartments}
      departments={departments}
      showDepartmentCheck={true}
      title="카테고리 수정"
    />
  );
};

export default FaqCategoryEditModal;
