import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDebounce, DEBOUNCE_DELAY } from '@/hooks/useDebounce';
import { CategorySearch } from '@/components/common/category-search/CategorySearch';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import DepartmentSelect from '@/components/common/department/DepartmentSelect';
import { DepartmentTagList } from '@/components/common/department/DepartmentTagList';
import { CheckBox } from '@/components/common/checkbox/CheckBox';
import { TableLayout, TableHeader, TableRow, ScrollableCell } from '@/components/common/table';
import { Button } from '@/components/common/button/Button';
import SideBar from '@/components/common/layout/SideBar';
import StatusSummary from '@/components/common/status/StatusSummary';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import Divider from '@/components/common/divider/Divider';
import { colors, fontWeight } from '@/styles/index';
import DocsCategoryModal from '@/components/modal/category-modal/DocsCategoryModal';
import DocsCategoryModalEdit from '@/components/modal/category-edit-modal/DocsCategoryEditModal';
import { mockDepartments } from '@/pages/mock/mockDepartments';
import { EditIcon, DeleteIcon } from '@/assets/icons/common/index';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getAllDocsCategories, createDocsCategory, updateDocsCategory } from '@/apis/docs/api';
import { useDepartmentList } from '@/apis/department/query';
import type { DocsCategory } from '@/apis/docs/types';
import { useAuthStore } from '@/store/useAuthStore';
import { formatDate } from '@/utils/formatDate';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

const TABLE_COLUMNS = [
  { label: '카테고리', width: '330px', align: 'left' as const },
  { label: '상태', width: '205px', align: 'left' as const },
  { label: '문서 수', width: '80px', align: 'center' as const },
  { label: '포함 부서', width: '266px', align: 'left' as const },
  { label: '최종 수정일', width: '165px', align: 'left' as const },
  { label: '', width: '57px', align: 'center' as const },
];

const CELL_WIDTHS = {
  CHECKBOX: '48px',
  CATEGORY: '330px',
  STATUS: '206px',
  DOCUMENT_COUNT: '80px',
  DEPARTMENTS: '266px',
  LAST_MODIFIED: '165px',
  ACTIONS: '57px',
} as const;

type GetAllDocsCategoriesResponse = {
  code: string;
  message: string;
  result: {
    categoryList: DocsCategory[];
    pagination: { last: boolean };
    nextCursor?: string;
  };
};

