import React, { useState } from 'react';
import styled from 'styled-components';
import { DictFile, getPaginatedHistoryData } from '@/pages/mock/dictMock';
import { HistoryData } from '@/components/dash-board/historyTable/HistoryTable.types';
import DownloadIcon from '@/assets/icons/common/download.svg?react';
import ArrowIcon from '@/assets/icons/common/arrow.svg?react';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { TableLayout, TableHeader, TableRow, ScrollableCell } from '@/components/common/table';
import { colors, fontWeight } from '@/styles';

interface Props {
  file: DictFile;
  onClose: () => void;
}

const columns = [
  { label: '버전', width: '80px', align: 'left' as const },
  { label: '파일명', width: '140px', align: 'left' as const },
  { label: '관리자', width: '100px', align: 'left' as const },
  { label: '일시', width: '150px', align: 'left' as const },
  { label: '작업', width: '80px', align: 'left' as const },
  { label: '설명', width: '160px', align: 'left' as const },
  { label: ' ', width: '80px', align: 'left' as const },
];

export const FileDetailPanel: React.FC<Props> = ({ file, onClose }) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleDateChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const { data: historyList } = useInfiniteScroll<HistoryData, HTMLTableRowElement>({
    fetchFn: getPaginatedHistoryData,
  });

  return (
    <Wrapper>
      <SideCloseButton onClick={onClose}>
        <ArrowIcon style={{ transform: 'rotate(270deg)' }} />
      </SideCloseButton>

      <Header>
        <Title>{file.name} 히스토리</Title>
        <DateFilter startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
      </Header>

      <Content>
        <TableLayout>
          <TableHeader columns={columns} />
          <tbody>
            {historyList.map((item, index) => (
              <TableRow key={index}>
                <td>{item.version}</td>
                <ScrollableCell maxWidth="140px" align="left">
                  {item.fileName}
                </ScrollableCell>
                <td>{item.modifier}</td>
                <td>{item.timeStamp}</td>
                <td>{item.work}</td>
                <ScrollableCell maxWidth="160px" align="left">
                  {item.description}
                </ScrollableCell>
                <td style={{ textAlign: 'center' }}>
                  <DownloadIcon />
                </td>
              </TableRow>
            ))}
            {historyList.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                  히스토리 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </TableLayout>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 880px;
  height: 100%;
  background-color: ${colors.White};
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 24px;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0%);
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Normal};
  margin: 0;
`;

const Content = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 105px);
  overflow-y: auto;
`;

const SideCloseButton = styled.button`
  position: fixed;
  right: 880px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 64px;
  background-color: ${colors.Light_active};
  color: white;
  border: none;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  z-index: 1101;

  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  svg {
    width: 16px;
    height: 16px;
    fill: ${colors.White};
  }

  &:hover {
    background-color: ${colors.Normal_active};
  }
`;
