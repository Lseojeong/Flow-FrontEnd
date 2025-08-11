import { useState, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDebounce, DEBOUNCE_DELAY } from '@/hooks/useDebounce';
import { CategorySearch } from '@/components/common/category-search/CategorySearch';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import { CheckBox } from '@/components/common/checkbox/CheckBox';
import { TableLayout, TableHeader, TableRow } from '@/components/common/table';
import { Button } from '@/components/common/button/Button';
import SideBar from '@/components/common/layout/SideBar';
import { Loading } from '@/components/common/loading/Loading';
import StatusSummary from '@/components/common/status/StatusSummary';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { DeleteIcon, EditIcon } from '@/assets/icons/common/index';
import { colors, fontWeight } from '@/styles/index';
import { Toast as ErrorToast } from '@/components/common/toast-popup/ErrorToastPopup';
import Divider from '@/components/common/divider/Divider';
import DictCategoryModal from '@/components/modal/category-modal/DictCategoryModal';
import DictCategoryModalEdit from '@/components/modal/category-edit-modal/DictCategoryEditModal';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import {
  getAllDictCategories,
  createDictCategory,
  deleteDictCategories,
  updateDictCategory,
  searchDictCategories,
  SearchParams,
} from '@/apis/dictcategory/api';
import type { DictCategory, DictCategoryStatus } from '@/apis/dictcategory/types';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

const TABLE_COLUMNS = [
  { label: '카테고리', width: '554px', align: 'left' as const },
  { label: '상태', width: '204px', align: 'left' as const },
  { label: '문서 수', width: '80px', align: 'center' as const },
  { label: '최종 수정일', width: '180px', align: 'left' as const },
  { label: '', width: '77px', align: 'center' as const },
];

const CELL_WIDTHS = {
  CHECKBOX: '48px',
  CATEGORY: '554px',
  STATUS: '204px',
  DOCUMENT_COUNT: '80px',
  LAST_MODIFIED: '180px',
  ACTIONS: '77px',
} as const;