export default function DocsPage() {
  const { profile } = useAuthStore();
  const isRootAdmin = profile?.permission === 'ROOT';
  const [activeMenuId, setActiveMenuId] = useState('docs');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    description: string;
    departments: { departmentId: string; departmentName: string }[];
  } | null>(null);

  const { data: departmentData } = useDepartmentList();
  const departments = departmentData?.result?.departmentList || mockDepartments;

  const {
    data: categories,
    observerRef,
    isLoading,
    refetch,
  } = useInfiniteScroll<DocsCategory & { timestamp: string }, HTMLTableRowElement>({
    queryKey: ['docs-categories'],
    fetchFn: async (cursor) => {
      const res = await getAllDocsCategories(cursor);
      const data = res.data as GetAllDocsCategoriesResponse;

      const categoryList: (DocsCategory & { timestamp: string })[] = (
        data.result?.categoryList ?? []
      ).map((c: DocsCategory) => ({
        ...c,
        lastModifiedDate: c.lastModifiedDate ?? (c.updatedAt ?? '').slice(0, 10),
        status: c.status ?? {
          Total: 0,
          Completed: 0,
          Processing: 0,
          Fail: 0,
        },
        timestamp: c.updatedAt ?? c.createdAt ?? '',
      }));

      return {
        code: data.code,
        result: {
          historyList: categoryList,
          pagination: { isLast: data.result?.pagination.last ?? true },
          nextCursor: data.result?.nextCursor,
        },
      };
    },
  });

  const debouncedSearchKeyword = useDebounce(searchKeyword, DEBOUNCE_DELAY);

  const filteredCategories = useMemo(() => {
    const isDateInRange = (dateStr: string) => {
      if (!startDate && !endDate) return true;
      const date = new Date(dateStr);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate + 'T23:59:59.999') : null;
      return (!start || date >= start) && (!end || date <= end);
    };

    return categories.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(debouncedSearchKeyword.toLowerCase());
      const matchesDept =
        !selectedDepartment || (item.departmentList ?? []).includes(selectedDepartment);
      const matchesDate = isDateInRange(item.lastModifiedDate.replace(/\./g, '-'));
      return matchesName && matchesDept && matchesDate;
    });
  }, [categories, debouncedSearchKeyword, selectedDepartment, startDate, endDate]);

  const selectedCount = filteredCategories.filter((cat) => checkedItems[cat.id]).length;
  const isAllSelected =
    selectedCount === filteredCategories.length && filteredCategories.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setCheckedItems({});
    } else {
      const newChecked: Record<string, boolean> = {};
      filteredCategories.forEach((cat) => {
        newChecked[cat.id] = true;
      });
      setCheckedItems(newChecked);
    }
  };

  const toggleCheckItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    if (!category) return;
    const departments =
      (category as { departmentList?: string[] }).departmentList?.map((name) => ({
        departmentId: name,
        departmentName: name,
      })) ?? [];

    setEditingCategory({
      id: category.id,
      name: category.name,
      description: category.description ?? '',
      departments,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedCount > 0) {
      console.log(
        '선택된 카테고리 삭제:',
        Object.keys(checkedItems).filter((key) => checkedItems[Number(key)])
      );
      setCheckedItems({});
      if ((window as { showToast?: (_message: string) => void }).showToast) {
        (window as { showToast?: (_message: string) => void }).showToast!(
          '선택한 카테고리가 삭제되었습니다.'
        );
      }
    }
  };

  const handleRegisterCategory = async (data: {
    name: string;
    description: string;
    departments?: string[];
  }) => {
    try {
      const res = await createDocsCategory({
        name: data.name,
        description: data.description,
        departmentIdList: data.departments ?? [],
      });

      if (!(res.status === 200 || res.data?.code === 'CATEGORY200' || res.data?.code === '200')) {
        throw new Error(res.data?.message || '카테고리 등록 실패');
      }

      (window as { showToast?: (_: string) => void }).showToast?.('카테고리가 등록되었습니다.');
      await refetch();
    } catch (e) {
      console.error('카테고리 등록 에러:', e);
      (window as { showErrorToast?: (_: string) => void }).showErrorToast?.(
        '등록 요청 중 오류가 발생했습니다.'
      );
    }
  };

  const handleUpdateCategory = async (data: {
    name: string;
    description: string;
    departments?: string[];
  }) => {
    if (!editingCategory) return;

    try {
      const res = await updateDocsCategory(editingCategory.id, {
        name: data.name,
        description: data.description,
        departmentIdList: data.departments ?? [],
      });

      const code = (res as { data?: { code?: string } }).data?.code;
      if (code === 'COMMON200') {
        (window as { showToast?: (_: string) => void }).showToast?.('카테고리가 수정되었습니다.');
        setIsEditModalOpen(false);
        setEditingCategory(null);
        await refetch();
      } else {
        throw new Error(res as unknown as string);
      }
    } catch (e) {
      console.error('카테고리 수정 에러:', e);
      (window as { showErrorToast?: (_: string) => void }).showErrorToast?.(
        '수정 요청 중 오류가 발생했습니다.'
      );
    }
  };

  const handleDateChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
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

  const renderTableRow = (
    category: DocsCategory & { departments?: { departmentId: string; departmentName: string }[] },
    index: number
  ) => {
    const isChecked = !!checkedItems[category.id];
    const isLast = index === filteredCategories.length - 1;

    return (
      <TableRow key={category.id} ref={isLast ? observerRef : undefined}>
        <td
          style={{
            width: CELL_WIDTHS.CHECKBOX,
            minWidth: CELL_WIDTHS.CHECKBOX,
            textAlign: 'center',
          }}
        >
          <CheckBox
            size="medium"
            id={`check-${category.id}`}
            checked={isChecked}
            onChange={() => toggleCheckItem(category.id)}
            label=""
          />
        </td>
        <td
          style={{ width: CELL_WIDTHS.CATEGORY, minWidth: CELL_WIDTHS.CATEGORY, textAlign: 'left' }}
        >
          <StyledLink to={`/docs/${category.id}`}>{category.name}</StyledLink>
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
        <ScrollableCell
          width={CELL_WIDTHS.DEPARTMENTS}
          maxWidth={CELL_WIDTHS.DEPARTMENTS}
          align="left"
        >
          <DepartmentTagList
            departments={
              (category as { departmentList?: string[] }).departmentList?.map((name) => ({
                departmentId: name,
                departmentName: name,
              })) ?? []
            }
          />
        </ScrollableCell>
        <td
          style={{
            width: CELL_WIDTHS.LAST_MODIFIED,
            minWidth: CELL_WIDTHS.LAST_MODIFIED,
            textAlign: 'left',
          }}
        >
          {formatDate(category.lastModifiedDate)}
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

  const renderLoadingState = () => (
    <tr>
      <td colSpan={columns.length} style={{ textAlign: 'center', padding: '16px' }}>
        불러오는 중...
      </td>
    </tr>
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
          <PageTitle>사내 문서 관리</PageTitle>
          <Description>Flow에서 사용되는 사내문서 데이터를 관리하는 어드민입니다.</Description>
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
            {isRootAdmin && (
              <DepartmentSelect
                value={selectedDepartment ?? ''}
                onChange={(id) => setSelectedDepartment(id ?? null)}
              />
            )}
          </FilterBar>

          <CheckBox
            size="medium"
            variant="outline"
            id="select-all"
            checked={isAllSelected}
            onChange={toggleSelectAll}
            label=""
          />

          <TableLayout>
            <thead>
              <TableHeader columns={columns} />
            </thead>
            <TableScrollWrapper>
              <tbody>
                {filteredCategories.length === 0
                  ? renderEmptyState()
                  : filteredCategories.map((category, index) => renderTableRow(category, index))}
                {isLoading && renderLoadingState()}
              </tbody>
            </TableScrollWrapper>
          </TableLayout>
        </ContentWrapper>
      </Content>

      <DocsCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleRegisterCategory}
        onSuccess={() => setIsCategoryModalOpen(false)}
        departments={departments}
      />

      {editingCategory && (
        <DocsCategoryModalEdit
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateCategory}
          initialName={editingCategory.name}
          initialDescription={editingCategory.description}
          initialDepartments={editingCategory.departments.map((d) => d.departmentId)}
          departments={departments}
        />
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

const ContentWrapper = styled.div`
  max-width: 1158px;
  margin: 0 auto;
  width: 100%;
`;

const Content = styled.div`
  flex: 1;
  min-width: 1158px;
  padding: 0 36px;
`;

const PageTitle = styled.h1`
  font-size: 40px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Normal};
  margin-bottom: 12px;
  margin-top: 80px;
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
  margin: 0 0 5px 20px;
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
