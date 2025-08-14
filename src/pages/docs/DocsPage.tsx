import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import SideBar from '@/components/common/layout/SideBar';
import { CategorySearch } from '@/components/common/category-search/CategorySearch';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import DepartmentSelect from '@/components/common/department/DepartmentSelect';
import { DepartmentTagList } from '@/components/common/department/DepartmentTagList';
import { CheckBox } from '@/components/common/checkbox/CheckBox';
import { TableLayout, TableHeader, TableRow, ScrollableCell } from '@/components/common/table';
import { Button } from '@/components/common/button/Button';
import { Loading } from '@/components/common/loading/Loading';
import StatusSummary from '@/components/common/status/StatusSummary';
import Divider from '@/components/common/divider/Divider';

import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { EditIcon, DeleteIcon } from '@/assets/icons/common';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDebounce, DEBOUNCE_DELAY } from '@/hooks/useDebounce';
import { useDepartmentList } from '@/apis/department/query';
import {
  getAllDocsCategories,
  createDocsCategory,
  updateDocsCategory,
  deleteDocsCategories,
  searchDocsCategories,
} from '@/apis/docs/api';

import type { DocsCategory } from '@/apis/docs/types';
import { useAuthStore } from '@/store/useAuthStore';
import { colors, fontWeight } from '@/styles';
import DocsCategoryModal from '@/components/modal/category-modal/DocsCategoryModal';
import DocsCategoryModalEdit from '@/components/modal/category-edit-modal/DocsCategoryEditModal';
import { mockDepartments } from '@/pages/mock/mockDepartments';
import { formatDate, convertDepartmentNamesToIds } from '@/utils';
import { Popup } from '@/components/common/popup/Popup';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

const TABLE_COLUMNS = [
  { label: '카테고리', width: '330px', align: 'left' as const, key: 'name' },
  { label: '상태', width: '206px', align: 'left' as const, key: 'status' },
  { label: '문서 수', width: '80px', align: 'center' as const, key: 'documentCount' },
  { label: '포함 부서', width: '266px', align: 'left' as const, key: 'departments' },
  { label: '최종 수정일', width: '165px', align: 'left' as const, key: 'lastModifiedDate' },
  { label: '', width: '57px', align: 'center' as const, key: 'actions' },
] as const;

type GetAllDocsCategoriesResponse = {
  code: string;
  message: string;
  result: { categoryList: DocsCategory[]; pagination: { last: boolean }; nextCursor?: string };
};

type RowCategory = DocsCategory & {
  timestamp: string;
  lastModifiedDate: string;
  status: NonNullable<DocsCategory['status']>;
};

const normalizeCategory = (c: DocsCategory): RowCategory => ({
  ...c,
  lastModifiedDate: c.lastModifiedDate ?? (c.updatedAt ?? '').slice(0, 10),
  status: c.status ?? { Total: 0, Completed: 0, Processing: 0, Fail: 0 },
  timestamp: c.updatedAt ?? c.createdAt ?? '',
});

