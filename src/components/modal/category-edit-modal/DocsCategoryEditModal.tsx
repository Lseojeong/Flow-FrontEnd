import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CategoryInput } from '@/components/common/category-input/CategoryInput';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { Button } from '../../common/button/Button';
import { colors, fontWeight } from '@/styles/index';
import { Popup } from '@/components/common/popup/Popup';
import Divider from '@/components/common/divider/FlatDivider';
import { Department } from '@/components/common/department/Department.types';
import { DepartmentCheck } from '@/components/common/department/DepartmentCheck';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_: { name: string; description: string; departments: string[] }) => void;
  initialName: string;
  initialDescription: string;
  initialDepartments: string[];
  departments: Department[];
}

const DocsCategoryModalEdit: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName,
  initialDescription,
  initialDepartments,
  departments,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [description, setDescription] = useState('');
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCategoryName(initialName ?? '');
      setDescription(initialDescription ?? '');
      setSelectedDepartments(initialDepartments ?? []);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialName, initialDescription, initialDepartments]);

  const handleConfirm = () => {
    const trimmedName = categoryName.trim();

    if (trimmedName === '') {
      setError('카테고리를 입력해주세요.');
      return;
    }

    onSubmit({
      name: trimmedName,
      description: description.trim(),
      departments: selectedDepartments,
    });

    setSelectedDepartments([]);

    setCategoryName('');
    setDescription('');
    setError('');
    onClose();

    setTimeout(() => {
      setIsSuccessPopupOpen(true);
    }, 100);
  };

  const isDisabled = categoryName.trim() === '';

  return (
    <>
      <Popup
        isOpen={isSuccessPopupOpen}
        isAlert
        title="수정 완료"
        message="카테고리가 수정되었습니다."
        alertButtonText="확인"
        onClose={() => setIsSuccessPopupOpen(false)}
      />

      {isOpen && (
        <Overlay>
          <ModalBox>
            <Title>카테고리 수정</Title>
            <Divider />

            <CategoryInput
              value={categoryName}
              onChange={setCategoryName}
              onBlur={() => {}}
              error={error}
              showValidation
            />
            <DepartmentCheck
              departments={departments}
              selectedDepartmentIds={selectedDepartments}
              onChange={setSelectedDepartments}
            />
            <DescriptionInput value={description} onChange={setDescription} onBlur={() => {}} />

            <ButtonRow>
              <Button variant="dark" onClick={onClose}>
                취소
              </Button>
              <Button onClick={handleConfirm} disabled={isDisabled}>
                수정
              </Button>
            </ButtonRow>
          </ModalBox>
        </Overlay>
      )}
    </>
  );
};

export default DocsCategoryModalEdit;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalBox = styled.div`
  background: ${colors.White};
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 720px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Dark};
  margin-bottom: 1px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
`;
