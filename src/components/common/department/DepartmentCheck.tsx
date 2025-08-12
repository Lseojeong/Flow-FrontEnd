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
  React.useEffect(() => {
    if (userDepartmentId && departments.length > 0) {
      const userDepartment = departments.find((dept) => dept.departmentId === userDepartmentId);
      if (userDepartment && !selectedDepartmentIds.includes(userDepartmentId)) {
        onChange([...selectedDepartmentIds, userDepartmentId]);
      }
    }
  }, [userDepartmentId, departments, selectedDepartmentIds, onChange]);

  const isAllSelected =
    departments.length > 0 && selectedDepartmentIds.length === departments.length;

  const handleDepartmentChange = (departmentId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedDepartmentIds, departmentId]);
    } else {
      onChange(selectedDepartmentIds.filter((id) => id !== departmentId));
    }
  };

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      onChange(departments.map((dept) => dept.departmentId));
    } else {
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
                  if (!isUserDepartment) {
                    handleDepartmentChange(department.departmentId, checked);
                  }
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
