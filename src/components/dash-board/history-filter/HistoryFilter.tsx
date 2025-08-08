import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { ResetIcon } from '@/assets/icons/common/index';
import { FilterIcon } from '@/assets/icons/dash-board/index';
import { CheckBox } from '@/components/common/checkbox/CheckBox';
import { HistoryFilterProps } from './HistoryFilter.types';
import { HistoryMenu, Category } from '@/apis/dash-board/types';
import { MSG, truncateFileName } from '@/constants/HistoryFilter.constants';
import { useHistoryFilterMenu } from '@/apis/dash-board/query';

export const HistoryFilter: React.FC<HistoryFilterProps> = ({ onCancel, onConfirm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { data: menuData, isLoading, error } = useHistoryFilterMenu();

  const menuList = menuData?.result?.menuList || [];

  const handleMenuSelect = (menu: string) => {
    setSelectedMenu(menu);
    setSelectedCategory(null);
    setSelectedFile(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedFile(null);
  };

  const handleFileSelect = (file: string) => {
    setSelectedFile(file);
  };

  const handleReset = () => {
    setSelectedMenu(null);
    setSelectedCategory(null);
    setSelectedFile(null);
  };

  const handleCancel = () => {
    onCancel?.();
    handleReset();
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (!selectedMenu || !selectedCategory || !selectedFile) return;
    onConfirm?.({
      menu: [selectedMenu],
      category: [selectedCategory],
      file: [selectedFile],
    });
    setIsOpen(false);
  };

  const selectedMenuObj = menuList.find((m) => m.menu === selectedMenu);
  const selectedCategoryObj = selectedMenuObj?.categoryList.find(
    (c: Category) => c.category === selectedCategory
  );

  const renderCategoryList = () => {
    if (!selectedMenuObj) return <GuideText>{MSG.selectMenu}</GuideText>;
    if (selectedMenuObj.categoryList.length === 0) return <GuideText>{MSG.noCategory}</GuideText>;
    return selectedMenuObj.categoryList.map((item: Category) => (
      <FilterItemWrapper key={item.category}>
        <CheckBox
          id={`category-${item.category}`}
          label={item.category}
          checked={selectedCategory === item.category}
          onChange={() => handleCategorySelect(item.category)}
        />
      </FilterItemWrapper>
    ));
  };

  const renderFileList = () => {
    if (!selectedCategoryObj) return <GuideText>{MSG.selectCategory}</GuideText>;
    if (selectedCategoryObj.fileList.length === 0) return <GuideText>{MSG.noFile}</GuideText>;
    return selectedCategoryObj.fileList.map((fileName: string) => (
      <FilterItemWrapper key={fileName}>
        <CheckBox
          id={`file-${fileName}`}
          label={truncateFileName(fileName)}
          checked={selectedFile === fileName}
          onChange={() => handleFileSelect(fileName)}
        />
      </FilterItemWrapper>
    ));
  };

  const isConfirmDisabled = !selectedMenu || !selectedCategory || !selectedFile;

  if (isLoading) {
    return (
      <FilterWrapper>
        <FilterButton disabled>
          <FilterIcon />
          <span>필터</span>
        </FilterButton>
      </FilterWrapper>
    );
  }

  if (error) {
    return (
      <FilterWrapper>
        <FilterButton disabled>
          <FilterIcon />
          <span>필터</span>
        </FilterButton>
      </FilterWrapper>
    );
  }

  return (
    <FilterWrapper>
      <FilterButton onClick={() => setIsOpen((prev) => !prev)}>
        <FilterIcon />
        <span>필터</span>
      </FilterButton>
      {isOpen && (
        <DropdownContainer>
          <FilterContainer>
            <FilterContent>
              <MenuColumn>
                <ColumnTitle>메뉴</ColumnTitle>
                <ItemList>
                  {menuList.map((item: HistoryMenu) => (
                    <FilterItemWrapper key={item.menu}>
                      <CheckBox
                        id={`menu-${item.menu}`}
                        label={item.menu}
                        checked={selectedMenu === item.menu}
                        onChange={() => handleMenuSelect(item.menu)}
                      />
                    </FilterItemWrapper>
                  ))}
                </ItemList>
              </MenuColumn>
              <CategoryColumn>
                <ColumnTitle>카테고리</ColumnTitle>
                <ItemList>{renderCategoryList()}</ItemList>
              </CategoryColumn>
              <FileColumn>
                <ColumnTitle>파일</ColumnTitle>
                <ItemList>{renderFileList()}</ItemList>
              </FileColumn>
            </FilterContent>
            <FilterFooter>
              <ResetButton onClick={handleReset}>
                <ResetIcon />
              </ResetButton>
              <ButtonGroup>
                <CancelButton onClick={handleCancel}>취소</CancelButton>
                <ConfirmButton onClick={handleConfirm} disabled={isConfirmDisabled}>
                  확인
                </ConfirmButton>
              </ButtonGroup>
            </FilterFooter>
          </FilterContainer>
        </DropdownContainer>
      )}
    </FilterWrapper>
  );
};

const FilterWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: 32px;
  background: ${colors.White};
  border: 1px solid ${colors.BoxStroke};
  border-radius: 4px;
  color: ${colors.BoxText};
  font-size: 12px;
  font-weight: ${fontWeight.Medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${colors.Normal};
    color: ${colors.Normal};
  }

  &:disabled {
    background: ${colors.Light};
    color: ${colors.BoxText};
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 500;
  margin-top: 4px;
`;

const FilterContainer = styled.div`
  width: 600px;
  height: 268px;
  background: ${colors.White};
  border: 1px solid ${colors.BoxStroke};
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const FilterContent = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
`;

const MenuColumn = styled.div`
  width: 200px;
  height: 168px;
  overflow-y: hidden;
`;

const CategoryColumn = styled.div`
  width: 200px;
  height: 168px;
  overflow-y: hidden;
`;

const FileColumn = styled.div`
  width: 200px;
  height: 168px;
  overflow-y: hidden;
`;

const ColumnTitle = styled.h3`
  font-size: 14px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Black};
  margin: 0 0 16px 0;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${colors.BoxStroke};
    border-radius: 2px;
  }
`;

const FilterItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 1px;
  min-height: 24px;
  position: relative;
  overflow: visible;
`;

const GuideText = styled.span`
  color: ${colors.BoxText};
  font-size: 12px;
`;

const FilterFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
  border-top: 1px solid ${colors.BoxStroke};
`;

const ResetButton = styled.button`
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover svg {
    color: ${colors.Normal};
  }

  svg {
    width: 12px;
    height: 12px;
    color: ${colors.BoxText};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 10px;
  font-weight: ${fontWeight.Medium};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CancelButton = styled(Button)`
  background: ${colors.Dark_active};
  color: ${colors.White};

  &:hover {
    background: ${colors.Black};
  }
`;

const ConfirmButton = styled(Button)`
  background: ${colors.Normal};
  color: ${colors.White};

  &:hover {
    background: ${colors.Normal_active};
  }

  &:disabled {
    background-color: ${colors.Disabled};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${colors.Normal};
  }
`;
