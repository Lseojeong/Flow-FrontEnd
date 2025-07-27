import React from 'react';
import styled from 'styled-components';
import { DepartmentTag } from './DepartmentTag';
import { DepartmentTagListProps, Department } from './Department.types';

// API 응답 예시 데이터
const MOCK_DEPARTMENTS: Department[] = [
  {
    departmentId: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
    departmentName: '고객지원팀',
  },
  {
    departmentId: 'b2c3d4e5-f6a1-8901-bcda-2345678901bc',
    departmentName: '기술지원팀',
  },
];

export const DepartmentTagList: React.FC<DepartmentTagListProps> = ({
  departments = MOCK_DEPARTMENTS,
  onDepartmentClick,
}) => {
  return (
    <TagListContainer>
      {departments.map((department) => (
        <DepartmentTag
          key={department.departmentId}
          department={department}
          onClick={() => onDepartmentClick?.(department)}
        />
      ))}
    </TagListContainer>
  );
};

const TagListContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

export default DepartmentTagList;
