import React, { useState } from 'react';
import styled from 'styled-components';
import SideBar from '@/components/common/layout/SideBar';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/Divider';
import { TableLayout, TableHeader, TableRow } from '@/components/common/table';
import { EditIcon, DeleteIcon, ArrowIcon } from '@/assets/icons/common';
import DepartmentSelect from '@/components/common/department/DepartmentSelect';
import { Department } from '@/components/common/department/Department.types';
import { Button } from '@/components/common/button/Button';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

interface User {
  id: string;
  nickname: string;
  department: string;
  joinDate: string;
}

const mockUsers: User[] = [
  {
    id: 'kodari385',
    nickname: 'Milo',
    department: '재무팀',
    joinDate: '2025.07.05 16:30',
  },
  {
    id: 'kodari385',
    nickname: 'Milo',
    department: '회계팀',
    joinDate: '2025.07.05 16:30',
  },
];

const departmentOptions: Department[] = [
  { departmentId: 'finance', departmentName: '재무팀' },
  { departmentId: 'accounting', departmentName: '회계팀' },
  { departmentId: 'development', departmentName: '개발팀' },
  { departmentId: 'marketing', departmentName: '마케팅팀' },
  { departmentId: 'hr', departmentName: '인사팀' },
  { departmentId: 'planning', departmentName: '기획팀' },
];

const columns = [
  { label: '아이디(닉네임)', width: '300px', align: 'center' as const },
  { label: '부서', width: '300px', align: 'center' as const },
  { label: '가입 일시', width: '300px', align: 'center' as const },
  { label: '', width: '100px', align: 'center' as const },
];

export default function UserSettingPage() {
  const [activeMenuId, setActiveMenuId] = useState('user-settings');
  const [users, setUsers] = useState(mockUsers);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingDepartment, setEditingDepartment] = useState('');

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const currentDept = users[index].department;
    const deptOption = departmentOptions.find((dept) => dept.departmentName === currentDept);
    setEditingDepartment(deptOption?.departmentId || '');
  };

  const handleSave = (index: number) => {
    const updatedUsers = [...users];
    const selectedDept = departmentOptions.find((dept) => dept.departmentId === editingDepartment);
    updatedUsers[index] = {
      ...updatedUsers[index],
      department: selectedDept?.departmentName || users[index].department,
    };
    setUsers(updatedUsers);
    setEditingIndex(null);
    setEditingDepartment('');
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditingDepartment('');
  };

  const handleDelete = (userId: string) => {
    console.log('Delete user:', userId);
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
          <HeaderSection>
            <PageTitle>사용자 설정</PageTitle>
            <DescriptionRow>
              <Description>Flow의 사용자를 설정할 수 있는 어드민입니다.</Description>
            </DescriptionRow>
          </HeaderSection>
          <Divider />
          <ButtonSection>
            <Button size="medium">초대하기</Button>
          </ButtonSection>
          <TableSection>
            <TableLayout maxHeight="500px">
              <TableHeader columns={columns} />
              <tbody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <td style={{ width: '200px', textAlign: 'center' }}>
                      {user.id}({user.nickname})
                    </td>
                    <td style={{ width: '300px', textAlign: 'center' }}>
                      {editingIndex === index ? (
                        <DepartmentEditCell>
                          <StyledDepartmentSelect>
                            <DepartmentSelect
                              options={departmentOptions}
                              value={editingDepartment}
                              onChange={(value) => setEditingDepartment(value || '')}
                              showAllOption={false}
                            />
                          </StyledDepartmentSelect>
                          <EditButtons>
                            <SaveButton onClick={() => handleSave(index)}>저장</SaveButton>
                            <CancelButton onClick={handleCancel}>취소</CancelButton>
                          </EditButtons>
                        </DepartmentEditCell>
                      ) : (
                        <DepartmentCell onClick={() => handleEdit(index)}>
                          {user.department}
                          <ArrowIcon />
                        </DepartmentCell>
                      )}
                    </td>
                    <td style={{ width: '200px', textAlign: 'center' }}>{user.joinDate}</td>
                    <td style={{ width: '100px', textAlign: 'center' }}>
                      <ActionButtons>
                        <ActionButton onClick={() => handleEdit(index)}>
                          <EditIcon />
                        </ActionButton>
                        <ActionButton onClick={() => handleDelete(user.id)}>
                          <DeleteIcon />
                        </ActionButton>
                      </ActionButtons>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </TableLayout>
          </TableSection>
        </ContentWrapper>
      </Content>
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

const ButtonSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

const TableSection = styled.div`
  margin-top: 24px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;

  svg {
    color: ${colors.BoxText};
    transition: color 0.2s;
  }

  &:hover svg {
    color: ${colors.Normal};
  }
`;

const DepartmentEditCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledDepartmentSelect = styled.div`
  width: 148px;
  position: relative;
`;

const EditButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const SaveButton = styled.button`
  padding: 8px 12px;
  background-color: ${colors.Normal};
  color: ${colors.White};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: ${fontWeight.Medium};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.Normal_active};
  }
`;

const CancelButton = styled.button`
  padding: 8px 12px;
  background-color: ${colors.Dark_active};
  color: ${colors.White};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: ${fontWeight.SemiBold};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.Black};
  }
`;

const DepartmentCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  width: 100%;
  height: 100%;

  svg {
    color: ${colors.BoxText};
  }
`;
