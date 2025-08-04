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
import { Popup } from '@/components/common/popup/Popup';
import DocsCategoryModal from '@/components/common/modal/DocsCategoryModal';
import DocsCategoryModalEdit from '@/components/common/modal/DocsCategoryModalEdit';
import { mockDepartments } from '@/pages/mock/mockDepartments';
import EditIcon from '@/assets/icons/common/edit.svg?react';
import DeleteIcon from '@/assets/icons/common/delete.svg?react';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

export default function FaqPage() {
  const [activeMenuId, setActiveMenuId] = useState('faq');
  const [categories] = useState(dictMockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
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

  const filteredCategories = dictMockData.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesDept =
      !selectedDepartment || item.departments?.some((d) => d.departmentName === selectedDepartment);
    const matchesDate = isDateInRange(item.lastModified.replace(/\./g, '-'));
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
    { label: '카테고리', width: '300px', align: 'left' as const },
    { label: '상태', width: '120px', align: 'left' as const },
    { label: '문서 수', width: '80px', align: 'center' as const },
    { label: '포함 부서', align: 'left' as const },
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
    if (selectedCount > 0) setIsPopupOpen(true);
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

          <TableLayout>
            <TableHeader columns={columns} />

            {filteredCategories.length === 0 ? (
              <EmptyRow>
                <EmptyCell colSpan={7}>카테고리를 등록해주세요.</EmptyCell>
              </EmptyRow>
            ) : (
              filteredCategories.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <TableRow key={item.id}>
                    <td style={{ width: '48px', textAlign: 'center' }}>
                      <CheckBox
                        size="medium"
                        id={`faq-${item.id}`}
                        checked={isChecked}
                        onChange={() => toggleCheckItem(item.id)}
                        label=""
                      />
                    </td>
                    <td style={{ width: '300px', textAlign: 'left' }}>
                      <ScrollableCell>
                        <StyledLink to={`/faq/${item.id}`}>{item.name}</StyledLink>
                      </ScrollableCell>
                    </td>
                    <td style={{ width: '120px', textAlign: 'left' }}>
                      <StatusWrapper>
                        <StatusSummary
                          items={[
                            { type: 'Completed', count: item.status.completed },
                            { type: 'Processing', count: item.status.processing },
                            { type: 'Fail', count: item.status.fail },
                          ]}
                        />
                      </StatusWrapper>
                    </td>
                    <td style={{ width: '80px', textAlign: 'center' }}>{item.documentCount}</td>
                    <td>
                      <DepartmentTagList departments={item.departments ?? []} />
                    </td>
                    <td style={{ width: '160px', textAlign: 'left' }}>{item.lastModifiedDate}</td>
                    <td style={{ width: '40px', textAlign: 'center' }}>
                      <EditIconWrapper>
                        <EditIcon
                          onClick={() => handleEdit(item.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </EditIconWrapper>
                    </td>
                  </TableRow>
                );
              })
            )}
          </TableLayout>
        </ContentWrapper>
      </Content>

      <Popup
        isOpen={isPopupOpen}
        title="카테고리 삭제"
        onClose={() => setIsPopupOpen(false)}
        onDelete={() => {
          setIsPopupOpen(false);
          setIsSuccessPopupOpen(true);
        }}
        confirmText="삭제"
        cancelText="취소"
        warningMessages={['삭제한 카테고리는 복구할 수 없습니다.']}
      />

      <Popup
        isOpen={isSuccessPopupOpen}
        isAlert
        title="삭제 완료"
        message="카테고리가 삭제되었습니다."
        alertButtonText="확인"
        onClose={() => setIsSuccessPopupOpen(false)}
      />

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

const Content = styled.div`
  flex: 1;
  min-width: 1230px;
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
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 20px;
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
