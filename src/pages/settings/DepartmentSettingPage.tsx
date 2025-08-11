import { useState } from 'react';
import styled from 'styled-components';
import SideBar from '@/components/common/layout/SideBar';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/Divider';
import { TableLayout, TableHeader, TableRow } from '@/components/common/table';
import { EditIcon, DeleteIcon } from '@/assets/icons/common';
import { Button } from '@/components/common/button/Button';
import DepartmentSettingModal from '@/components/department-setting/department-modal/DepartmentModal';
import { Popup } from '@/components/common/popup/Popup';
import { useDepartmentSettingList } from '@/apis/department/query';
import { useUpdateDepartment, useDeleteDepartment } from '@/apis/department/mutation';
import { Loading } from '@/components/common/loading/Loading';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

const columns = [
  { label: '부서명', width: '300px', align: 'center' as const },
  { label: '관리자 수', width: '300px', align: 'center' as const },
  { label: '카테고리 수', width: '300px', align: 'center' as const },
  { label: '', width: '100px', align: 'center' as const },
];

export default function DepartmentPage() {
  const [activeMenuId, setActiveMenuId] = useState('department-settings');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useDepartmentSettingList();
  const departments = data?.result?.departmentList ?? [];
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const currentDept = departments[index];
    setEditingName(currentDept.departmentName);
  };

  const handleSave = async () => {
    if (editingIndex === null) return;

    const department = departments[editingIndex];
    const trimmedName = editingName.trim();

    if (!trimmedName) {
      if (typeof window !== 'undefined' && window.showErrorToast) {
        window.showErrorToast('부서명을 입력해주세요.');
      }
      return;
    }

    if (trimmedName === department.departmentName) {
      setEditingIndex(null);
      setEditingName('');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        departmentId: department.departmentId,
        newName: trimmedName,
      });

      (window as { showToast?: (_message: string) => void }).showToast?.(
        '부서명이 수정되었습니다.'
      );
      setEditingIndex(null);
      setEditingName('');
    } catch (e) {
      const errorResponse = e as { response?: { data?: { message?: string } } };
      const message = errorResponse?.response?.data?.message || '부서명 수정에 실패했습니다.';
      if (typeof window !== 'undefined' && window.showErrorToast) {
        window.showErrorToast(message);
      }
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditingName('');
  };

  const handleDelete = (departmentId: string) => {
    setDepartmentToDelete(departmentId);
    setDeleteError(null);
    setIsDeletePopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (departmentToDelete) {
      try {
        await deleteMutation.mutateAsync({ departmentId: departmentToDelete });
        (window as { showToast?: (_message: string) => void }).showToast?.(
          '부서가 삭제되었습니다.'
        );
        setDepartmentToDelete(null);
        setDeleteError(null);
        refetch();
      } catch (e) {
        const errorResponse = e as {
          response?: {
            status?: number;
            data?: { code?: string; message?: string };
          };
        };
        const errorData = errorResponse?.response?.data;
        const status = errorResponse?.response?.status;

        if (status === 400) {
          let message = '부서 삭제에 실패했습니다.';

          if (errorData?.code === 'DEPARTMENT_IS_IN_USE_BY_ADMIN') {
            message = '관리자가 소속된 부서는 삭제할 수 없습니다.';
          } else if (errorData?.code === 'DEPARTMENT_IS_IN_USE_BY_CATEGORY') {
            message = '카테고리에 연결된 부서는 삭제할 수 없습니다.';
          } else if (errorData?.message) {
            message = errorData.message;
          }

          setDeleteError(message);
          return;
        } else {
          const message = errorData?.message || '부서 삭제에 실패했습니다.';
          if (typeof window !== 'undefined' && window.showErrorToast) {
            window.showErrorToast(message);
          }
          setIsDeletePopupOpen(false);
          return;
        }
      }
    }
    setIsDeletePopupOpen(false);
  };

  const handleCancelDelete = () => {
    setDepartmentToDelete(null);
    setDeleteError(null);
    setIsDeletePopupOpen(false);
  };

  const getWarningMessages = () => {
    const messages = [] as string[];

    if (deleteError) {
      messages.push(deleteError);
    }

    return messages;
  };

  const hasWarnings = () => {
    return deleteError !== null;
  };

  const handleInviteClick = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    setIsModalOpen(false);
    refetch();
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
              <LoadingText>부서 목록을 불러오는 중...</LoadingText>
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
              {'부서 목록을 불러오는데 실패했습니다.'}
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
            <PageTitle>부서 설정</PageTitle>
            <DescriptionRow>
              <Description>Flow의 부서를 설정할 수 있는 어드민입니다.</Description>
            </DescriptionRow>
          </HeaderSection>
          <Divider />
          <ButtonSection>
            <Button size="medium" onClick={handleInviteClick}>
              추가하기
            </Button>
          </ButtonSection>
          <TableSection>
            <TableLayout>
              <TableHeader columns={columns} />
              <tbody>
                {departments.length === 0 ? (
                  <EmptyRow>
                    <EmptyCell colSpan={columns.length}>
                      <EmptyMessage>등록된 부서가 없습니다.</EmptyMessage>
                    </EmptyCell>
                  </EmptyRow>
                ) : (
                  departments.map((department, index) => (
                    <TableRow key={department.departmentId}>
                      <td style={{ width: '300px', textAlign: 'center' }}>
                        {editingIndex === index ? (
                          <DepartmentEditCell>
                            <NameInput
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') handleCancel();
                              }}
                              autoFocus
                            />
                            <EditButtons>
                              <SaveButton onClick={handleSave} disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? (
                                  <Loading size={12} color="white" />
                                ) : (
                                  '저장'
                                )}
                              </SaveButton>
                              <CancelButton onClick={handleCancel}>취소</CancelButton>
                            </EditButtons>
                          </DepartmentEditCell>
                        ) : (
                          <DepartmentCell>{department.departmentName}</DepartmentCell>
                        )}
                      </td>
                      <td style={{ width: '300px', textAlign: 'center' }}>
                        {department.adminCount}명
                      </td>
                      <td style={{ width: '300px', textAlign: 'center' }}>
                        {department.categoryCount}건
                      </td>
                      <td style={{ width: '100px', textAlign: 'center' }}>
                        <ActionButtons>
                          <ActionButton onClick={() => handleEdit(index)}>
                            <EditIcon />
                          </ActionButton>
                          <ActionButton onClick={() => handleDelete(department.departmentId)}>
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
      <DepartmentSettingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
      <Popup
        isOpen={isDeletePopupOpen}
        title="부서 삭제"
        message="정말로 관리자 부서를 삭제하겠습니까?"
        warningMessages={getWarningMessages()}
        onClose={handleCancelDelete}
        onDelete={handleConfirmDelete}
        cancelText="취소"
        confirmText="삭제"
        disabled={hasWarnings()}
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

const NameInput = styled.input`
  width: 148px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid ${colors.BoxStroke};
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${colors.Normal};
  }
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

  &:hover:not(:disabled) {
    background-color: ${colors.Normal_active};
  }

  &:disabled {
    background-color: ${colors.Disabled};
    cursor: not-allowed;
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
  height: 100px; /* Adjust as needed */
`;

const EmptyCell = styled.td`
  text-align: center;
  color: ${colors.BoxText};
  font-size: 16px;
`;

const EmptyMessage = styled.p`
  margin-top: 20px;
`;
