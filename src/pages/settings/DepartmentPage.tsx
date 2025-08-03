import React, { useState } from 'react';
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
import { mockDepartments } from '@/pages/mock/dictMock';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

const columns = [
  { label: '부서명', width: '300px', align: 'center' as const },
  { label: '관리자 수', width: '300px', align: 'center' as const },
  { label: '카테고리 수', width: '300px', align: 'center' as const },
  { label: '', width: '100px', align: 'center' as const },
];

export default function DepartmentPage() {
  const [activeMenuId, setActiveMenuId] = useState('department-settings');
  const [departments, setDepartments] = useState(mockDepartments);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(null);
  const [categoryResolved, setCategoryResolved] = useState(false);
  const [userResolved, setUserResolved] = useState(false);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const currentDept = departments[index];
    setEditingName(currentDept.name);
  };

  const handleSave = (index: number) => {
    const updatedDepartments = [...departments];
    updatedDepartments[index] = {
      ...updatedDepartments[index],
      name: editingName,
    };
    setDepartments(updatedDepartments);
    setEditingIndex(null);
    setEditingName('');
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditingName('');
  };

  const handleDelete = (departmentId: string) => {
    setDepartmentToDelete(departmentId);
    setCategoryResolved(false);
    setUserResolved(false);
    setIsDeletePopupOpen(true);
  };

  const handleConfirmDelete = () => {
    if (departmentToDelete) {
      setDepartments(departments.filter((dept) => dept.id !== departmentToDelete));
      setDepartmentToDelete(null);
    }
    setIsDeletePopupOpen(false);
  };

  const handleCancelDelete = () => {
    setDepartmentToDelete(null);
    setCategoryResolved(false);
    setUserResolved(false);
    setIsDeletePopupOpen(false);
  };

  const getWarningMessages = () => {
    const messages = [];
    if (!categoryResolved) {
      messages.push('연결된 카테고리를 수정하거나 삭제하세요');
      return messages;
    }
    if (!userResolved) {
      messages.push('연결된 사용자를 수정하거나 삭제하세요');
    }
    return messages;
  };

  const hasWarnings = () => {
    return !categoryResolved || !userResolved;
  };

  const handleInviteClick = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = (departments: string[]) => {
    console.log('설정할 부서들:', departments);
    // TODO: 실제 부서 설정 로직 구현
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
            <PageTitle>부서 설정</PageTitle>
            <DescriptionRow>
              <Description>Flow의 부서를 설정할 수 있는 어드민 입니다.</Description>
            </DescriptionRow>
          </HeaderSection>
          <Divider />
          <ButtonSection>
            <Button size="medium" onClick={handleInviteClick}>
              추가하기
            </Button>
          </ButtonSection>
          <TableSection>
            <TableLayout maxHeight="500px">
              <TableHeader columns={columns} />
              <tbody>
                {departments.map((department, index) => (
                  <TableRow key={index}>
                    <td style={{ width: '300px', textAlign: 'center' }}>
                      {editingIndex === index ? (
                        <DepartmentEditCell>
                          <NameInput
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(index);
                              if (e.key === 'Escape') handleCancel();
                            }}
                            autoFocus
                          />
                          <EditButtons>
                            <SaveButton onClick={() => handleSave(index)}>저장</SaveButton>
                            <CancelButton onClick={handleCancel}>취소</CancelButton>
                          </EditButtons>
                        </DepartmentEditCell>
                      ) : (
                        <DepartmentCell>{department.name}</DepartmentCell>
                      )}
                    </td>
                    <td style={{ width: '300px', textAlign: 'center' }}>
                      {department.managerCount}명
                    </td>
                    <td style={{ width: '300px', textAlign: 'center' }}>
                      {department.categoryCount}건
                    </td>
                    <td style={{ width: '100px', textAlign: 'center' }}>
                      <ActionButtons>
                        <ActionButton onClick={() => handleEdit(index)}>
                          <EditIcon />
                        </ActionButton>
                        <ActionButton onClick={() => handleDelete(department.id)}>
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

      <DepartmentSettingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <Popup
        isOpen={isDeletePopupOpen}
        title="관리자 부서 삭제"
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
