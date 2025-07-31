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
  const [selectedDepartments1, setSelectedDepartments1] = useState<string[]>([]);
  const [selectedDepartments2, setSelectedDepartments2] = useState<string[]>(['1', '4']);
  const [selectedDepartments3, setSelectedDepartments3] = useState<string[]>([]);

  return (
    <Container>
      <Title>DepartmentCheck 컴포넌트 테스트</Title>

      <Section>
        <SectionTitle>📋 기본 부서 선택</SectionTitle>
        <TestCase>
          <DepartmentCheck
            departments={MOCK_DEPARTMENTS}
            selectedDepartmentIds={selectedDepartments1}
            onChange={setSelectedDepartments1}
          />
          <Info>
            <strong>선택된 부서:</strong>
            <br />
            {selectedDepartments1.length > 0
              ? selectedDepartments1
                  .map((id) => {
                    const dept = MOCK_DEPARTMENTS.find((d) => d.departmentId === id);
                    return dept?.departmentName;
                  })
                  .join(', ')
              : '선택된 부서 없음'}
            <br />
            <strong>선택된 부서 수:</strong> {selectedDepartments1.length}개
          </Info>
        </TestCase>
      </Section>

      <Section>
        <SectionTitle>🏢 일부 선택된 상태</SectionTitle>
        <TestCase>
          <DepartmentCheck
            departments={MOCK_DEPARTMENTS}
            selectedDepartmentIds={selectedDepartments2}
            onChange={setSelectedDepartments2}
            title="관련 부서"
          />
          <Info>
            <strong>선택된 부서:</strong>
            <br />
            {selectedDepartments2.length > 0
              ? selectedDepartments2
                  .map((id) => {
                    const dept = MOCK_DEPARTMENTS.find((d) => d.departmentId === id);
                    return dept?.departmentName;
                  })
                  .join(', ')
              : '선택된 부서 없음'}
            <br />
            <strong>선택된 부서 수:</strong> {selectedDepartments2.length}개
          </Info>
        </TestCase>
      </Section>

      <Section>
        <SectionTitle>🎛️ 옵션 변경</SectionTitle>
        <TestCase>
          <DepartmentCheck
            departments={MOCK_DEPARTMENTS.slice(0, 4)} // 처음 4개만
            selectedDepartmentIds={selectedDepartments3}
            onChange={setSelectedDepartments3}
            showTitle={false}
            showSelectAll={false}
          />
          <Info>
            • 제목 숨김 (showTitle: false)
            <br />
            • 모두 선택 버튼 숨김 (showSelectAll: false)
            <br />
            • 부서 개수 제한 (4개만 표시)
            <br />
            <br />
            <strong>선택된 부서:</strong>
            <br />
            {selectedDepartments3.length > 0
              ? selectedDepartments3
                  .map((id) => {
                    const dept = MOCK_DEPARTMENTS.find((d) => d.departmentId === id);
                    return dept?.departmentName;
                  })
                  .join(', ')
              : '선택된 부서 없음'}
          </Info>
        </TestCase>
      </Section>

      <Section>
        <SectionTitle>📭 빈 부서 목록</SectionTitle>
        <TestCase>
          <DepartmentCheck
            departments={[]}
            selectedDepartmentIds={[]}
            onChange={() => {}}
            title="빈 부서 목록 테스트"
          />
          <Info>
            • 부서 목록이 비어있을 때의 상태
            <br />• 빈 상태 메시지 표시
          </Info>
        </TestCase>
      </Section>

      <ActionButtons>
        <ResetButton
          onClick={() => {
            setSelectedDepartments1([]);
            setSelectedDepartments2([]);
            setSelectedDepartments3([]);
          }}
        >
          모든 선택 초기화
        </ResetButton>
        <SelectAllButton
          onClick={() => {
            const allIds = MOCK_DEPARTMENTS.map((d) => d.departmentId);
            setSelectedDepartments1(allIds);
            setSelectedDepartments2(allIds);
            setSelectedDepartments3(allIds.slice(0, 4));
          }}
        >
          모든 테스트 케이스 전체 선택
        </SelectAllButton>
      </ActionButtons>
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

  @media (max-width: 768px) {
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

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid ${colors.BoxStroke};
`;

const ResetButton = styled.button`
  padding: 12px 24px;
  background-color: ${colors.Light};
  border: 1px solid ${colors.BoxStroke};
  border-radius: 6px;
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.BoxText};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.BoxStroke};
    color: ${colors.Normal};
  }
`;

const SelectAllButton = styled.button`
  padding: 12px 24px;
  background-color: ${colors.Normal};
  border: 1px solid ${colors.Normal};
  border-radius: 6px;
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.BoxText};
    border-color: ${colors.BoxText};
  }
`;
