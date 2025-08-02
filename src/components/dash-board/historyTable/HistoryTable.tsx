import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import {
  TableLayout,
  TableHeader,
  TableRow,
  ScrollableCell,
} from '@/components/common/table/index';
import { HistoryFilter } from '../history-filter/HistoryFilter';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import { historyMockData } from '@/pages/mock/dictMock';
import { HistoryData } from './HistoryTable.types';

export const HistoryTable: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredData, setFilteredData] = useState<HistoryData[]>([]);

  const columns = [
    { label: '버전', width: '80px', align: 'center' as const },
    { label: '파일명', width: '160px', align: 'left' as const },
    { label: '수정자', width: '120px', align: 'left' as const },
    { label: '일시', width: '120px', align: 'left' as const },
    { label: '작업', width: '100px', align: 'center' as const },
    { label: '설명', width: '400px', align: 'left' as const },
  ];

  const handleFilterConfirm = (filters: { menu: string[]; category: string[]; file: string[] }) => {
    console.log('필터 적용:', filters);
    // TODO: 필터링 로직은 나중에 실제 API 연동 시 구현
  };

  const handleFilterCancel = () => {
    console.log('필터 취소');
  };

  const handleDateChange = (start: string | null, end: string | null) => {
    setStartDate(start || '');
    setEndDate(end || '');

    if (!start || !end) {
      setFilteredData([]);
      return;
    }

    const filtered = historyMockData.filter((item) => {
      const itemDate = item.timeStamp;
      return itemDate >= start && itemDate <= end;
    });

    setFilteredData(filtered);
  };

  const renderTableRow = (row: HistoryData, index: number) => (
    <TableRow key={index}>
      <td style={{ width: '80px', textAlign: 'center', padding: '16px 24px' }}>{row.version}</td>
      <ScrollableCell maxWidth="160px" align="left">
        {row.fileName}
      </ScrollableCell>
      <td style={{ width: '160px', textAlign: 'left', padding: '16px 24px' }}>{row.modifier}</td>
      <td style={{ width: '160px', textAlign: 'left', padding: '16px 24px' }}>{row.timeStamp}</td>
      <td style={{ width: '100px', textAlign: 'center', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <OperationBadge operation={row.work}>{row.work}</OperationBadge>
        </div>
      </td>
      <ScrollableCell maxWidth="400px" align="left">
        {row.description}
      </ScrollableCell>
    </TableRow>
  );

  const renderEmptyState = () => (
    <TableRow>
      <td
        colSpan={columns.length}
        style={{ textAlign: 'center', padding: '80px', border: 'none', color: colors.BoxText }}
      >
        원하는 필터 옵션을 선택해주세요.
      </td>
    </TableRow>
  );

  return (
    <Container>
      <Header>
        <TitleRow>
          <TitleSection>
            <Title>작업 히스토리</Title>
            <FilterSection>
              <HistoryFilter onConfirm={handleFilterConfirm} onCancel={handleFilterCancel} />
              <DateFilter startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
            </FilterSection>
          </TitleSection>
        </TitleRow>
      </Header>

      <TableContainer>
        <TableLayout>
          <TableHeader columns={columns} />
          <tbody>
            {filteredData.length > 0 ? filteredData.map(renderTableRow) : renderEmptyState()}
          </tbody>
        </TableLayout>
      </TableContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Normal};
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TableContainer = styled.div`
  border-radius: 4px;
  overflow: hidden;
  background: ${colors.White};
`;

const OperationBadge = styled.span<{ operation: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Normal};
  background-color: ${colors.Light};
`;
