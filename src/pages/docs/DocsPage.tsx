import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { CategorySearch } from '@/components/common/category-search/CategorySearch';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import { CheckBox } from '@/components/common/checkbox/CheckBox';
import { TableLayout, TableHeader, TableRow, ScrollableCell as TableCell } from '@/components/common/table';
import { Button } from '@/components/common/button/Button';
import { DepartmentTagList } from '@/components/common/department/DepartmentTagList';
import DepartmentSelect from '@/components/common/department/DepartmentSelect';
import SideBar from '@/components/common/layout/SideBar';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import EditIcon from '@/assets/icons/common/edit.svg?react';
import { Department } from '@/components/common/department/Department.types';
import { dictMockData } from '@/pages/mock/dictMock';

const menuItems = [...commonMenuItems, ...settingsMenuItems];


export default function DocsPage() {
  const [activeMenuId, setActiveMenuId] = useState('docs');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [docsData] = useState(dictMockData);

  const handleDateChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const isDateInRange = (dateStr: string) => {
    if (!startDate && !endDate) return true;
    const date = new Date(dateStr);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || date >= start) && (!end || date <= end);
  };

  const filteredDocsData = docsData.filter(
    (item) =>
      (!selectedDepartment || item.departments?.some((dep: Department) => dep.departmentName === selectedDepartment)) &&
      isDateInRange(item.lastModified.replace(/\./g, '-'))
  );

  return (
    <PageWrapper>
      <SideBar
        logoSymbol={symbolTextLogo}
        menuItems={menuItems}
        activeMenuId={activeMenuId}
        onMenuClick={setActiveMenuId}
      />
      <Content>
        <PageTitle>사내문서 관리</PageTitle>
        <Description>Flow에서 사용되는 사내문서 데이터를 관리하는 어드민입니다.</Description>
        <Divider />

        <FilterBar>
          <CategorySearch placeholder="카테고리 검색" value="" onChange={() => {}} />
          <DateFilter startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
          <DepartmentSelect value={selectedDepartment} onChange={setSelectedDepartment} />
          <ButtonWrapper>
            <Button size="small">+ 카테고리 등록</Button>
          </ButtonWrapper>
        </FilterBar>

        <TableLayout>
          <TableHeader
            columns={[
              { label: '선택', width: '80px', align: 'center' },
              { label: '카테고리', align: 'left' },
              { label: '상태', align: 'center' },
              { label: '문서 수', align: 'center' },
              { label: '포함 부서', align: 'left' },
              { label: '최종 수정일', width: '120px', align: 'center' },
              { label: '', width: '40px', align: 'center' },
            ]}
          />

          {filteredDocsData.length === 0 ? (
            <EmptyRow>
              <EmptyCell colSpan={7}>
                <EmptyMessage>사내 문서를 등록해주세요.</EmptyMessage>
              </EmptyCell>
            </EmptyRow>
          ) : (
            filteredDocsData.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="center">
                  <CheckBoxWrapper>
                    <CheckBox id={`doc-${item.id}`} checked={false} onChange={() => {}} label="" />
                  </CheckBoxWrapper>
                </TableCell>
                <TableCell align="left">
                  <StyledLink to={`/docs/${item.id}`}>{item.name}</StyledLink>
                </TableCell>
                <TableCell align="center">
                  <StatusWrapper>
                    <StatusDot color="green" /> {item.status.green}건
                    <StatusDot color="yellow" /> {item.status.yellow}건
                    <StatusDot color="red" /> {item.status.red}건
                  </StatusWrapper>
                </TableCell>
                <TableCell align="center">
                  <DocumentCount>{item.documentCount}</DocumentCount>
                </TableCell>
                <TableCell align="left">
                  <DepartmentTagList departments={item.departments || []} />
                </TableCell>
                <TableCell align="center">{item.lastModified}</TableCell>
                <TableCell align="center">
                  <EditIcon />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableLayout>
      </Content>
    </PageWrapper>
  );
}

// ---------------------- styled ----------------------

const PageWrapper = styled.div`
  display: flex;
`;

const Content = styled.div`
  margin-left: 280px;
  padding: 40px;
  width: 100%;
`;

const PageTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 16px 0 24px;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
  margin-left: auto;
`;

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
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const StatusDot = styled.span<{ color: 'green' | 'yellow' | 'red' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ color }) =>
    color === 'green' ? '#3FC36C' : color === 'yellow' ? '#F7B500' : '#F04438'};
  display: inline-block;
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