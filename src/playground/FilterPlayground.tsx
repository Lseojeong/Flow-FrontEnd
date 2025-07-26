import React, { useState } from 'react';
import styled from 'styled-components';
import CategorySearch from '@/components/common/category-search/CategorySearch';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import DepartmentSelect from '@/components/common/department/DepartmentSelect';
import FileSearch from '@/components/common/file-search/FileSearch';
import { HistoryFilter } from '@/components/dash-board/history-filter/HistoryFilter';
import { colors, fontWeight } from '@/styles/index';

const FilterPlayground: React.FC = () => {
  // DateFilter 상태
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  // CategorySearch 상태
  const [searchValue, setSearchValue] = useState('');
  // DepartmentSelect 상태
  const [department, setDepartment] = useState('전체');
  // FileSearch 상태
  const [fileSearch, setFileSearch] = useState('');
  // HistoryFilter 상태
  const [selectedItems, setSelectedItems] = useState<{
    menu: string[];
    category: string[];
    file: string[];
  }>({ menu: [], category: [], file: [] });

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleHistoryFilterConfirm = (items: {
    menu: string[];
    category: string[];
    file: string[];
  }) => {
    setSelectedItems(items);
    console.log('Selected items:', items);
  };

  const handleHistoryFilterCancel = () => {
    console.log('History filter cancelled');
  };

  const formatDate = (date: Date | null) =>
    date
      ? date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      : '';

  return (
    <Container>
      <h2>필터 Playground</h2>
      <Section>
        <SectionTitle>DateFilter</SectionTitle>
        <DateFilter startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
        <Info>
          <span>시작일: {formatDate(startDate)}</span>
          <span>종료일: {formatDate(endDate)}</span>
        </Info>
        <ResetButton onClick={() => handleDateChange(null, null)}>날짜 초기화</ResetButton>
      </Section>
      <Section>
        <SectionTitle>CategorySearch</SectionTitle>
        <CategorySearch value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        <Info>
          <span>검색어: {searchValue}</span>
        </Info>
        <ResetButton onClick={() => setSearchValue('')}>검색어 초기화</ResetButton>
      </Section>
      <Section>
        <SectionTitle>DepartmentSelect</SectionTitle>
        <DepartmentSelect value={department} onChange={setDepartment} />
        <Info>
          <span>선택된 부서: {department}</span>
        </Info>
        <ResetButton onClick={() => setDepartment('전체')}>부서 초기화</ResetButton>
      </Section>
      <Section>
        <SectionTitle>FileSearch</SectionTitle>
        <FileSearch value={fileSearch} onChange={(e) => setFileSearch(e.target.value)} />
        <Info>
          <span>파일 검색어: {fileSearch}</span>
        </Info>
        <ResetButton onClick={() => setFileSearch('')}>파일 검색 초기화</ResetButton>
      </Section>
      <Section>
        <SectionTitle>HistoryFilter</SectionTitle>
        <HistoryFilter
          onCancel={handleHistoryFilterCancel}
          onConfirm={handleHistoryFilterConfirm}
        />
        <Info>
          <span>선택된 메뉴: {selectedItems.menu.join(', ') || '없음'}</span>
          <span>선택된 카테고리: {selectedItems.category.join(', ') || '없음'}</span>
          <span>선택된 파일: {selectedItems.file.join(', ') || '없음'}</span>
        </Info>
        <ResetButton onClick={() => setSelectedItems({ menu: [], category: [], file: [] })}>
          히스토리 필터 초기화
        </ResetButton>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  background: ${colors.White};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Section = styled.div`
  width: 100%;
  margin-bottom: 40px;
  padding: 24px;
  border: 1px solid ${colors.BoxStroke};
  border-radius: 8px;
  background: ${colors.White};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Black};
  margin-bottom: 16px;
`;

const Info = styled.div`
  margin: 16px 0 8px 0;
  color: ${colors.BoxText};
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

const ResetButton = styled.button`
  padding: 6px 16px;
  background-color: ${colors.MainRed};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: ${fontWeight.Medium};
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 4px;

  &:hover {
    background-color: #e62e14;
  }
`;

export default FilterPlayground;
