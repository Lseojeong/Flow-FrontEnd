import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CategoryInput } from '@/components/common/category-input/CategoryInput';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { Button } from '../../common/button/Button';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/FlatDivider';

interface BaseCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: { name: string; description: string; departments?: string[] }) => void;
  existingCategoryNames: string[];
  title?: string;
  children?: React.ReactNode;
}

const BaseCategoryModal: React.FC<BaseCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingCategoryNames,
  title = '카테고리 등록',
  children,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [errorType, setErrorType] = useState<'' | 'duplicate'>('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const trimmed = categoryName.trim();

    if (trimmed !== '' && existingCategoryNames.includes(trimmed)) {
      setErrorType('duplicate');
    } else {
      setErrorType('');
    }
  }, [categoryName, existingCategoryNames]);

  const handleConfirm = () => {
    const trimmedName = categoryName.trim();

    if (trimmedName === '') {
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
    });

    handleClose();

    setTimeout(() => {
      (window as { showToast?: (_message: string, _type: string) => void }).showToast?.(
        '카테고리가 등록되었습니다.',
        'success'
      );
    }, 100);
  };

  const trimmedName = categoryName.trim();
  const isDisabled = trimmedName === '' || existingCategoryNames.includes(trimmedName);

  const getErrorMessage = () => {
    if (errorType === 'duplicate') return '중복된 카테고리입니다.';
    return '';
  };

  const handleClose = () => {
    setCategoryName('');
    setDescription('');
    setErrorType('');
    onClose();
  };

  return (
    <>
      {isOpen && (
        <Overlay>
          <ModalBox>
            <Title>{title}</Title>
            <Divider />

            <CategoryInput
              value={categoryName}
              onChange={setCategoryName}
              onBlur={() => {}}
              error={getErrorMessage()}
            />

            {children}

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

export default BaseCategoryModal;

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
