import React, { useState } from 'react';
import { Department } from '@/components/common/department/Department.types';
import { DepartmentCheck } from '@/components/common/department/DepartmentCheck';
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
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(initialDepartments);

  const handleSubmit = (data: { name: string; description: string; departments?: string[] }) => {
    onSubmit({
      name: data.name,
      description: data.description,
      departments: selectedDepartments,
    });
  };

  return (
    <BaseCategoryEditModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialName={initialName}
      initialDescription={initialDescription}
      title="카테고리 수정"
    >
      <DepartmentCheck
        departments={departments}
        selectedDepartmentIds={selectedDepartments}
        onChange={setSelectedDepartments}
      />
    </BaseCategoryEditModal>
  );
};

export default FaqCategoryEditModal;
