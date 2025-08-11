import React, { useState, useCallback, useEffect } from 'react';
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
import { getHistory } from '@/apis/dash-board/api';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Loading } from '@/components/common/loading/Loading';
import { formatDateTime } from '@/utils/formatDateTime';

export const HistoryTable: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [menu, setMenu] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);
  const [isTableScrolling, setIsTableScrolling] = useState(false);

  const fetchHistory = useCallback(
    async (cursor?: string) => {
      const formatDate = (dateString: string) => {
        if (!dateString) return undefined;
        return dateString.split('T')[0];
      };

      return getHistory({
        menu: menu || undefined,
        category: category || undefined,
        files: files.length > 0 ? files : undefined,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        cursor: cursor || undefined,
      });
    },
    [menu, category, files, startDate, endDate]
  );

  const {
    data: historyList,
    isLoading,
    observerRef,
    reset,
    loadMore,
    isFetchingNextPage,
    hasMore,
  } = useInfiniteScroll<
    {
      version: string;
      fileName: string;
      lastModifierName: string;
      lastModifierId: string;
      timestamp: string;
      work: string;
      description: string;
    },
    HTMLTableRowElement
  >({
    fetchFn: fetchHistory,
    queryKey: ['history', menu, category, ...files, startDate, endDate],
    enabled: !!(menu || category || files.length > 0 || (startDate && endDate)),
  });

  const columns = [
    { label: '버전', width: '80px', align: 'center' as const },
    { label: '파일명', width: '200px', align: 'left' as const },
    { label: '관리자', width: '150px', align: 'left' as const },
    { label: '일시', width: '150px', align: 'left' as const },
    { label: '작업', width: '120px', align: 'center' as const },
    { label: '설명', width: '458px', align: 'left' as const },
  ];

  const handleFilterConfirm = (filters: { menu: string[]; category: string[]; file: string[] }) => {
    console.log('필터 적용:', filters);
    setMenu(filters.menu[0] || '');
    setCategory(filters.category[0] || '');
    setFiles(filters.file);
    reset();
    setTimeout(() => {
      loadMore();
    }, 0);
  };

  const handleFilterCancel = () => {
    console.log('필터 취소');
  };

  const handleDateChange = (start: string | null, end: string | null) => {
    setStartDate(start || '');
    setEndDate(end || '');
    reset();
    if (start && end) {
      setTimeout(() => {
        loadMore();
      }, 0);
    }
  };

  const renderEmptyState = () => (
    <EmptyRow>
      <EmptyCell colSpan={columns.length}>
        <EmptyMessage>원하는 필터 옵션을 선택해주세요.</EmptyMessage>
      </EmptyCell>
    </EmptyRow>
  );

  const renderLoadingState = () => (
    <tr>
      <td colSpan={columns.length} style={{ textAlign: 'center', padding: '16px' }}>
        <Loading size={20} color="#666" />
      </td>
    </tr>
  );

  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtTop = target.scrollTop === 0;
    const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 1;

    if (!isAtTop && !isAtBottom) {
      setIsTableScrolling(true);
    } else {
      setIsTableScrolling(false);
    }
  };

  const handleTableScrollEnd = () => {
    setIsTableScrolling(false);
  };

  useEffect(() => {
    const preventPageScroll = (e: WheelEvent) => {
      if (isTableScrolling) {
        e.preventDefault();
      }
    };

    if (isTableScrolling) {
      document.addEventListener('wheel', preventPageScroll, { passive: false });
    }

    return () => {
      document.removeEventListener('wheel', preventPageScroll);
    };
  }, [isTableScrolling]);

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
          <thead>
            <TableHeader columns={columns} />
          </thead>
          <TableScrollWrapper
            onScroll={handleTableScroll}
            onScrollEnd={handleTableScrollEnd}
            style={{ overflow: isTableScrolling ? 'auto' : 'auto' }}
          >
            <tbody>
              {historyList.length === 0
                ? renderEmptyState()
                : historyList.map((row, index) => {
                    const isLast = index === historyList.length - 1;
                    return (
                      <TableRow key={index} ref={isLast && hasMore ? observerRef : undefined}>
                        <td style={{ width: '80px', minWidth: '80px', textAlign: 'center' }}>
                          {row.version}
                        </td>
                        <ScrollableCell maxWidth="200px" align="left">
                          {row.fileName}
                        </ScrollableCell>
                        <td style={{ width: '150px', minWidth: '150px', textAlign: 'left' }}>
                          {row.lastModifierId}({row.lastModifierName})
                        </td>
                        <td style={{ width: '150px', minWidth: '150px', textAlign: 'left' }}>
                          {formatDateTime(row.timestamp)}
                        </td>
                        <td style={{ width: '120px', minWidth: '120px', textAlign: 'center' }}>
                          <OperationBadge operation={row.work}>{row.work}</OperationBadge>
                        </td>
                        <ScrollableCell maxWidth="458px" align="left">
                          {row.description}
                        </ScrollableCell>
                      </TableRow>
                    );
                  })}
              {(isLoading || isFetchingNextPage) && renderLoadingState()}
            </tbody>
          </TableScrollWrapper>
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

const TableScrollWrapper = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border-radius: 8px;
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

const EmptyRow = styled.tr`
  border: none;
`;

const EmptyCell = styled.td`
  text-align: center;
  padding: 80px;
  border: none;
`;

const EmptyMessage = styled.div`
  color: ${colors.BoxText};
  font-size: 14px;
`;
