import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { ResetIcon } from '@/assets/icons/common/index';
import { FilterIcon } from '@/assets/icons/dash-board/index';
import { CheckBox } from '@/components/common/checkbox/CheckBox';
import { HistoryFilterProps } from './history-filter.types';
import {
  MENU_LIST,
  CATEGORY_MAP,
  FILE_MAP,
  MSG,
  truncateFileName,
} from './history-filter.constants';

export const HistoryFilter: React.FC<HistoryFilterProps> = ({ onCancel, onConfirm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const handleMenuSelect = (id: string) => {
    setSelectedMenuId(id);
    setSelectedCategoryId(null);
    setSelectedFileId(null);
  };
  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id);
    setSelectedFileId(null);
  };
  const handleFileSelect = (id: string) => {
    setSelectedFileId(id);
  };
  const handleReset = () => {
    setSelectedMenuId(null);
    setSelectedCategoryId(null);
    setSelectedFileId(null);
  };
  const handleCancel = () => {
    onCancel?.();
    handleReset();
    setIsOpen(false);
  };
  const handleConfirm = () => {
    if (!selectedMenuId || !selectedCategoryId || !selectedFileId) return;
    onConfirm?.({
      menu: [MENU_LIST.find((m) => m.id === selectedMenuId)?.label ?? ''],
      category: [
        CATEGORY_MAP[selectedMenuId].find((c) => c.id === selectedCategoryId)?.label ?? '',
      ],
      file: [FILE_MAP[selectedCategoryId].find((f) => f.id === selectedFileId)?.label ?? ''],
    });
    setIsOpen(false);
  };

  const renderCategoryList = () => {
    if (!selectedMenuId) return <GuideText>{MSG.selectMenu}</GuideText>;
    const categories = CATEGORY_MAP[selectedMenuId];
    if (!categories || categories.length === 0) return <GuideText>{MSG.noCategory}</GuideText>;
    return categories.map((item) => (
      <FilterItemWrapper key={item.id}>
        <CheckBox
          id={`category-${item.id}`}
          label={item.label}
          checked={selectedCategoryId === item.id}
          onChange={() => handleCategorySelect(item.id)}
        />
      </FilterItemWrapper>
    ));
  };

  const renderFileList = () => {
    if (selectedMenuId && CATEGORY_MAP[selectedMenuId].length === 0) {
      return <GuideText>{MSG.noFile}</GuideText>;
    }
    if (!selectedCategoryId) return <GuideText>{MSG.selectCategory}</GuideText>;
    const files = FILE_MAP[selectedCategoryId];
    if (!files || files.length === 0) return <GuideText>{MSG.noFile}</GuideText>;
    return files.map((item) => (
      <FilterItemWrapper key={item.id}>
        <CheckBox
          id={`file-${item.id}`}
          label={truncateFileName(item.label)}
          checked={selectedFileId === item.id}
          onChange={() => handleFileSelect(item.id)}
        />
      </FilterItemWrapper>
    ));
  };

  const isConfirmDisabled = !selectedMenuId || !selectedCategoryId || !selectedFileId;

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
                  {MENU_LIST.map((item) => (
                    <FilterItemWrapper key={item.id}>
                      <CheckBox
                        id={`menu-${item.id}`}
                        label={item.label}
                        checked={selectedMenuId === item.id}
                        onChange={() => handleMenuSelect(item.id)}
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

// ===== 스타일 컴포넌트 =====
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

  &:hover,
  &:focus {
    border-color: ${colors.Normal};
    color: ${colors.Normal};
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
  z-index: 1000;
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
  padding: 4px 0;
`;

const GuideText = styled.span`
  color: #c1c1c1;
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
  &:disabled {
    background-color: rgba(15, 66, 157, 0.5);
    cursor: not-allowed;
  }
`;
