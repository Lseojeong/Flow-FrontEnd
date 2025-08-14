import React from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { CheckBox } from '@/components/common/checkbox/CheckBox';
import { DepartmentCheckProps } from './Department.types';

export const DepartmentCheck: React.FC<DepartmentCheckProps> = ({
  departments,
  selectedDepartmentIds,
  onChange,
  showTitle = true,
  showSelectAll = true,
  title = '부서 선택',
  userDepartmentId,
}) => {
  // 자신의 부서 강제 추가 로직 제거

  const isAllSelected =
    departments.length > 0 &&
    selectedDepartmentIds.length ===
      departments.length +
        (userDepartmentId && !departments.some((dept) => dept.departmentId === userDepartmentId)
          ? 1
          : 0);

  const handleDepartmentChange = (departmentId: string, checked: boolean) => {
    let newSelectedIds: string[];

    if (checked) {
      newSelectedIds = [...selectedDepartmentIds, departmentId];
    } else {
      newSelectedIds = selectedDepartmentIds.filter((id) => id !== departmentId);
    }

    onChange(newSelectedIds);
  };

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      // 모든 부서를 선택
      const allDepartmentIds = departments.map((dept) => dept.departmentId);
      onChange(allDepartmentIds);
    } else {
      // 모두 해제
      onChange([]);
    }
  };

  return (
    <Container>
      {showTitle && (
        <Header>
          <TitleSection>
            <Title>{title}</Title>
            <Description>보여질 부서를 선택하세요.</Description>
          </TitleSection>
          {showSelectAll && departments.length > 0 && (
            <CheckBox
              id="select-all-departments"
              size="small"
              label="모두 선택"
              checked={isAllSelected}
              onChange={handleSelectAllChange}
            />
          )}
        </Header>
      )}

      <CheckboxList>
        {departments.map((department) => {
          const isUserDepartment = department.departmentId === userDepartmentId;
          const isChecked = selectedDepartmentIds.includes(department.departmentId);

          return (
            <CheckboxItem key={department.departmentId}>
              <CheckBox
                id={`dept-${department.departmentId}`}
                label={department.departmentName}
                size="small"
                checked={isUserDepartment ? true : isChecked}
                disabled={isUserDepartment}
                onChange={(checked) => {
                  handleDepartmentChange(department.departmentId, checked);
                }}
              />
            </CheckboxItem>
          );
        })}
      </CheckboxList>

      {departments.length === 0 && <EmptyMessage>선택할 수 있는 부서가 없습니다.</EmptyMessage>}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Black};
  margin: 0;
`;

const Description = styled.p`
  font-size: 12px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
  margin: 0;
`;

const CheckboxList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 24px;
  color: ${colors.BoxText};
  font-size: 14px;
  font-weight: ${fontWeight.Regular};
`;
