    import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { CategorySearch } from '@/components/common/category-search/CategorySearch';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import { CheckBox } from '@/components/common/checkbox/CheckBox';
import {
  TableLayout,
  TableHeader,
  TableRow,
  ScrollableCell as TableCell,
} from '@/components/common/table';
import { Button } from '@/components/common/button/Button';
import SideBar from '@/components/common/layout/SideBar';
import StatusSummary from '@/components/common/status/StatusSummary';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { dictMockData } from '@/pages/mock/dictMock';
import { DeleteIcon, EditIcon } from '@/assets/icons/common';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/Divider';
import { Popup } from '@/components/common/popup/Popup';
import DictCategoryModal from '@/components/common/modal/DictCategoryModal';
import DictCategoryModalEdit from '@/components/common/modal/DictCategoryModalEdit';


const menuItems = [...commonMenuItems, ...settingsMenuItems];

export default function DictionaryPage() {
  const [activeMenuId, setActiveMenuId] = useState('dictionary');
  const [categories] = useState(dictMockData);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string; description: string } | null>(null);


  
  
  const existingCategoryNames = dictMockData.map((item) => item.name);

  const selectedCount = Object.values(checkedItems).filter(Boolean).length;

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

  const handleRegisterCategory = ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  console.log('카테고리명:', name);
  console.log('설명:', description);

};

  const handleDeleteSelected = () => {
  if (selectedCount === 0) return;
  setIsPopupOpen(true); 
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
        <PageTitle>용어 사전</PageTitle>
        <Description>실제 사용하는 단어를 등록하여 Flow의 이해도를 높일 수 있습니다.</Description>
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

          <CategorySearch placeholder="카테고리 검색" value="" onChange={() => {}} />

          <DateFilter startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
        </FilterBar>

        <SelectAllWrapper>
          <CheckBox
            size="medium"
            variant="outline"
            id="select-all"
            checked={selectedCount === categories.length && categories.length > 0}
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
              { label: '최종 수정일', width: '120px', align: 'center' },
              { label: '', width: '40px', align: 'center' },
            ]}
          />

          {categories.length === 0 ? (
            <EmptyRow>
              <EmptyCell colSpan={6}>
                <EmptyMessage>카테고리를 등록해주세요.</EmptyMessage>
              </EmptyCell>
            </EmptyRow>
          ) : (
            categories.map((category) => {
              const isChecked = !!checkedItems[category.id];
              return (
                <TableRow key={category.id}>
                  <TableCell align="center">
                    <CheckBoxWrapper>
                      <CheckBox
                        size="medium"
                        id={`check-${category.id}`}
                        checked={isChecked}
                        onChange={() => toggleCheckItem(category.id)}
                        label=""
                      />
                    </CheckBoxWrapper>
                  </TableCell>
                  <TableCell align="left">
                    <StyledLink to={`/dictionary/${category.id}`}>{category.name}</StyledLink>
                  </TableCell>
                  <TableCell align="left">
                    <StatusWrapper>
                      <StatusSummary
                        items={[
                          { type: 'Completed', count: category.status.green },
                          { type: 'Processing', count: category.status.yellow },
                          { type: 'Fail', count: category.status.red },
                        ]}
                      />
                    </StatusWrapper>
                  </TableCell>
                  <TableCell align="center">
                    <DocumentCount>{category.documentCount}</DocumentCount>
                  </TableCell>
                  <TableCell align="center">{category.lastModifiedDate}</TableCell>
                  <TableCell align="center">
                    <EditIcon
                      style={{ cursor: 'pointer', width: 20, height: 20 }}
                      onClick={() => handleEdit(category.id)}
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
      onSubmit={({ name, description }) => {
        console.log('수정된 카테고리:', name, description);
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
`;

const Content = styled.div`
  margin-left: 280px; /* 사이드바 너비 확보 */

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
  font-weight: ${fontWeight.SemiBold};
  margin-bottom: 12px;
  color: ${colors.Black};
`;

const Description = styled.p`
  color: ${colors.BoxText};
  font-size: 14px;
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

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
  height: 100%;
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #1a1a1a;
`;

const DocumentCount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-weight: 600;
  color: #1a1a1a;
`;

const SideBarWrapper = styled.div`
  position: fixed; /* 또는 sticky */
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  z-index: 1000;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
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
