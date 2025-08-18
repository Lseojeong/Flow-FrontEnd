import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import DownloadIcon from '@/assets/icons/common/download.svg?react';
import ArrowIcon from '@/assets/icons/common/arrow.svg?react';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDebounce, DEBOUNCE_DELAY } from '@/hooks/useDebounce';
import { TableLayout, TableHeader, TableRow, ScrollableCell } from '@/components/common/table';
import { colors, fontWeight } from '@/styles';
import type { FileItem } from '@/types/dictionary';

import { getDictFileHistories, searchDictFileHistories } from '@/apis/dictcategory_detail/api';
import type { DictFileHistory } from '@/apis/dictcategory_detail/api';

interface Props {
  file: FileItem;
  onClose: () => void;
}

const columns = [
  { label: '버전', width: '100px', align: 'left' as const },
  { label: '파일명', width: '135px', align: 'left' as const },
  { label: '관리자', width: '90px', align: 'left' as const },
  { label: '일시', width: '183px', align: 'left' as const },
  { label: '작업', width: '80px', align: 'left' as const },
  { label: '설명', width: '160px', align: 'left' as const },
  { label: ' ', width: '80px', align: 'left' as const },
];

export const FileDetailPanel: React.FC<Props> = ({ file, onClose }) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const rangeKey = `${startDate ?? ''}|${endDate ?? ''}`;
  const debouncedRangeKey = useDebounce(rangeKey, DEBOUNCE_DELAY);

  const startDateRef = useRef<string | null>(null);
  const endDateRef = useRef<string | null>(null);

  const isFirstRender = useRef(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleDateChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    const [s, e] = debouncedRangeKey.split('|');
    startDateRef.current = s || null;
    endDateRef.current = e || null;
  }, [debouncedRangeKey]);

  const formatDateForApi = (date: string | null, addOneDay = false) => {
    if (!date) return undefined;
    const d = new Date(date);
    if (addOneDay) d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const fetchHistory = useCallback(
    async (cursor?: string) => {
      const s = formatDateForApi(startDate);
      const e = formatDateForApi(endDate, true);

      if (s || e) {
        const res = await searchDictFileHistories(file.id, {
          startDate: s,
          endDate: e,
          cursor,
        });
        return {
          code: res.data.code,
          result: {
            historyList: res.data.result.historyList,
            pagination: {
              isLast: res.data.result.pagination.last,
            },
            nextCursor: res.data.result.nextCursor,
          },
        };
      } else {
        const res = await getDictFileHistories(file.id, cursor);
        return {
          code: res.data.code,
          result: {
            historyList: res.data.result.historyList,
            pagination: {
              isLast: res.data.result.pagination.last,
            },
            nextCursor: res.data.result.nextCursor,
          },
        };
      }
    },
    [file.id, startDate, endDate]
  );

  const {
    data: historyList,
    observerRef,
    reset,
    loadMore,
  } = useInfiniteScroll<DictFileHistory, HTMLTableRowElement>({
    queryKey: ['file-history', file.id],
    fetchFn: fetchHistory,
  });
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    reset();

    const t = setTimeout(() => loadMore(), 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.id, debouncedRangeKey]);

  return (
    <Wrapper>
      <SideCloseButton onClick={onClose}>
        <ArrowIcon style={{ transform: 'rotate(270deg)' }} />
      </SideCloseButton>

      <Header>
        <Title>{file.name} 히스토리</Title>
        <DateFilter startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
      </Header>

      <TableHeaderSection>
        <TableHeader columns={columns} />
      </TableHeaderSection>

      <TableBodySection>
        <TableWrapper>
          <TableLayout>
            <tbody>
              {historyList.map((item, index) => {
                const isLast = index === historyList.length - 1;
                return (
                  <TableRow key={`${item.version}-${index}`} ref={isLast ? observerRef : undefined}>
                    <td style={{ width: '100px', minWidth: '100px' }}>{item.version}</td>
                    <ScrollableCell maxWidth="135px" align="left">
                      {item.fileName}
                    </ScrollableCell>
                    <td style={{ width: '90px', minWidth: '90px' }}>{item.lastModifierName}</td>
                    <td style={{ width: '183px', minWidth: '183px' }}>
                      {item.timestamp?.replace('T', ' ').slice(0, 16)}
                    </td>
                    <td style={{ width: '80px', minWidth: '80px' }}>
                      <OperationBadge operation={item.work}>{item.work}</OperationBadge>
                    </td>
                    <ScrollableCell maxWidth="160px" align="left">
                      {item.description}
                    </ScrollableCell>
                    <td style={{ width: '84px', minWidth: '84px', textAlign: 'center' }}>
                      <a href={item.fileUrl} download>
                        <DownloadIcon />
                      </a>
                    </td>
                  </TableRow>
                );
              })}
              {historyList.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                    히스토리 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </TableLayout>
        </TableWrapper>
      </TableBodySection>
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

const TableHeaderSection = styled.div`
  margin-top: 24px;
`;

const TableBodySection = styled.div`
  flex: 1;
  max-height: calc(100vh - 154px);
  overflow-y: auto;
  overflow-x: hidden;
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

const TableWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
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
