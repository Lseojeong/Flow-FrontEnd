import React from 'react';
import styled from 'styled-components';
import { CategorySearch } from '@/components/common/category-search/CategorySearch';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import DepartmentSelect from '@/components/common/department/DepartmentSelect';
import { DeleteIcon } from '@/assets/icons/common';
import { colors } from '@/styles';

interface CategoryFilterBarProps {
  selectedCount: number;
  isRootAdmin?: boolean;
  searchKeyword: string;
  onChangeKeyword: (_value: string) => void;
  onDelete: () => void;
  startDate: string | null;
  endDate: string | null;
  onDateChange: (_start: string | null, _end: string | null) => void;
  selectedDepartment: string | null;
  onChangeDepartment: (_id: string | null) => void;
  departments: { departmentId: string; departmentName: string }[];
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCount,
  isRootAdmin,
  searchKeyword,
  onChangeKeyword,
  onDelete,
  startDate,
  endDate,
  onDateChange,
  selectedDepartment,
  onChangeDepartment,
  departments,
}) => {
  return (
    <FilterBarBox>
      <DeleteIcon
        style={{
          cursor: selectedCount > 0 ? 'pointer' : 'default',
          color: selectedCount > 0 ? colors.Normal : colors.BoxText,
          pointerEvents: selectedCount > 0 ? 'auto' : 'none',
          marginRight: 6,
          width: 24,
          height: 24,
        }}
        onClick={onDelete}
      />
      <CategorySearch value={searchKeyword} onChange={(e) => onChangeKeyword(e.target.value)} />
      <DateFilter startDate={startDate} endDate={endDate} onDateChange={onDateChange} />
      {isRootAdmin && (
        <DepartmentSelect
          options={departments.map((dept) => ({
            departmentId: dept.departmentId,
            departmentName: dept.departmentName,
          }))}
          value={selectedDepartment ?? ''}
          onChange={(id) => onChangeDepartment(id ?? null)}
          showAllOption={false}
        />
      )}
    </FilterBarBox>
  );
};

const FilterBarBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 24px 20px;
`;