export default function DictionaryPage() {
  const [activeMenuId, setActiveMenuId] = useState('dictionary');
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedSearchKeyword = useDebounce(searchKeyword, DEBOUNCE_DELAY);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const rowKeyOf = (cat: DictCategory, idx: number) => String(cat.id ?? `row-${idx}-${cat.name}`);
  const debouncedStartDate = useDebounce(startDate, DEBOUNCE_DELAY);
  const debouncedEndDate = useDebounce(endDate, DEBOUNCE_DELAY);

  const isSearching = !!(debouncedSearchKeyword || debouncedStartDate || debouncedEndDate);

  const fetchFn = useCallback(
    async (cursor?: string) => {
      let data;
      const formatStartDate = (dateStr?: string | null) =>
        dateStr ? dateStr.slice(0, 10) : undefined;
      const formatEndDate = (dateStr?: string | null) => {
        if (!dateStr) return undefined;
        const date = new Date(dateStr);
        date.setDate(date.getDate() + 1);
        return date.toISOString().slice(0, 10);
      };

      if (isSearching) {
        const searchParams: SearchParams = {
          keyword: debouncedSearchKeyword || undefined,
          startDate: formatStartDate(debouncedStartDate),
          endDate: formatEndDate(debouncedEndDate),
          cursor: cursor || undefined,
        };
        const res = await searchDictCategories(searchParams);
        data = res.data as {
          code: string;
          result: {
            categoryList: (DictCategory & { fileStatus?: DictCategoryStatus })[];
            pagination: { last: boolean };
            nextCursor?: string;
          };
        };
      } else {
        const res = await getAllDictCategories(cursor);
        data = res.data as {
          code: string;
          result: {
            categoryList: (DictCategory & { fileStatus?: DictCategoryStatus })[];
            pagination: { last: boolean };
            nextCursor?: string;
          };
        };
      }

      const categoryList: DictCategory[] = (data.result?.categoryList ?? []).map((c) => ({
        ...c,
        lastModifiedDate: c.lastModifiedDate ?? (c.updatedAt ?? '').slice(0, 10),
        status: c.fileStatus ??
          c.status ?? {
            total: 0,
            Completed: 0,
            Processing: 0,
            Fail: 0,
          },
      }));

      return {
        code: data.code,
        result: {
          historyList: categoryList,
          pagination: data.result?.pagination ?? { last: true },
          nextCursor: data.result?.nextCursor,
        },
      };
    },
    [isSearching, debouncedSearchKeyword, debouncedStartDate, debouncedEndDate]
  );

  const {
    data: categories,
    observerRef,
    isLoading,
    refetch,
    reset,
    loadMore,
  } = useInfiniteScroll<DictCategory, HTMLTableRowElement>({
    fetchFn,
    getKey: (item) => item.id,
  });

  const existingCategoryNames = useMemo(() => categories.map((c) => c.name), [categories]);

  const isDateInRange = useCallback(
    (dateStr: string) => {
      if (!startDate && !endDate) return true;
      const date = new Date(dateStr);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (!start || date >= start) && (!end || date <= end);
    },
    [startDate, endDate]
  );

  const filteredCategories = useMemo(() => {
    const kw = debouncedSearchKeyword.toLowerCase();
    return categories.filter(
      (c) => c.name.toLowerCase().includes(kw) && isDateInRange(c.lastModifiedDate)
    );
  }, [categories, debouncedSearchKeyword, isDateInRange]);

  const selectedCount = filteredCategories.filter(
    (cat, idx) => !!checkedItems[rowKeyOf(cat, idx)]
  ).length;
  const isAllSelected =
    selectedCount === filteredCategories.length && filteredCategories.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setCheckedItems({});
    } else {
      const newChecked: Record<string, boolean> = {};
      filteredCategories.forEach((cat, idx) => {
        newChecked[rowKeyOf(cat, idx)] = true;
      });
      setCheckedItems(newChecked);
    }
  };

  const toggleCheckItem = (cat: DictCategory, idx: number) => {
    const key = rowKeyOf(cat, idx);
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEdit = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      setEditingCategory({
        id: category.id,
        name: category.name,
        description: category.description ?? '',
      });
      setIsEditModalOpen(true);
    }
  };

  const handleDateChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleRegisterCategory = async (data: { name: string; description: string }) => {
    try {
      const res = await createDictCategory(data);
      if (!(res.status === 200 || res.data?.code === 'CATEGORY200' || res.data?.code === '200')) {
        throw new Error(res.data?.message || '카테고리 등록 실패');
      }

      setIsCategoryModalOpen(false);
      setSearchKeyword('');
      setStartDate(null);
      setEndDate(null);
      setCheckedItems?.({});

      await refetch();

      (window as { showToast?: (_: string) => void }).showToast?.('카테고리를 등록했습니다.');
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '카테고리 등록에 실패했습니다.';
      setErrorToastMessage(errorMessage);
    }
  };

  const handleDeleteSelected = async () => {
    const selected = filteredCategories.filter((cat, idx) => checkedItems[rowKeyOf(cat, idx)]);
    if (selected.length === 0) return;
    const ids = selected.map((cat) => cat.id);
    try {
      const res = await deleteDictCategories(ids);
      if (res.status === 200 || res.data.code === '200') {
        (window as { showToast?: (_: string) => void }).showToast?.(
          '선택한 카테고리를 삭제했습니다.'
        );
        setCheckedItems({});
        await refetch();
      } else {
        throw new Error(res.data?.message || '카테고리 삭제에 실패했습니다.');
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '카테고리 삭제에 실패했습니다.';
      setErrorToastMessage(errorMessage);
    }
  };

  const handleUpdateCategory = async (payload: { name: string; description: string }) => {
    if (!editingCategory) return;
    try {
      const res = await updateDictCategory(editingCategory.id, payload);
      const code = (res as { data?: { code?: string } }).data?.code;
      if (code === 'COMMON200' || code === 'CATEGORY200' || code === '200') {
        (window as Window & { showToast?: (_m: string) => void }).showToast?.(
          '카테고리가 수정되었습니다.'
        );
        setIsEditModalOpen(false);
        setEditingCategory(null);
        reset();
        await loadMore();
      } else {
        throw new Error(res as unknown as string);
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '카테고리 수정에 실패했습니다.';
      setErrorToastMessage(errorMessage);
    }
  };

  const columns = [
    {
      label: (
        <CheckBox
          size="medium"
          variant="outline"
          id="select-all"
          checked={isAllSelected}
          onChange={toggleSelectAll}
          label=""
        />
      ),
      width: CELL_WIDTHS.CHECKBOX,
      align: 'center' as const,
    },
    ...TABLE_COLUMNS,
  ];

  useEffect(() => {
    setCheckedItems({});
    reset();
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchKeyword, debouncedStartDate, debouncedEndDate]);

  const renderTableRow = (category: DictCategory, index: number) => {
    const isChecked = !!checkedItems[rowKeyOf(category, index)];
    const isLastItem = index === categories.length - 1;
    const ref = isLastItem ? observerRef : undefined;

    return (
      <TableRow key={rowKeyOf(category, index)} ref={ref}>
        <td
          style={{
            width: CELL_WIDTHS.CHECKBOX,
            minWidth: CELL_WIDTHS.CHECKBOX,
            textAlign: 'center',
          }}
        >
          <CheckBox
            size="medium"
            id={`check-${category.id}-${index}`}
            checked={isChecked}
            onChange={() => toggleCheckItem(category, index)}
            label=""
          />
        </td>
        <td
          style={{
            width: CELL_WIDTHS.CATEGORY,
            minWidth: CELL_WIDTHS.CATEGORY,
            textAlign: 'left',
            padding: '25.5px 24px',
          }}
        >
          <StyledLink to={`/dictionary/${category.id}`}>{category.name}</StyledLink>
        </td>
        <td style={{ width: CELL_WIDTHS.STATUS, minWidth: CELL_WIDTHS.STATUS, textAlign: 'left' }}>
          <StatusWrapper>
            <StatusSummary
              items={[
                { type: 'Completed', count: category.status.Completed },
                { type: 'Processing', count: category.status.Processing },
                { type: 'Fail', count: category.status.Fail },
              ]}
            />
          </StatusWrapper>
        </td>
        <td
          style={{
            width: CELL_WIDTHS.DOCUMENT_COUNT,
            minWidth: CELL_WIDTHS.DOCUMENT_COUNT,
            textAlign: 'center',
          }}
        >
          {category.documentCount}
        </td>
        <td
          style={{
            width: CELL_WIDTHS.LAST_MODIFIED,
            minWidth: CELL_WIDTHS.LAST_MODIFIED,
            textAlign: 'left',
          }}
        >
          {category.lastModifiedDate}
        </td>
        <td
          style={{ width: CELL_WIDTHS.ACTIONS, minWidth: CELL_WIDTHS.ACTIONS, textAlign: 'center' }}
        >
          <EditIconWrapper>
            <EditIcon onClick={() => handleEdit(category.id)} />
          </EditIconWrapper>
        </td>
      </TableRow>
    );
  };

  const renderEmptyState = () => (
    <EmptyRow>
      <EmptyCell colSpan={columns.length}>
        <EmptyMessage>카테고리를 등록해주세요.</EmptyMessage>
      </EmptyCell>
    </EmptyRow>
  );

  return (
    <PageWrapper>
      <SideBarWrapper>
        <SideBar
          logoSymbol={symbolTextLogo}
          menuItems={menuItems}
          activeMenuId={activeMenuId}
          onMenuClick={setActiveMenuId}
        />
      </SideBarWrapper>
      <Content>
        <ContentWrapper>
          <HeaderSection>
            <PageTitle>용어 사전</PageTitle>
            <DescriptionRow>
              <Description>
                실제 사용하는 단어를 등록하여 Flow의 이해도를 높일 수 있습니다.
              </Description>
            </DescriptionRow>
          </HeaderSection>
          <Divider />
          <TopBar>
            <Button size="small" onClick={() => setIsCategoryModalOpen(true)}>
              + 카테고리 등록
            </Button>
          </TopBar>
          <FilterBar>
            <DeleteIcon
              style={{
                cursor: selectedCount > 0 ? 'pointer' : 'default',
                color: selectedCount > 0 ? colors.Normal : colors.BoxText,
                pointerEvents: selectedCount > 0 ? 'auto' : 'none',
                marginRight: 6,
                width: 24,
                height: 24,
              }}
              onClick={handleDeleteSelected}
            />
            <CategorySearch
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <DateFilter startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
          </FilterBar>

          <TableLayout>
            <thead>
              <TableHeader columns={columns} />
            </thead>
            <TableScrollWrapper>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} style={{ padding: 0 }}>
                      <LoadingWrapper>
                        <Loading size={32} color="#555" />
                        <span style={{ fontSize: '14px', color: '#555' }}>
                          용어사전 카테고리 불러오는 중...
                        </span>
                      </LoadingWrapper>
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  renderEmptyState()
                ) : (
                  filteredCategories.map((category, index) => renderTableRow(category, index))
                )}
              </tbody>
            </TableScrollWrapper>
          </TableLayout>
        </ContentWrapper>
      </Content>

      <DictCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleRegisterCategory}
        existingCategoryNames={existingCategoryNames}
      />
      {editingCategory && (
        <DictCategoryModalEdit
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateCategory}
          initialName={editingCategory.name}
          initialDescription={editingCategory.description}
        />
      )}
      {errorToastMessage && (
        <ErrorToastWrapper>
          <ErrorToast message={errorToastMessage} onClose={() => setErrorToastMessage(null)} />
        </ErrorToastWrapper>
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 1158px;
  overflow-x: auto;
`;

const SideBarWrapper = styled.div`
  flex-shrink: 0;
  width: 280px;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  min-width: 1158px;
  padding: 0 36px;
  background-color: ${colors.background};
`;

const ContentWrapper = styled.div`
  max-width: 1158px;
  margin: 0 auto;
  width: 100%;
`;

const PageTitle = styled.h1`
  font-size: 40px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Normal};
  margin-bottom: 12px;
  margin-top: 80px;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 16px;
`;

const DescriptionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Description = styled.p`
  font-size: 16px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 20px;
  margin-bottom: 28px;
`;

const EmptyRow = styled.tr`
  height: calc(100vh - 450px);
`;

const EmptyCell = styled.td<{ colSpan: number }>`
  padding: 0;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  text-align: center;
  color: ${colors.BoxText};
  font-size: 14px;
  transform: translateX(500px);
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
  height: 100%;
`;

const EditIconWrapper = styled.div`
  cursor: pointer;

  svg {
    color: ${colors.BoxText};
    transition: color 0.2s;
  }

  &:hover svg {
    color: ${colors.Normal};
  }
`;

const StyledLink = styled(Link)`
  color: ${colors.Black};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${colors.Normal};
  }
`;

const TableScrollWrapper = styled.div`
  max-height: 580px;
  overflow-y: auto;
  border-radius: 8px;
  background: ${colors.White};
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 450px);
  gap: 8px;
  transform: translateX(500px);
`;

const ErrorToastWrapper = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
  pointer-events: none;
`;
