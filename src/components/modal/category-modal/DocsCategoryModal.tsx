import React, { useState } from 'react';
import { Department } from '@/components/common/department/Department.types';
import { DepartmentCheck } from '@/components/common/department/DepartmentCheck';
import BaseCategoryModal from './BaseCategoryModal';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_: { name: string; description: string; departments: string[] }) => void;
  departments: Department[];
  existingCategoryNames: string[];
}

const DocsCategoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  departments,
  existingCategoryNames,
}) => {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const handleSubmit = (data: { name: string; description: string; departments?: string[] }) => {
    onSubmit({
      name: data.name,
      description: data.description,
      departments: selectedDepartments,
    });
  };

  return (
    <BaseCategoryModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      existingCategoryNames={existingCategoryNames}
      title="카테고리 등록"
    >
      <DepartmentCheck
        departments={departments}
        selectedDepartmentIds={selectedDepartments}
        onChange={setSelectedDepartments}
      />
    </BaseCategoryModal>
  );
};

export default DocsCategoryModal;
