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
import { Button } from '@/components/common/button/Button';
import UserModal from '@/components/user-settiing/user-modal/UserModal';
import { Popup } from '@/components/common/popup/Popup';
import { useUserSetting, useChangeAdminDepartment, useDepartmentList } from '@/apis/user/query';
import { Loading } from '@/components/common/loading/Loading';
import { formatDateTime } from '@/utils/formatDateTime';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

const columns = [
  { label: '아이디(닉네임)', width: '300px', align: 'center' as const },
  { label: '부서', width: '300px', align: 'center' as const },
  { label: '가입 일시', width: '300px', align: 'center' as const },
  { label: '', width: '100px', align: 'center' as const },
];

export default function UserSettingPage() {
  const [activeMenuId, setActiveMenuId] = useState('user-settings');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingDepartment, setEditingDepartment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useUserSetting();
  const changeDepartmentMutation = useChangeAdminDepartment();
  const { data: departmentData } = useDepartmentList();

  const users =
    data?.result?.departmentList.flatMap((dept) =>
      dept.admin.map((admin) => ({
        id: admin.adminId,
        nickname: admin.name,
        departmentName: dept.departmentName,
        createdAt: admin.createdAt,
      }))
    ) ?? [];

  const departmentOptions =
    data?.result?.departmentList.map((dept) => {
      // 부서 이름으로 ID 찾기 (실제 필드명 사용)
      const departmentId = departmentData?.result?.departmentList.find(
        (d) => d.departmentName === dept.departmentName
      )?.departmentId;
      return {
        departmentId: departmentId || '',
        departmentName: dept.departmentName,
      };
    }) ?? [];

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const currentUser = users[index];
    setEditingDepartment(currentUser.departmentName);
  };

  const handleSave = async () => {
    if (editingIndex === null) return;

    const selectedUser = users[editingIndex];

    const selectedDepartment = departmentOptions.find(
      (option) => option.departmentName === editingDepartment
    );

    if (!selectedDepartment) {
      alert('선택된 부서 정보를 찾을 수 없습니다.');
      return;
    }

    if (!selectedDepartment.departmentId) {
      alert('부서 ID를 찾을 수 없습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      await changeDepartmentMutation.mutateAsync({
        adminId: selectedUser.id,
        newDepartmentId: selectedDepartment.departmentId,
      });

      // 상태 초기화 및 목록 재조회
      setEditingIndex(null);
      setEditingDepartment('');
    } catch (error) {
      console.error('부서 변경 실패:', error);
      alert('부서 변경에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditingDepartment('');
  };

  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsDeletePopupOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      // TODO: 실제 API 호출로 사용자 삭제
      console.log('사용자 삭제:', userToDelete);
      setUserToDelete(null);
    }
    setIsDeletePopupOpen(false);
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
    setIsDeletePopupOpen(false);
  };

  const handleInviteClick = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = (emails: string[], department: string) => {
    console.log('초대할 이메일:', emails);
    console.log('부서:', department);
    // TODO: 실제 초대 로직 구현
  };

  if (isLoading) {
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
            <LoadingContainer>
              <Loading size={24} color={colors.Normal} />
              <LoadingText>사용자 목록을 불러오는 중...</LoadingText>
            </LoadingContainer>
          </ContentWrapper>
        </Content>
      </PageWrapper>
    );
  }

  if (error) {
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
            <ErrorMessage>
              {'사용자 목록을 불러오는데 실패했습니다.'}
              <RetryButton onClick={() => refetch()}>다시 시도</RetryButton>
            </ErrorMessage>
          </ContentWrapper>
        </Content>
      </PageWrapper>
    );
  }

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
            <PageTitle>관리자 설정</PageTitle>
            <DescriptionRow>
              <Description>Flow의 관리자를 설정할 수 있는 어드민입니다.</Description>
            </DescriptionRow>
          </HeaderSection>
          <Divider />
          <ButtonSection>
            <Button size="medium" onClick={handleInviteClick}>
              초대하기
            </Button>
          </ButtonSection>
          <TableSection>
            <TableLayout>
              <TableHeader columns={columns} />
              <tbody>
                {users.length === 0 ? (
                  <EmptyRow>
                    <EmptyCell colSpan={columns.length}>
                      <EmptyMessage>등록된 관리자가 없습니다.</EmptyMessage>
                    </EmptyCell>
                  </EmptyRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow key={index}>
                      <td style={{ width: '200px', textAlign: 'center' }}>
                        {user.id}({user.nickname})
                      </td>
                      <td style={{ width: '300px', textAlign: 'center' }}>
                        {editingIndex === index ? (
                          <DepartmentEditCell>
                            <StyledDepartmentSelect>
                              <DepartmentSelect
                                options={departmentOptions.map(({ departmentName }) => ({
                                  departmentId: departmentName, // 이름을 ID로 사용
                                  departmentName: departmentName,
                                }))}
                                value={editingDepartment}
                                onChange={(value) => setEditingDepartment(value || '')}
                                showAllOption={false}
                              />
                            </StyledDepartmentSelect>
                            <EditButtons>
                              <SaveButton onClick={handleSave}>저장</SaveButton>
                              <CancelButton onClick={handleCancel}>취소</CancelButton>
                            </EditButtons>
                          </DepartmentEditCell>
                        ) : (
                          <DepartmentCell onClick={() => handleEdit(index)}>
                            {user.departmentName}
                            <ArrowIcon />
                          </DepartmentCell>
                        )}
                      </td>
                      <td style={{ width: '200px', textAlign: 'center' }}>
                        {formatDateTime(user.createdAt)}
                      </td>
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
                  ))
                )}
              </tbody>
            </TableLayout>
          </TableSection>
        </ContentWrapper>
      </Content>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <Popup
        isOpen={isDeletePopupOpen}
        title="사용자 탈퇴"
        message="정말로 관리자를 탈퇴시키겠습니까?"
        onClose={handleCancelDelete}
        onDelete={handleConfirmDelete}
        cancelText="취소"
        confirmText="탈퇴"
      />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 1158px;
  overflow-x: auto;
`;

const SideBarWrapper = styled.div`
  flex-shrink: 0;
  width: 280px;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  min-width: 1158px;
  padding: 0 36px;
  background-color: ${colors.background};
`;

const ContentWrapper = styled.div`
  max-width: 1158px;
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
`;

const TableSection = styled.div`
  margin-top: 12px;
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

  svg {
    color: ${colors.BoxText};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-top: 30%;
`;

const LoadingText = styled.p`
  font-size: 18px;
  color: ${colors.BoxText};
`;

const ErrorMessage = styled.div`
  font-size: 18px;
  color: ${colors.BoxText};
  text-align: center;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 30%;
`;

const RetryButton = styled.button`
  padding: 8px 16px;
  background-color: ${colors.Normal};
  color: ${colors.White};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.Normal_active};
  }
`;

const EmptyRow = styled.tr`
  height: 100px;
`;

const EmptyCell = styled.td`
  text-align: center;
  color: ${colors.BoxText};
  font-size: 16px;
`;

const EmptyMessage = styled.p`
  margin-top: 20px;
`;
