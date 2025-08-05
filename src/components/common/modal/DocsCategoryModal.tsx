import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CategoryInput } from '@/components/common/category-input/CategoryInput';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { Button } from '../button/Button';
import { colors, fontWeight } from '@/styles/index';
import { Popup } from '@/components/common/popup/Popup';
import Divider from '@/components/common/divider/FlatDivider';
import { Department } from '@/components/common/department/Department.types';
import { DepartmentCheck } from '@/components/common/department/DepartmentCheck';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_: { name: string; description: string; departments: string[] }) => void;
  departments: Department[];
  existingCategoryNames: string[];
}

const DocsCategoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  departments,
  existingCategoryNames,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [errorType, setErrorType] = useState<'' | 'empty' | 'duplicate'>('');
  const [description, setDescription] = useState('');
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const trimmed = categoryName.trim();

    if (trimmed === '') {
      setErrorType('empty');
    } else if (existingCategoryNames.includes(trimmed)) {
      setErrorType('duplicate');
    } else {
      setErrorType('');
    }
  }, [categoryName, existingCategoryNames]);

  const handleConfirm = () => {
    const trimmedName = categoryName.trim();

    if (trimmedName === '') {
      setErrorType('empty');
      return;
    }

    if (existingCategoryNames.includes(trimmedName)) {
      setErrorType('duplicate');
      return;
    }

    setErrorType('');

    onSubmit({
      name: trimmedName,
      description,
      departments: selectedDepartments,
    });

    setCategoryName('');
    setDescription('');
    setSelectedDepartments([]);
    onClose();

    setTimeout(() => {
      setIsSuccessPopupOpen(true);
    }, 100);
    handleClose();
  };

  const trimmedName = categoryName.trim();
  const isDisabled = trimmedName === '' || existingCategoryNames.includes(trimmedName);

  const getErrorMessage = () => {
    if (errorType === 'empty') return '카테고리를 입력해주세요.';
    if (errorType === 'duplicate') return '중복된 카테고리입니다.';
    return '';
  };

  const handleClose = () => {
    setCategoryName('');
    setDescription('');
    setSelectedDepartments([]);
    setErrorType('');
    onClose();
  };

  return (
    <>
      <Popup
        isOpen={isSuccessPopupOpen}
        isAlert
        title="등록 완료"
        message="카테고리가 등록되었습니다."
        alertButtonText="확인"
        onClose={() => setIsSuccessPopupOpen(false)}
      />

      {isOpen && (
        <Overlay>
          <ModalBox>
            <Title>카테고리 등록</Title>
            <Divider />

            <CategoryInput
              value={categoryName}
              onChange={setCategoryName}
              onBlur={() => {}}
              error={getErrorMessage()}
              showValidation
            />
            <DepartmentCheck
              departments={departments}
              selectedDepartmentIds={selectedDepartments}
              onChange={setSelectedDepartments}
            />
            <DescriptionInput value={description} onChange={setDescription} onBlur={() => {}} />

            <ButtonRow>
              <Button variant="dark" onClick={handleClose}>
                취소
              </Button>
              <Button onClick={handleConfirm} disabled={isDisabled}>
                등록
              </Button>
            </ButtonRow>
          </ModalBox>
        </Overlay>
      )}
    </>
  );
};

export default DocsCategoryModal;

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
