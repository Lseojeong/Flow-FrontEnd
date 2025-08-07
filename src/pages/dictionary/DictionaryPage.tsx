import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { CategorySearch } from '@/components/common/category-search/CategorySearch';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import { CheckBox } from '@/components/common/checkbox/CheckBox';
import { TableLayout, TableHeader, TableRow } from '@/components/common/table';
import { Button } from '@/components/common/button/Button';
import SideBar from '@/components/common/layout/SideBar';
import StatusSummary from '@/components/common/status/StatusSummary';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { dictMockData } from '@/pages/mock/dictMock';
import { DeleteIcon, EditIcon } from '@/assets/icons/common/index';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/Divider';
import DictCategoryModal from '@/components/modal/category-modal/DictCategoryModal';
import DictCategoryModalEdit from '@/components/modal/category-edit-modal/DictCategoryEditModal';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getPaginatedCategoriesData } from '@/pages/mock/dictMock';
import type { DictCategory } from '@/pages/mock/dictMock';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

const TABLE_COLUMNS = [
  { label: '카테고리', width: '604px', align: 'left' as const },
  { label: '상태', width: '204px', align: 'left' as const },
  { label: '문서 수', width: '80px', align: 'center' as const },
  { label: '최종 수정일', width: '160px', align: 'left' as const },
  { label: '', width: '57px', align: 'center' as const },
];

const CELL_WIDTHS = {
  CHECKBOX: '48px',
  CATEGORY: '604px',
  STATUS: '204px',
  DOCUMENT_COUNT: '80px',
  LAST_MODIFIED: '160px',
  ACTIONS: '57px',
} as const;

export default function DictionaryPage() {
  const [activeMenuId, setActiveMenuId] = useState('dictionary');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
    description: string;
  } | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const {
    data: categories,
    observerRef,
    isLoading,
  } = useInfiniteScroll<DictCategory, HTMLTableRowElement>({
    fetchFn: getPaginatedCategoriesData,
  });

  const existingCategoryNames = dictMockData.map((item) => item.name);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [categories, searchKeyword]);

  const selectedCount = filteredCategories.filter((cat) => checkedItems[cat.id]).length;
  const isAllSelected =
    selectedCount === filteredCategories.length && filteredCategories.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setCheckedItems({});
    } else {
      const newChecked: Record<number, boolean> = {};
      filteredCategories.forEach((cat) => {
        newChecked[cat.id] = true;
      });
      setCheckedItems(newChecked);
    }
  };

  const toggleCheckItem = (id: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEdit = (id: number) => {
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      setEditingCategory({
        id: category.id,
        name: category.name,
        description: category.description,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleDateChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleRegisterCategory = () => {
    if ((window as { showToast?: (_message: string) => void }).showToast) {
      (window as { showToast?: (_message: string) => void }).showToast!(
        '카테고리가 등록되었습니다.'
      );
    }
  };

  const handleDeleteSelected = () => {
    if (selectedCount === 0) return;
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

  const renderTableRow = (category: DictCategory, index: number) => {
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
          <StyledLink to={`/dictionary/${category.id}`}>{category.name}</StyledLink>
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
        <td style={{ width: CELL_WIDTHS.LAST_MODIFIED, textAlign: 'left' }}>
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
                {filteredCategories.length === 0
                  ? renderEmptyState()
                  : filteredCategories.map((category, index) => renderTableRow(category, index))}
                {isLoading && renderLoadingState()}
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
          onSubmit={() => {
            if ((window as { showToast?: (_message: string) => void }).showToast) {
              (window as { showToast?: (_message: string) => void }).showToast!(
                '카테고리가 수정되었습니다.'
              );
            }
            setIsEditModalOpen(false);
          }}
          initialName={editingCategory.name}
          initialDescription={editingCategory.description}
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

const Content = styled.div`
  flex: 1;
  min-width: 1230px;
  padding: 0 36px;
  background-color: ${colors.background};
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
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
  height: 200px;
`;

const EmptyCell = styled.td<{ colSpan: number }>`
  text-align: center;
  vertical-align: middle;
  color: ${colors.BoxText};
  font-size: 14px;
  padding: 80px 0;
`;

const EmptyMessage = styled.div`
  display: inline-block;
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
  td {
    padding-top: 24px;
    padding-bottom: 24px;
  }
`;
