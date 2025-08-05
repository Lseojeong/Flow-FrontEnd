import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
import { dictMockData } from '@/pages/mock/dictMock';
import Divider from '@/components/common/divider/Divider';
import { colors, fontWeight } from '@/styles/index';
import DocsCategoryModal from '@/components/modal/category-modal/DocsCategoryModal';
import DocsCategoryModalEdit from '@/components/modal/category-edit-modal/DocsCategoryEditModal';
import { mockDepartments } from '@/pages/mock/mockDepartments';
import { EditIcon, DeleteIcon } from '@/assets/icons/common/index';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getPaginatedCategoriesData } from '@/pages/mock/dictMock';
import type { DictCategory } from '@/pages/mock/dictMock';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

export default function DocsPage() {
  const [activeMenuId, setActiveMenuId] = useState('docs');
  const {
    data: categories,
    observerRef,
    isLoading,
  } = useInfiniteScroll<DictCategory, HTMLTableRowElement>({
    fetchFn: getPaginatedCategoriesData,
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
    description: string;
    departments: { departmentId: string; departmentName: string }[];
  } | null>(null);

  const selectedCount = Object.values(checkedItems).filter(Boolean).length;
  const existingCategoryNames = dictMockData.map((item) => item.name);

  const isDateInRange = (dateStr: string) => {
    if (!startDate && !endDate) return true;
    const date = new Date(dateStr);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || date >= start) && (!end || date <= end);
  };

  const filteredCategories = categories.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesDept =
      !selectedDepartment || item.departments?.some((d) => d.departmentName === selectedDepartment);
    const matchesDate = isDateInRange(item.lastModifiedDate.replace(/\./g, '-'));
    return matchesName && matchesDept && matchesDate;
  });
  const toggleSelectAll = () => {
    const allSelected = selectedCount === categories.length;
    if (allSelected) {
      setCheckedItems({});
    } else {
      const newChecked: Record<number, boolean> = {};
      categories.forEach((cat) => {
        newChecked[cat.id] = true;
      });
      setCheckedItems(newChecked);
    }
  };

  const columns = [
    {
      label: (
        <CheckBox
          size="medium"
          variant="outline"
          id="select-all"
          checked={selectedCount === categories.length && categories.length > 0}
          onChange={toggleSelectAll}
          label=""
        />
      ),
      width: '48px',
      align: 'center' as const,
    },
    { label: '카테고리', width: '330px', align: 'left' as const },
    { label: '상태', width: '205px', align: 'left' as const },
    { label: '문서 수', width: '80px', align: 'center' as const },
    { label: '포함 부서', width: '220px', align: 'left' as const },
    { label: '최종 수정일', width: '160px', align: 'left' as const },
    { label: '', width: '40px', align: 'center' as const },
  ];

  const toggleCheckItem = (id: number) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (id: number) => {
    const category = dictMockData.find((cat) => cat.id === id);
    if (category) {
      setEditingCategory({
        id: category.id,
        name: category.name,
        description: category.description,
        departments: category.departments ?? [],
      });
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedCount > 0) {
      // TODO: 실제 삭제 로직 구현
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

  const handleRegisterCategory = ({
    name,
    description,
    departments,
  }: {
    name: string;
    description: string;
    departments: string[];
  }) => {
    console.log('카테고리 등록:', { name, description, departments });
  };

  const handleDateChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
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
          <PageTitle>사내 문서</PageTitle>
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
            <DepartmentSelect value={selectedDepartment} onChange={setSelectedDepartment} />
          </FilterBar>

          <CheckBox
            size="medium"
            variant="outline"
            id="select-all"
            checked={selectedCount === filteredCategories.length && filteredCategories.length > 0}
            onChange={toggleSelectAll}
            label="전체 선택"
          />

          <TableWrapper>
            <TableHeaderSection>
              <TableLayout>
                <thead>
                  <TableHeader columns={columns} />
                </thead>
              </TableLayout>
            </TableHeaderSection>

            <TableScrollWrapper>
              <TableLayout>
                <tbody>
                  {filteredCategories.length === 0 ? (
                    <EmptyRow>
                      <EmptyCell colSpan={columns.length}>
                        <EmptyMessage>카테고리를 등록해주세요.</EmptyMessage>
                      </EmptyCell>
                    </EmptyRow>
                  ) : (
                    filteredCategories.map((category, index) => {
                      const isChecked = !!checkedItems[category.id];
                      const isLast = index === filteredCategories.length - 1;

                      return (
                        <TableRow key={category.id} ref={isLast ? observerRef : undefined}>
                          <td style={{ width: '48px', textAlign: 'center' }}>
                            <CheckBox
                              size="medium"
                              id={`check-${category.id}`}
                              checked={isChecked}
                              onChange={() => toggleCheckItem(category.id)}
                              label=""
                            />
                          </td>
                          <td style={{ width: '300px', textAlign: 'left' }}>
                            <StyledLink to={`/docs/${category.id}`}>{category.name}</StyledLink>
                          </td>
                          <td style={{ width: '120px', textAlign: 'left' }}>
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
                          <td style={{ width: '80px', textAlign: 'center' }}>
                            {category.documentCount}
                          </td>
                          <ScrollableCell>
                            <DepartmentTagList departments={category.departments ?? []} />
                          </ScrollableCell>
                          <td style={{ width: '160px', textAlign: 'left' }}>
                            {category.lastModifiedDate}
                          </td>
                          <td style={{ width: '40px', textAlign: 'center' }}>
                            <EditIconWrapper>
                              <EditIcon onClick={() => handleEdit(category.id)} />
                            </EditIconWrapper>
                          </td>
                        </TableRow>
                      );
                    })
                  )}
                  {isLoading && (
                    <tr>
                      <td colSpan={columns.length} style={{ textAlign: 'center', padding: '16px' }}>
                        불러오는 중...
                      </td>
                    </tr>
                  )}
                </tbody>
              </TableLayout>
            </TableScrollWrapper>
          </TableWrapper>
        </ContentWrapper>
      </Content>

      <DocsCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleRegisterCategory}
        departments={mockDepartments}
        existingCategoryNames={existingCategoryNames}
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
          initialDescription={editingCategory.description}
          initialDepartments={editingCategory.departments.map((d) => d.departmentId)}
          departments={mockDepartments}
        />
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 1000px;
  overflow-x: auto;
`;

const SideBarWrapper = styled.div`
  flex-shrink: 0;
  width: 280px;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Content = styled.div`
  flex: 1;
  min-width: 1230px;
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

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
`;

const TableScrollWrapper = styled.div`
  max-height: 520px;
  overflow-y: auto;
`;

const TableHeaderSection = styled.div`
  background-color: ${colors.Normal};
  color: white;

  thead {
    tr {
      th {
        position: sticky;
        top: 0;
        background-color: ${colors.Normal};
        z-index: 2;
      }
    }
  }
`;

const EmptyMessage = styled.div`
  display: inline-block;
`;
