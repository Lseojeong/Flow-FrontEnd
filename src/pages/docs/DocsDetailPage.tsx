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
import { EditIcon, DeleteIcon } from '@/assets/icons/common/index';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getAllDocsCategories, createDocsCategory } from '@/apis/docs/api';
import type { DocsCategory } from '@/apis/docs/types';
import { Department } from '@/components/common/department/Department.types';

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

export default function DocsPage() {
  const [activeMenuId, setActiveMenuId] = useState('docs');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
    description: string;
    departments: { departmentId: string; departmentName: string }[];
  } | null>(null);
  const departmentsData: Department[] = [];

  const [selectedCategory] = useState<{
    name: string;
    description: string;
    departments: { id: string }[];
  } | null>(null);

  const {
    data: categories,
    observerRef,
    isLoading,
    reset,
    loadMore,
  } = useInfiniteScroll<DocsCategory, HTMLTableRowElement>({
    fetchFn: async (cursor) => {
      const res = await getAllDocsCategories(cursor);

      type GetAllDocsCategoriesResponse = {
        code: string;
        message: string;
        result: {
          categoryList: DocsCategory[];
          pagination: { last: boolean };
          nextCursor?: string;
        };
      };

      const data = res.data as GetAllDocsCategoriesResponse;

      const categoryList: DocsCategory[] = (data.result?.categoryList ?? []).map(
        (c: DocsCategory) => ({
          ...c,
          lastModifiedDate: c.lastModifiedDate ?? (c.updatedAt ?? '').slice(0, 10),
        })
      );

      return {
        code: data.code,
        result: {
          historyList: categoryList,
          pagination: data.result?.pagination ?? { last: true },
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
      id: Number.NaN as unknown as number,
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
      (window as { showToast?: (_: string) => void }).showToast?.(
        '선택한 카테고리가 삭제되었습니다.'
      );
    }
  };

  const handleRegisterCategory = async (data: { name: string; description: string }) => {
    try {
      const res = await createDocsCategory({
        name: data.name,
        description: data.description,
        departmentIdList: [],
      });

      if (res.data.code === 'COMMON200') {
        (window as { showToast?: (_: string) => void }).showToast?.('카테고리가 등록되었습니다.');
        setIsCategoryModalOpen(false);
        reset();
        await loadMore();
      } else {
        (window as { showToast?: (_: string) => void }).showToast?.('등록에 실패했습니다.');
      }
    } catch (e) {
      console.error('카테고리 등록 에러:', e);
      (window as { showToast?: (_: string) => void }).showToast?.(
        '등록 요청 중 오류가 발생했습니다.'
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
        <td style={{ width: CELL_WIDTHS.CHECKBOX, textAlign: 'center' }}>
          <CheckBox
            size="medium"
            id={`check-${category.id}`}
            checked={isChecked}
            onChange={() => toggleCheckItem(category.id)}
            label=""
          />
        </td>
        <td style={{ width: CELL_WIDTHS.CATEGORY, textAlign: 'left' }}>
          <StyledLink to={`/docs/${category.id}`}>{category.name}</StyledLink>
        </td>
        <td style={{ width: CELL_WIDTHS.STATUS, textAlign: 'left' }}>
          <StatusWrapper>
            <StatusSummary
              items={[
                { type: 'Completed', count: category.status.completed },
                { type: 'Processing', count: category.status.processing },
                { type: 'Fail', count: category.status.fail },
              ]}
            />
          </StatusWrapper>
        </td>
        <td style={{ width: CELL_WIDTHS.DOCUMENT_COUNT, textAlign: 'center' }}>
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
        <td style={{ width: CELL_WIDTHS.LAST_MODIFIED, textAlign: 'left', paddingLeft: '34px' }}>
          {category.lastModifiedDate}
        </td>
        <td style={{ width: CELL_WIDTHS.ACTIONS, textAlign: 'center' }}>
          <EditIconWrapper>
            <EditIcon onClick={() => handleEdit(category.id)} />
          </EditIconWrapper>
        </td>
      </TableRow>
    );
  };

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
              }}
              onClick={handleDeleteSelected}
            />
            <CategorySearch
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <DateFilter startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
            <DepartmentSelect value={selectedDepartment} onChange={setSelectedDepartment} />
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
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} style={{ textAlign: 'center', padding: '80px 0' }}>
                      카테고리를 등록해주세요.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category, index) => renderTableRow(category, index))
                )}
                {isLoading && (
                  <tr>
                    <td colSpan={columns.length} style={{ textAlign: 'center', padding: '16px' }}>
                      불러오는 중...
                    </td>
                  </tr>
                )}
              </tbody>
            </TableScrollWrapper>
          </TableLayout>
        </ContentWrapper>
      </Content>

      <DocsCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleRegisterCategory}
        departments={departmentsData}
        existingCategoryNames={categories.map((c) => c.name)}
      />

      {editingCategory && (
        <DocsCategoryModalEdit
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={({ name, description }) => {
            console.log('카테고리 수정:', name, description);
            setIsEditModalOpen(false);
          }}
          initialName={editingCategory.name}
          initialDescription={selectedCategory?.description || ''}
          initialDepartments={selectedCategory?.departments?.map((d) => d.id) || []}
          departments={departmentsData}
        />
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 1158px;
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
