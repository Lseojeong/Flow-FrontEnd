import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
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
import FaqCategoryModal from '@/components/modal/category-modal/FaqCategoryModal';
import FaqCategoryModalEdit from '@/components/modal/category-edit-modal/FaqCategoryEditModal';
import { EditIcon, DeleteIcon } from '@/assets/icons/common/index';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Department } from '@/components/common/department/Department.types';
import { getDepartments } from '@/apis/org/api';
import {
  getAllFaqCategories,
  createFaqCategory,
  deleteFaqCategories,
  searchFaqCategories,
  updateFaqCategory,
} from '@/apis/faq/api';
import type { FaqCategory } from '@/apis/faq/types';

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

export default function FaqPage() {
  const [activeMenuId, setActiveMenuId] = useState('faq');
  const { profile } = useAuthStore();
  const isRootAdmin = profile?.permission === 'ROOT';
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    description: string;
    departments: { departmentId: string; departmentName: string }[];
  } | null>(null);

  const debouncedSearchKeyword = useDebounce(searchKeyword, DEBOUNCE_DELAY);
  const debouncedDepartment = useDebounce(selectedDepartment ?? '', DEBOUNCE_DELAY);
  const debouncedStartDate = useDebounce(startDate ?? '', DEBOUNCE_DELAY);
  const debouncedEndDate = useDebounce(endDate ?? '', DEBOUNCE_DELAY);
  const isSearching =
    !!debouncedSearchKeyword || !!debouncedStartDate || !!debouncedEndDate || !!debouncedDepartment;

  const {
    data: categories,
    observerRef,
    isLoading,
    reset,
  } = useInfiniteScroll<FaqCategory & { timestamp: string }, HTMLTableRowElement>({
    queryKey: [
      'faq-categories',
      debouncedSearchKeyword,
      debouncedStartDate,
      debouncedEndDate,
      debouncedDepartment,
    ],
    fetchFn: async (cursor) => {
      const normalizeStatus = (item: FaqCategory): FaqCategory['fileStatus'] =>
        item.fileStatus ?? { total: 0, completed: 0, processing: 0, fail: 0 };

      const normalizeDate = (c: FaqCategory): string =>
        (c.lastModifiedDate ?? c.updatedAt ?? c.createdAt ?? '').slice(0, 10);

      const mapWithTimestamp = (list: FaqCategory[]) =>
        list.map((c) => ({
          ...c,
          status: normalizeStatus(c),
          lastModifiedDate: normalizeDate(c),
          timestamp: c.updatedAt ?? c.createdAt ?? '',
        }));

      if (isSearching) {
        const searchParams = {
          name: debouncedSearchKeyword || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          cursorDate: cursor || undefined,
          departmentId: selectedDepartment || undefined,
        };

        const res = await searchFaqCategories(searchParams);

        return {
          code: res.data.code,
          result: {
            historyList: mapWithTimestamp(res.data.result?.categoryList ?? []),
            pagination: res.data.result?.pagination ?? { last: true },
            nextCursor: res.data.result?.nextCursor,
          },
        };
      }

      const res = await getAllFaqCategories(cursor);
      return {
        code: res.data.code,
        result: {
          historyList: mapWithTimestamp(res.data.result?.categoryList ?? []),
          pagination: res.data.result?.pagination ?? { last: true },
          nextCursor: res.data.result?.nextCursor,
        },
      };
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getDepartments();
        setDepartments(res.data.result.departmentList as unknown as Department[]);
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          '부서 목록 조회에 실패했습니다.';

        if (
          typeof window !== 'undefined' &&
          'showErrorToast' in window &&
          typeof window.showErrorToast === 'function'
        ) {
          window.showErrorToast(errorMessage);
        }
      }
    })();
  }, []);

  const existingCategoryNames = useMemo(() => categories.map((c) => c.name), [categories]);

  const filteredCategories = useMemo(() => {
    const isDateInRange = (dateStr: string) => {
      if (!startDate && !endDate) return true;
      if (!dateStr) return false;
      const date = new Date(dateStr);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (!start || date >= start) && (!end || date <= end);
    };

    const normDate = (c: FaqCategory) =>
      ((c.lastModifiedDate || c.updatedAt || c.createdAt || '') + '').replace(/\./g, '-');

    return categories.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(debouncedSearchKeyword.toLowerCase());
      const matchesDept =
        !selectedDepartment || (item.departmentList ?? []).includes(selectedDepartment);
      const matchesDate = isDateInRange(normDate(item));
      return matchesName && matchesDept && matchesDate;
    });
  }, [categories, debouncedSearchKeyword, selectedDepartment, startDate, endDate]);

  const selectedCount = filteredCategories.filter((cat) => !!checkedItems[cat.id]).length;
  const isAllSelected =
    selectedCount === filteredCategories.length && filteredCategories.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setCheckedItems({});
    } else {
      const next: Record<string, boolean> = {};
      filteredCategories.forEach((cat) => {
        next[cat.id] = true;
      });
      setCheckedItems(next);
    }
  };

  const toggleCheckItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    if (!category) return;

    const selectedDeptIds: string[] = category.departmentList ?? [];
    const selectedDepartments: Department[] = departments.filter((dept) =>
      selectedDeptIds.includes(dept.departmentId)
    );

    setEditingCategory({
      id: category.id,
      name: category.name,
      description: category.description ?? '',
      departments: selectedDepartments,
    });

    setIsEditModalOpen(true);
  };

  const handleDeleteSelected = async () => {
    const selectedIds = Object.keys(checkedItems).filter((id) => checkedItems[id]);
    if (selectedIds.length === 0) {
      (window as { showToast?: (_: string) => void }).showToast!('삭제할 카테고리를 선택하세요.');
      return;
    }

    try {
      const res = await deleteFaqCategories(selectedIds);
      const ok = res.data?.code === 'COMMON200';

      if (ok) {
        (window as { showToast?: (_: string) => void }).showToast!(
          '선택한 카테고리를 삭제했습니다.'
        );
        setCheckedItems({});
        reset();
      } else {
        const errorMessage = (res.data as { message?: string })?.message || '삭제에 실패했습니다.';

        if (
          typeof window !== 'undefined' &&
          'showErrorToast' in window &&
          typeof window.showErrorToast === 'function'
        ) {
          window.showErrorToast(errorMessage);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '삭제 요청 중 에러가 발생했습니다.';

      if (
        typeof window !== 'undefined' &&
        'showErrorToast' in window &&
        typeof window.showErrorToast === 'function'
      ) {
        window.showErrorToast(errorMessage);
      }
    }
  };

  const handleRegisterCategory = async (form: {
    name: string;
    description?: string;
    departments: string[] | { departmentId: string }[];
  }) => {
    try {
      if (existingCategoryNames.includes(form.name.trim())) {
        const errorMessage = '이미 존재하는 카테고리명입니다.';

        if (
          typeof window !== 'undefined' &&
          'showErrorToast' in window &&
          typeof window.showErrorToast === 'function'
        ) {
          window.showErrorToast(errorMessage);
        }
        return;
      }

      const depIds =
        Array.isArray(form.departments) &&
        form.departments.length > 0 &&
        typeof form.departments[0] === 'object'
          ? (form.departments as { departmentId: string }[]).map((d) => d.departmentId)
          : (form.departments as string[]);

      const payload = {
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
        departmentList: depIds.map((id) => ({ id })),
      };

      const res = await createFaqCategory(payload);

      const ok = res.data?.code === 'COMMON200';

      if (ok) {
        (window as { showToast?: (_message: string) => void }).showToast!(
          '카테고리가 등록되었습니다.'
        );
        setIsCategoryModalOpen(false);
        if (typeof reset === 'function') {
          await reset();
        }
      } else {
        const errorMessage =
          (res.data as { message?: string })?.message || '카테고리 등록에 실패했습니다.';

        if (
          typeof window !== 'undefined' &&
          'showErrorToast' in window &&
          typeof window.showErrorToast === 'function'
        ) {
          window.showErrorToast(errorMessage);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '카테고리 등록 중 오류가 발생했습니다.';

      if (
        typeof window !== 'undefined' &&
        'showErrorToast' in window &&
        typeof window.showErrorToast === 'function'
      ) {
        window.showErrorToast(errorMessage);
      }
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

  const renderTableRow = (category: FaqCategory, index: number) => {
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
          <StyledLink to={`/faq/${category.id}`}>{category.name}</StyledLink>
        </td>
        <td style={{ width: CELL_WIDTHS.STATUS, minWidth: CELL_WIDTHS.STATUS, textAlign: 'left' }}>
          <StatusWrapper>
            <StatusSummary
              items={[
                { type: 'Completed', count: category.fileStatus.Completed },
                { type: 'Processing', count: category.fileStatus.Processing },
                { type: 'Fail', count: category.fileStatus.Fail },
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
            paddingLeft: ' 34px',
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
          <PageTitle>FAQ 관리</PageTitle>
          <Description>자주 묻는 질문의 데이터를 Flow에 등록, 관리하는 어드민입니다.</Description>
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
                options={departments.map((dept) => ({
                  departmentId: dept.departmentId,
                  departmentName: dept.departmentName,
                }))}
                value={selectedDepartment ?? ''}
                onChange={(id) => setSelectedDepartment(id ?? null)}
                showAllOption={true}
              />
            )}
          </FilterBar>

          <CheckBox
            size="medium"
            variant="outline"
            id="select-all"
            checked={isAllSelected}
            onChange={toggleSelectAll}
            label="전체 선택"
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

      <FaqCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleRegisterCategory}
        departments={departments}
        existingCategoryNames={existingCategoryNames}
      />

      {editingCategory && (
        <FaqCategoryModalEdit
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={async (form) => {
            try {
              const depIds: string[] = Array.isArray(form.departments)
                ? form.departments.map((d) => {
                    if (typeof d === 'object' && d !== null && 'departmentId' in d) {
                      return (d as { departmentId: string }).departmentId;
                    }
                    return d as string;
                  })
                : [];
              await updateFaqCategory(editingCategory.id, {
                name: form.name.trim(),
                description: form.description?.trim() || undefined,
                departmentList: depIds.map((id) => ({ id })),
              });

              (window as { showToast?: (_: string) => void }).showToast?.(
                '카테고리가 수정되었습니다.'
              );
              setIsEditModalOpen(false);
              setEditingCategory(null);
              await reset();
            } catch (error: unknown) {
              const errorMessage =
                (error as { response?: { data?: { message?: string } } })?.response?.data
                  ?.message || '카테고리 수정에 실패했습니다.';

              if (
                typeof window !== 'undefined' &&
                'showErrorToast' in window &&
                typeof window.showErrorToast === 'function'
              ) {
                window.showErrorToast(errorMessage);
              }
            }
          }}
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

const Content = styled.div`
  flex: 1;
  min-width: 1158px;
  padding: 0 36px;
  background-color: ${colors.background};
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

const ContentWrapper = styled.div`
  max-width: 1158px;
  margin: 0 auto;
  width: 100%;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 5px 20px;
`;
const EmptyRow = styled.tr`
  height: 200px;
`;

const EmptyCell = styled.td<{ colSpan: number }>`
  text-align: center;
  vertical-align: middle;
  color: ${colors.BoxText};
  font-size: 14px;
  padding: 80px 0;
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

const EmptyMessage = styled.div`
  display: inline-block;
`;
