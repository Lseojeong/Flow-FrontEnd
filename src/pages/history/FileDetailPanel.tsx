import React, { useState } from 'react';
import styled from 'styled-components';
import { DictFile, getPaginatedHistoryData } from '@/pages/mock/dictMock';
import { HistoryData } from '@/components/dash-board/historyTable/HistoryTable.types';
import DownloadIcon from '@/assets/icons/common/download.svg?react';
import ArrowIcon from '@/assets/icons/common/arrow.svg?react';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface Props {
  file: DictFile;
  onClose: () => void;
}

export const FileDetailPanel: React.FC<Props> = ({ file, onClose }) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleDateChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const { data: historyList, observerRef } = useInfiniteScroll<HistoryData, HTMLTableRowElement>({
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
        <Table>
          <thead>
            <tr>
              <Th>버전</Th>
              <Th>파일명</Th>
              <Th>관리자</Th>
              <Th>일시</Th>
              <Th>작업</Th>
              <Th>설명</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {historyList.map((item, index) => {
              const isLast = index === historyList.length - 1;
              return (
                <tr key={index} ref={isLast ? observerRef : null}>
                  <Td>{item.version}</Td>
                  <Td>{item.fileName}</Td>
                  <Td>{item.modifier}</Td>
                  <Td>{item.timeStamp}</Td>
                  <Td>{item.work}</Td>
                  <Td>{item.description}</Td>
                  <Td style={{ textAlign: 'center' }}>
                    <DownloadIcon />
                  </Td>
                </tr>
              );
            })}
            {historyList.length === 0 && (
              <tr>
                <Td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                  히스토리 데이터가 없습니다.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 720px;
  height: 100%;
  background-color: #fff;
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
  font-size: 18px;
  font-weight: 700;
  color: #0e3a95;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 10px;
    border-bottom: 1px solid #eee;
    font-size: 13px;
  }

  th {
    background-color: #0e3a95;
    color: white;
    font-weight: 600;
    text-align: left;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  td {
    text-align: left;
  }

  th:nth-child(1),
  th:nth-child(5),
  td:nth-child(1),
  td:nth-child(5) {
    text-align: center;
  }
`;

const Th = styled.th``;
const Td = styled.td``;

const SideCloseButton = styled.button`
  position: fixed;
  right: 720px; /* 패널 너비만큼 */
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 64px;
  background-color: #0e3a95;
  color: white;
  border: none;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  z-index: 1101;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    fill: white;
  }

  &:hover {
    background-color: #08307d;
  }
`;
