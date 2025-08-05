import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { CategorySearch } from '@/components/common/category-search/CategorySearch';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import DepartmentSelect from '@/components/common/department/DepartmentSelect';
import { DepartmentTagList } from '@/components/common/department/DepartmentTagList';
import { CheckBox } from '@/components/common/checkbox/CheckBox';
import {
  TableLayout,
  TableHeader,
  TableRow,
  ScrollableCell as TableCell,
} from '@/components/common/table';
import { Button } from '@/components/common/button/Button';
import SideBar from '@/components/common/layout/SideBar';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import EditIcon from '@/assets/icons/common/edit.svg?react';
import DeleteIcon from '@/assets/icons/common/delete.svg?react';
import { dictMockData } from '@/pages/mock/dictMock';
import Divider from '@/components/common/divider/Divider';
import { colors } from '@/styles/index';
import StatusSummary from '@/components/common/status/StatusSummary';
import { Popup } from '@/components/common/popup/Popup';
import DocsCategoryModal from '@/components/modal/category-modal/DocsCategoryModal';
import DocsCategoryModalEdit from '@/components/modal/category-edit-modal/DocsCategoryEditModal';
import { mockDepartments } from '@/pages/mock/mockDepartments';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

export default function DocsPage() {
  const [activeMenuId, setActiveMenuId] = useState('docs');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const selectedCount = Object.values(checkedItems).filter(Boolean).length;

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
  const [searchValue, setSearchValue] = useState('');

  const existingCategoryNames = dictMockData.map((item) => item.name);

  const handleDateChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const toggleCheckItem = (id: number) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelectAll = () => {
    const allSelected = selectedCount === filteredFaqData.length;
    if (allSelected) {
      setCheckedItems({});
    } else {
      const newChecked: Record<number, boolean> = {};
      filteredFaqData.forEach((item) => {
        newChecked[item.id] = true;
      });
      setCheckedItems(newChecked);
    }
  };

  const isDateInRange = (dateStr: string) => {
    if (!startDate && !endDate) return true;
    const date = new Date(dateStr);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || date >= start) && (!end || date <= end);
  };

  const filteredFaqData = dictMockData.filter((item) => {
    const matchesDepartment =
      !selectedDepartment || item.departments?.some((d) => d.departmentName === selectedDepartment);
    const matchesDate = isDateInRange(item.lastModified.replace(/\./g, '-'));
    return matchesDepartment && matchesDate;
  });

  const handleDeleteSelected = () => {
    if (selectedCount === 0) return;
    setIsPopupOpen(true);
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
    console.log('카테고리명:', name);
    console.log('설명:', description);
    console.log('선택된 부서:', departments);
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
        <PageTitle>사내 문서 관리</PageTitle>
        <Description>Flow에서 사용되는 사내문서 데이터를 관리하는 어드민입니다.</Description>
        <Divider />

        <TopBar>
          <ButtonWrapper>
            <Button size="small" onClick={() => setIsCategoryModalOpen(true)}>
              + 카테고리 등록
            </Button>
          </ButtonWrapper>
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
          <CategorySearch value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
          <DateFilter startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
          <DepartmentSelect value={selectedDepartment} onChange={setSelectedDepartment} />
        </FilterBar>

        <SelectAllWrapper>
          <CheckBox
            size="medium"
            variant="outline"
            id="select-all"
            checked={selectedCount === filteredFaqData.length && filteredFaqData.length > 0}
            onChange={toggleSelectAll}
            label="전체 선택"
          />
        </SelectAllWrapper>

        <TableLayout>
          <TableHeader
            columns={[
              { label: '선택', width: '80px', align: 'left' },
              { label: '카테고리', width: '300px', align: 'left' },
              { label: '상태', align: 'left' },
              { label: '문서 수', align: 'center' },
              { label: '포함 부서', align: 'left' },
              { label: '최종 수정일', width: '120px', align: 'center' },
              { label: '', width: '40px', align: 'center' },
            ]}
          />

          {filteredFaqData.length === 0 ? (
            <EmptyRow>
              <EmptyCell colSpan={7}>
                <EmptyMessage>문서를 등록해주세요.</EmptyMessage>
              </EmptyCell>
            </EmptyRow>
          ) : (
            filteredFaqData.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <TableRow key={item.id}>
                  <TableCell align="center">
                    <CheckBoxWrapper>
                      <CheckBox
                        size="medium"
                        id={`faq-${item.id}`}
                        checked={isChecked}
                        onChange={() => toggleCheckItem(item.id)}
                        label=""
                      />
                    </CheckBoxWrapper>
                  </TableCell>

                  <TableCell align="left">
                    <StyledLink to={`/docs/${item.id}`}>{item.name}</StyledLink>
                  </TableCell>

                  <TableCell align="left">
                    {item.status ? (
                      <StatusWrapper>
                        <StatusSummary
                          items={[
                            { type: 'Completed', count: item.status.green },
                            { type: 'Processing', count: item.status.yellow },
                            { type: 'Fail', count: item.status.red },
                          ]}
                        />
                      </StatusWrapper>
                    ) : (
                      '-'
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <DocumentCount>{item.documentCount}</DocumentCount>
                  </TableCell>

                  <TableCell align="left">
                    {item.departments ? <DepartmentTagList departments={item.departments} /> : '-'}
                  </TableCell>

                  <TableCell align="center">{item.lastModified}</TableCell>

                  <TableCell align="center">
                    <EditIcon
                      onClick={() => {
                        setEditingCategory({
                          id: item.id,
                          name: item.name,
                          description: item.description,
                          departments: item.departments ?? [],
                        });
                        setIsEditModalOpen(true);
                      }}
                      style={{ cursor: 'pointer', width: 20, height: 20 }}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableLayout>
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
        warningMessages={['선택한 카테고리를 삭제하면 복구할 수 없습니다.']}
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
            console.log('수정된 카테고리:', name, description);
            setIsEditModalOpen(false);
          }}
          initialName={editingCategory.name}
          initialDescription={editingCategory.description}
          initialDepartments={editingCategory?.departments?.map((d) => d.departmentId) ?? []}
          departments={mockDepartments}
        />
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
`;

const SideBarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  z-index: 1000;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  margin-left: 280px;
  padding: 40px;
  width: calc(100% - 280px);

  @media (min-width: 1920px) {
    width: auto;
    max-width: 1360px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const PageTitle = styled.h2`
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ButtonWrapper = styled.div``;

const SelectAllWrapper = styled.div``;

const EmptyRow = styled.tr`
  height: 200px;
`;

const EmptyCell = styled.td<{ colSpan: number }>`
  text-align: center;
  vertical-align: middle;
  color: #aaa;
  font-size: 14px;
  padding: 80px 0;
`;

const EmptyMessage = styled.div`
  display: inline-block;
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: left;
  height: 100%;
`;

const DocumentCount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-weight: 600;
  color: #1a1a1a;
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #3f51b5;
    text-decoration: underline;
  }
`;
