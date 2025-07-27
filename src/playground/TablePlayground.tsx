import React from 'react';
import styled from 'styled-components';
import { TableLayout } from '@/components/common/table/TableLayout';
import { TableHeader } from '@/components/common/table/TableHeader';
import { TableRow } from '@/components/common/table/TableRow';
import { ScrollableCell } from '@/components/common/table/ScrollableCell';
import { StatusBadge } from '@/components/common/status/StatusBadge';
import { StatusSummary } from '@/components/common/status/StatusSummary';
import { DepartmentTagList } from '@/components/common/department/DepartmentTagList';
import { Department } from '@/components/common/department/Department.types';
import { colors } from '@/styles/index';

const mockData = [
  {
    id: 1,
    category: '카카오워크 용어사전',
    status: 'Completed',
    documentCount: 12,
    departments:
      '기술전략실, B2B 사업부, 재무팀, 총무팀, 개발팀, 인프라팀, UX팀, 마케팅팀,기술전략실, B2B 사업부, 재무팀, 총무팀, 개발팀, 인프라팀, UX팀, 마케팅팀,기술전략실, B2B 사업부, 재무팀, 총무팀, 개발팀, 인프라팀, UX팀, 마케팅팀',
    lastModified: '2025.07.05',
  },
  {
    id: 2,
    category: '제품번호',
    status: 'Processing',
    documentCount: 8,
    departments: '기술전략실, B2B 사업부',
    lastModified: '2025.07.04',
  },
  {
    id: 3,
    category: 'API 문서',
    status: 'Fail',
    documentCount: 15,
    departments: '개발팀, 인프라팀',
    lastModified: '2025.07.03',
  },
  {
    id: 4,
    category: '사용자 가이드',
    status: 'Completed',
    documentCount: 6,
    departments: 'UX팀, 마케팅팀',
    lastModified: '2025.07.02',
  },
];

const statusSummaryData = [
  { type: 'Completed' as const, count: 25 },
  { type: 'Processing' as const, count: 8 },
  { type: 'Fail' as const, count: 3 },
];

const columns = [
  { label: '카테고리', width: '300px', align: 'left' as const },
  { label: '상태', width: '120px', align: 'center' as const },
  { label: '문서 수', width: '100px', align: 'center' as const },
  { label: '포함 부서', width: '400px', align: 'left' as const },
  { label: '최종 수정일', width: '150px', align: 'left' as const },
];

const TablePlayground: React.FC = () => {
  return (
    <PlaygroundContainer>
      <PlaygroundHeader>
        <h1>테이블 컴포넌트 Playground</h1>
        <p>테이블 관련 컴포넌트들을 테스트할 수 있는 페이지입니다.</p>
      </PlaygroundHeader>

      <Section>
        <SectionTitle>기본 테이블</SectionTitle>
        <TableLayout>
          <TableHeader columns={columns} />
          <tbody>
            {mockData.map((row) => (
              <TableRow key={row.id}>
                <td style={{ width: '300px', textAlign: 'left', padding: '16px 24px' }}>
                  {row.category}
                </td>
                <td style={{ width: '120px', textAlign: 'center', padding: '16px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <StatusBadge status={row.status}>{row.status}</StatusBadge>
                  </div>
                </td>
                <td style={{ width: '100px', textAlign: 'center', padding: '16px 24px' }}>
                  {row.documentCount}
                </td>
                <ScrollableCell maxWidth="400px" align="left">
                  {row.departments}
                </ScrollableCell>
                <td style={{ width: '150px', textAlign: 'left', padding: '16px 24px' }}>
                  {row.lastModified}
                </td>
              </TableRow>
            ))}
          </tbody>
        </TableLayout>
      </Section>

      <Section>
        <SectionTitle>빈 데이터 테이블</SectionTitle>
        <TableLayout>
          <TableHeader columns={columns} />
          <tbody>
            <TableRow>
              <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                데이터가 없습니다.
              </td>
            </TableRow>
          </tbody>
        </TableLayout>
      </Section>

      <Section>
        <SectionTitle>상태 컴포넌트 테스트</SectionTitle>

        <SubSection>
          <SubSectionTitle>StatusBadge 컴포넌트</SubSectionTitle>
          <BadgeContainer>
            <StatusBadge status="Completed">Completed</StatusBadge>
            <StatusBadge status="Processing">Processing</StatusBadge>
            <StatusBadge status="Fail">Fail</StatusBadge>
          </BadgeContainer>
        </SubSection>

        <SubSection>
          <SubSectionTitle>StatusSummary 컴포넌트</SubSectionTitle>
          <StatusSummary items={statusSummaryData} />
        </SubSection>

        <SubSection>
          <SubSectionTitle>DepartmentTagList 컴포넌트</SubSectionTitle>
          <div>
            <h4>부서 태그 목록:</h4>
            <DepartmentTagList
              onDepartmentClick={(department: Department) =>
                console.log('선택된 부서:', department)
              }
            />
          </div>
        </SubSection>
      </Section>
    </PlaygroundContainer>
  );
};

const PlaygroundContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PlaygroundHeader = styled.div`
  margin-bottom: 32px;

  h1 {
    color: ${colors.Black};
    margin-bottom: 8px;
  }

  p {
    color: ${colors.BoxText};
    margin: 0;
  }
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: ${colors.Black};
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
`;

const SubSection = styled.div`
  margin-bottom: 24px;
`;

const SubSectionTitle = styled.h3`
  color: ${colors.Black};
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export default TablePlayground;