export default function DocsPage() {
  const { profile } = useAuthStore();
  const isRootAdmin = profile?.permission === 'ROOT';

  const [activeMenuId, setActiveMenuId] = useState('docs');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    description: string;
    departmentList: string[];
  } | null>(null);

  const { data: departmentData } = useDepartmentList();
  const departments = departmentData?.result?.departmentList || mockDepartments;

  const debouncedSearchKeyword = useDebounce(searchKeyword, DEBOUNCE_DELAY);
  const debouncedDepartment = useDebounce(selectedDepartment ?? '', DEBOUNCE_DELAY);
  const debouncedStartDate = useDebounce(startDate ?? '', DEBOUNCE_DELAY);
  const debouncedEndDate = useDebounce(endDate ?? '', DEBOUNCE_DELAY);
  const isSearching =
    !!debouncedSearchKeyword || !!debouncedStartDate || !!debouncedEndDate || !!debouncedDepartment;

  const {
    data: categoriesRaw = [],
    observerRef,
    isLoading,
    refetch,
  } = useInfiniteScroll<RowCategory, HTMLTableRowElement>({
    queryKey: [
      'docs-categories',
      debouncedSearchKeyword,
      debouncedStartDate,
      debouncedEndDate,
      debouncedDepartment,
    ],
    fetchFn: async (cursor) => {
      if (isSearching) {
        const searchParams = {
          name: debouncedSearchKeyword || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          cursorDate: cursor || new Date().toISOString(),
          departmentId: selectedDepartment || undefined,
        };

        const res = await searchDocsCategories(searchParams);
        const data = res.data as GetAllDocsCategoriesResponse;

        const categoryList: RowCategory[] = (data.result?.categoryList ?? []).map(
          normalizeCategory
        );

        return {
          code: data.code,
          result: {
            historyList: categoryList,
            pagination: { isLast: data.result?.pagination.last ?? true },
            nextCursor: data.result?.nextCursor,
          },
        };
      }

      const res = await getAllDocsCategories(cursor);
      const data = res.data as GetAllDocsCategoriesResponse;

      const categoryList: RowCategory[] = (data.result?.categoryList ?? []).map(normalizeCategory);

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

  const categories = categoriesRaw;

  const filtered = useMemo(() => {
    return categories;
  }, [categories]);

  const selectedIds = useMemo(
    () => filtered.filter((c) => checkedMap[c.id]).map((c) => c.id),
    [filtered, checkedMap]
  );
  const isAllSelected = filtered.length > 0 && selectedIds.length === filtered.length;

  const handleToggleAll = useCallback(() => {
    if (isAllSelected) {
      setCheckedMap({});
      return;
    }
    const next: Record<string, boolean> = {};
    filtered.forEach((c) => {
      next[c.id] = true;
    });
    setCheckedMap(next);
  }, [filtered, isAllSelected]);

  const handleToggleOne = useCallback((id: string) => {
    setCheckedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleDateChange = useCallback((start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const handleEditOpen = useCallback(
    (id: string) => {
      const category = categories.find((c) => c.id === id);
      if (!category) return;

      const departmentList =
        (category as unknown as { departmentList?: string[] }).departmentList ?? [];
      const departmentIds = convertDepartmentNamesToIds(departmentList, departments);

      setEditingCategory({
        id: category.id,
        name: category.name,
        description: category.description ?? '',
        departmentList: departmentIds,
      });
      setIsEditModalOpen(true);
    },
    [categories, departments]
  );

  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) {
      (window as { showToast?: (_message: string) => void }).showToast?.(
        '삭제할 카테고리를 선택하세요.'
      );
      return;
    }
    setIsDeletePopupOpen(true);
  }, [selectedIds]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      const res = await deleteDocsCategories({ categoryIdList: selectedIds });
      const code = (res as { data?: { code?: string } }).data?.code;
      if (code === 'COMMON200') {
        (window as { showToast?: (_message: string) => void }).showToast?.(
          '선택한 카테고리가 삭제되었습니다.'
        );
        setCheckedMap({});
        await refetch();
        return;
      }
      throw new Error((res as { data?: { message?: string } })?.data?.message || '삭제 실패');
    } catch (error) {
      let errorMessage = '삭제 요청 중 오류가 발생했습니다.';

      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      (window as { showErrorToast?: (_message: string) => void }).showErrorToast?.(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeletePopupOpen(false);
    }
  }, [selectedIds, refetch]);

  const handleRegisterCategory = useCallback(
    async (data: { name: string; description: string; departments?: string[] }) => {
      const res = await createDocsCategory({
        name: data.name,
        description: data.description,
        departmentIdList: data.departments ?? [],
      });
      if (!(res.data?.code === 'COMMON200')) {
        throw new Error(res.data?.message || '카테고리 등록 실패');
      }

      (window as { showToast?: (_message: string) => void }).showToast?.(
        '카테고리가 등록되었습니다.'
      );
      setIsCategoryModalOpen(false);
      await refetch();
    },
    [refetch]
  );

  const handleUpdateCategory = useCallback(
    async (data: { name: string; description: string; departments: string[] }) => {
      if (!editingCategory) return;
      try {
        const requestBody = {
          name: data.name.trim(),
          description: data.description.trim(),
          departmentIdList: data.departments,
        };
        const res = await updateDocsCategory(editingCategory.id, requestBody);
        const code = (res as { data?: { code?: string } }).data?.code;
        if (code === 'COMMON200' || code === '200') {
          (window as { showToast?: (_message: string) => void }).showToast?.(
            '카테고리가 수정되었습니다.'
          );
          setIsEditModalOpen(false);
          setEditingCategory(null);
          await refetch();
          return;
        }
        throw new Error((res as { data?: { message?: string } })?.data?.message || '수정 실패');
      } catch (error) {
        let errorMessage = '수정 요청 중 오류가 발생했습니다.';

        if (error && typeof error === 'object' && 'response' in error) {
          const response = (error as { response?: { data?: { message?: string } } }).response;
          if (response?.data?.message) {
            errorMessage = response.data.message;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        (window as { showErrorToast?: (_message: string) => void }).showErrorToast?.(errorMessage);
      }
    },
    [editingCategory, refetch]
  );

  const headerColumns = useMemo(
    () => [
      {
        label: (
          <CheckBox
            size="medium"
            variant="outline"
            id="select-all"
            checked={isAllSelected}
            onChange={handleToggleAll}
            label=""
          />
        ),
        width: '48px',
        align: 'center' as const,
        key: '__checkbox',
      },
      ...TABLE_COLUMNS,
    ],
    [isAllSelected, handleToggleAll]
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
        <ContentInner>
          <PageTitle>사내 문서 관리</PageTitle>
          <Description>Flow에서 사용되는 사내문서 데이터를 관리하는 어드민입니다.</Description>
          <Divider />

          <TopBar>
            <Button size="small" onClick={() => setIsCategoryModalOpen(true)}>
              + 카테고리 등록
            </Button>
          </TopBar>

          <FilterBar
            selectedCount={selectedIds.length}
            isRootAdmin={isRootAdmin}
            searchKeyword={searchKeyword}
            onChangeKeyword={setSearchKeyword}
            onDelete={handleDeleteSelected}
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            selectedDepartment={selectedDepartment}
            onChangeDepartment={setSelectedDepartment}
            departments={departments}
          />

          <TableLayout>
            <thead>
              <TableHeader columns={headerColumns} />
            </thead>
            <tbody>
              <tr>
                <td colSpan={headerColumns.length} style={{ padding: 0 }}>
                  <TableScrollWrapper>
                    {isLoading ? (
                      <LoadingWrapper>
                        <Loading size={32} color="#555" />
                        <span style={{ fontSize: '14px', color: '#555' }}>
                          사내문서 카테고리 불러오는 중...
                        </span>
                      </LoadingWrapper>
                    ) : filtered.length === 0 ? (
                      <EmptyRow>
                        <EmptyCell colSpan={headerColumns.length}>
                          <EmptyMessage>등록된 카테고리가 없습니다.</EmptyMessage>
                        </EmptyCell>
                      </EmptyRow>
                    ) : (
                      filtered.map((category, index) => {
                        const isLast = index === filtered.length - 1;
                        return (
                          <DocsRow
                            key={category.id}
                            category={category}
                            checked={!!checkedMap[category.id]}
                            onToggle={() => handleToggleOne(category.id)}
                            onEdit={() => handleEditOpen(category.id)}
                            observerRef={isLast ? observerRef : undefined}
                          />
                        );
                      })
                    )}
                  </TableScrollWrapper>
                </td>
              </tr>
            </tbody>
          </TableLayout>
        </ContentInner>
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
          initialDepartments={editingCategory.departmentList || []}
          departments={departments}
        />
      )}
      <Popup
        isOpen={isDeletePopupOpen}
        title="카테고리 삭제"
        message="카테고리를 삭제하시겠습니까?"
        warningMessages={['카테고리와 포함된 모든 파일이 함께 삭제됩니다.']}
        onClose={() => setIsDeletePopupOpen(false)}
        onDelete={handleConfirmDelete}
        disabled={isDeleting}
        confirmText={isDeleting ? '삭제 중...' : '삭제'}
      />
    </PageWrapper>
  );
}

type FilterBarProps = {
  selectedCount: number;
  isRootAdmin?: boolean;
  searchKeyword: string;
  onChangeKeyword: (_v: string) => void;
  onDelete: () => void;
  startDate: string | null;
  endDate: string | null;
  onDateChange: (_start: string | null, _end: string | null) => void;
  selectedDepartment: string | null;
  onChangeDepartment: (_id: string | null) => void;
  departments: { departmentId: string; departmentName: string }[];
};

const FilterBar: React.FC<FilterBarProps> = ({
  selectedCount,
  isRootAdmin,
  searchKeyword,
  onChangeKeyword,
  onDelete,
  startDate,
  endDate,
  onDateChange,
  selectedDepartment,
  onChangeDepartment,
  departments,
}) => {
  return (
    <FilterBarBox>
      <DeleteIcon
        style={{
          cursor: selectedCount > 0 ? 'pointer' : 'default',
          color: selectedCount > 0 ? colors.Normal : colors.BoxText,
          pointerEvents: selectedCount > 0 ? 'auto' : 'none',
          marginRight: 6,
          width: 24,
          height: 24,
        }}
        onClick={onDelete}
      />
      <CategorySearch value={searchKeyword} onChange={(e) => onChangeKeyword(e.target.value)} />
      <DateFilter startDate={startDate} endDate={endDate} onDateChange={onDateChange} />
      {isRootAdmin && (
        <DepartmentSelect
          options={departments.map((dept) => ({
            departmentId: dept.departmentId,
            departmentName: dept.departmentName,
          }))}
          value={selectedDepartment}
          onChange={(id) => {
            onChangeDepartment(id);
          }}
          showAllOption={true}
          placeholder=""
        />
      )}
    </FilterBarBox>
  );
};

type DocsRowProps = {
  category: RowCategory & { departments?: { departmentId: string; departmentName: string }[] };
  checked: boolean;
  onToggle: () => void;
  onEdit: () => void;
  observerRef?: React.RefObject<HTMLTableRowElement | null>;
};

const DocsRow: React.FC<DocsRowProps> = ({ category, checked, onToggle, onEdit, observerRef }) => {
  const deptTags =
    (category as unknown as { departmentList?: string[] }).departmentList?.map((name) => ({
      departmentId: name,
      departmentName: name,
    })) ?? [];

  return (
    <TableRow ref={observerRef}>
      <Cell w={48} align="center">
        <CheckBox
          size="medium"
          id={`check-${category.id}`}
          checked={checked}
          onChange={onToggle}
          label=""
        />
      </Cell>

      <Cell w={330} align="left">
        <StyledLink to={`/docs/${category.id}`}>{category.name}</StyledLink>
      </Cell>

      <Cell w={206} align="left">
        <StatusWrapper>
          <StatusSummary
            items={[
              { type: 'Completed', count: category.status.Completed },
              { type: 'Processing', count: category.status.Processing },
              { type: 'Fail', count: category.status.Fail },
            ]}
          />
        </StatusWrapper>
      </Cell>

      <Cell w={80} align="center">
        {category.documentCount}
      </Cell>

      <ScrollableCell width={`${266}px`} maxWidth={`${266}px`} align="left">
        <DepartmentTagList departments={deptTags} />
      </ScrollableCell>

      <Cell w={165} align="left">
        {formatDate(category.lastModifiedDate)}
      </Cell>

      <Cell w={57} align="center">
        <EditIconWrapper>
          <EditIcon onClick={onEdit} />
        </EditIconWrapper>
      </Cell>
    </TableRow>
  );
};

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
`;

const ContentInner = styled.div`
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

const Description = styled.p`
  font-size: 16px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FilterBarBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 24px 20px;
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
  height: 400px;
  text-align: center;
  color: ${colors.BoxText};
  font-size: 14px;
  transform: translateX(500px);
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 450px);
  gap: 8px;
  transform: translateX(50px);
`;

const Cell = styled.td<{ w: number; align: 'left' | 'center' | 'right' }>`
  width: ${({ w }) => `${w}px`};
  min-width: ${({ w }) => `${w}px`};
  text-align: ${({ align }) => align};
`;
