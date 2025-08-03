import { useState } from 'react';
import styled from 'styled-components';
import SideBar from '@/components/common/layout/SideBar';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/Divider';
import { TableLayout, TableHeader, TableRow } from '@/components/common/table';
import { EditIcon, DeleteIcon, ArrowIcon } from '@/assets/icons/common';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

// 사용자 데이터 타입
interface User {
  id: string;
  nickname: string;
  department: string;
  joinDate: string;
}

// 목업 데이터
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

// 테이블 컬럼 정의
const columns = [
  { label: '아이디(닉네임)', width: '300px', align: 'center' as const },
  { label: '부서', width: '200px', align: 'center' as const },
  { label: '가입 일시', width: '200px', align: 'center' as const },
  { label: '', width: '100px', align: 'center' as const }, // 액션 버튼용
];

export default function UserSettingPage() {
  const [activeMenuId, setActiveMenuId] = useState<string>('user-settings');

  const handleEdit = (userId: string) => {
    console.log('Edit user:', userId);
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
              <Description>Flow의 사용자를 설정할 수 있는 어드민 입니다.</Description>
            </DescriptionRow>
          </HeaderSection>
          <Divider />
          <TableSection>
            <TableLayout maxHeight="500px">
              <TableHeader columns={columns} />
              <tbody>
                {mockUsers.map((user, index) => (
                  <TableRow key={index}>
                    <td style={{ width: '300px', textAlign: 'center', padding: '16px 24px' }}>
                      {user.id}({user.nickname})
                    </td>
                    <td style={{ width: '200px', textAlign: 'center', padding: '16px 24px' }}>
                      <DepartmentCell>
                        {user.department}
                        {index === 0 && <ArrowIcon />}
                      </DepartmentCell>
                    </td>
                    <td style={{ width: '200px', textAlign: 'center', padding: '16px 24px' }}>
                      {user.joinDate}
                    </td>
                    <td style={{ width: '100px', textAlign: 'center', padding: '16px 24px' }}>
                      <ActionButtons>
                        <ActionButton onClick={() => handleEdit(user.id)}>
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

const TableSection = styled.div`
  margin-top: 24px;
`;

const DepartmentCell = styled.div`
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
    color: ${colors.BoxText};
  }
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
