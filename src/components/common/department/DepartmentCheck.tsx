import React from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { CheckBox } from '@/components/common/checkbox/CheckBox';
import { DepartmentCheckProps } from './Department.types';

/**
 * 부서 선택 체크박스 컴포넌트
 * TODO: 사용자의 부서가 무조건 체크되게 해야함
 */
export const DepartmentCheck: React.FC<DepartmentCheckProps> = ({
  departments,
  selectedDepartmentIds,
  onChange,
  showTitle = true,
  showSelectAll = true,
  title = '부서 선택',
}) => {
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
              label="모두 선택"
              checked={isAllSelected}
              onChange={handleSelectAllChange}
            />
          )}
        </Header>
      )}

      <CheckboxList>
        {departments.map((department) => (
          <CheckboxItem key={department.departmentId}>
            <CheckBox
              id={`dept-${department.departmentId}`}
              label={department.departmentName}
              checked={selectedDepartmentIds.includes(department.departmentId)}
              onChange={(checked) => handleDepartmentChange(department.departmentId, checked)}
            />
          </CheckboxItem>
        ))}
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
  font-size: 9px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
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
