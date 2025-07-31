import React, { useState } from 'react';
import styled from 'styled-components';
import { DepartmentCheck } from '@/components/common/department/DepartmentCheck';
import { Department } from '@/components/common/department/Department.types';
import { colors, fontWeight } from '@/styles/index';

const MOCK_DEPARTMENTS: Department[] = [
  { departmentId: '1', departmentName: '기술정보실' },
  { departmentId: '2', departmentName: '사무팀' },
  { departmentId: '3', departmentName: '출장비' },
  { departmentId: '4', departmentName: '개발팀' },
  { departmentId: '5', departmentName: 'B2B 사업부' },
  { departmentId: '6', departmentName: '마케팅팀' },
  { departmentId: '7', departmentName: '인사팀' },
  { departmentId: '8', departmentName: '재무팀' },
];

export const DepartmentPlayground: React.FC = () => {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  return (
    <Container>
      <Title>DepartmentCheck 컴포넌트 테스트</Title>

      <Section>
        <SectionTitle>📋 기본 부서 선택</SectionTitle>
        <TestCase>
          <DepartmentCheck
            departments={MOCK_DEPARTMENTS}
            selectedDepartmentIds={selectedDepartments}
            onChange={setSelectedDepartments}
          />
          <Info>
            <strong>선택된 부서:</strong>
            <br />
            {selectedDepartments.length > 0
              ? selectedDepartments
                  .map((id) => {
                    const dept = MOCK_DEPARTMENTS.find((d) => d.departmentId === id);
                    return dept?.departmentName;
                  })
                  .join(', ')
              : '선택된 부서 없음'}
            <br />
            <strong>선택된 부서 수:</strong> {selectedDepartments.length}개
          </Info>
        </TestCase>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: ${fontWeight.Bold};
  color: ${colors.Normal};
  margin-bottom: 40px;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 40px;
  padding: 24px;
  border: 1px solid ${colors.BoxStroke};
  border-radius: 8px;
  background-color: ${colors.background};
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Normal};
  margin-bottom: 16px;
`;

const TestCase = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: flex-start;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Info = styled.div`
  font-size: 14px;
  color: ${colors.BoxText};
  line-height: 1.6;
  padding: 16px;
  background-color: ${colors.Light};
  border-radius: 6px;
  border-left: 3px solid ${colors.Normal};
`;
