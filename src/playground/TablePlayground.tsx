import React from 'react';
import styled from 'styled-components';
import { TableLayout } from '@/components/common/table/TableLayout';
import { TableHeader } from '@/components/common/table/TableHeader';
import { TableRow } from '@/components/common/table/TableRow';
import { ScrollableCell } from '@/components/common/table/ScrollableCell';
import { colors } from '@/styles/index';

const mockData = [
  {
    id: 1,
    category: '카카오워크 용어사전',
    status: '완료',
    documentCount: 12,
    departments:
      '기술전략실, B2B 사업부, 재무팀, 총무팀, 개발팀, 인프라팀, UX팀, 마케팅팀,기술전략실, B2B 사업부, 재무팀, 총무팀, 개발팀, 인프라팀, UX팀, 마케팅팀,기술전략실, B2B 사업부, 재무팀, 총무팀, 개발팀, 인프라팀, UX팀, 마케팅팀',
    lastModified: '2025.07.05',
  },
  {
    id: 2,
    category: '제품번호',
    status: '진행중',
    documentCount: 8,
    departments: '기술전략실, B2B 사업부',
    lastModified: '2025.07.04',
  },
  {
    id: 3,
    category: 'API 문서',
    status: '대기',
    documentCount: 15,
    departments: '개발팀, 인프라팀',
    lastModified: '2025.07.03',
  },
  {
    id: 4,
    category: '사용자 가이드',
    status: '완료',
    documentCount: 6,
    departments: 'UX팀, 마케팅팀',
    lastModified: '2025.07.02',
  },
];

const columns = [
  { label: '카테고리', width: '300px', align: 'left' as const },
  { label: '상태', width: '100px', align: 'center' as const },
  { label: '문서 수', width: '100px', align: 'center' as const },
  { label: '포함 부서', width: '400px', align: 'left' as const },
  { label: '최종 수정일', width: '150px', align: 'left' as const },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case '완료':
      return '#4CAF50';
    case '진행중':
      return '#FF9800';
    case '대기':
      return '#F44336';
    default:
      return colors.BoxText;
  }
};

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  background-color: ${({ status }) => getStatusColor(status)};
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

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
                <ScrollableCell maxWidth="280px" align="left">
                  {row.category}
                </ScrollableCell>
                <ScrollableCell maxWidth="100px" align="center">
                  <StatusBadge status={row.status}>{row.status}</StatusBadge>
                </ScrollableCell>
                <ScrollableCell maxWidth="100px" align="center">
                  {row.documentCount}
                </ScrollableCell>
                <ScrollableCell maxWidth="380px" align="left">
                  {row.departments}
                </ScrollableCell>
                <ScrollableCell maxWidth="150px" align="left">
                  {row.lastModified}
                </ScrollableCell>
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

export default TablePlayground;
