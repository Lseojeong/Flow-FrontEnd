import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CategoryInput } from '@/components/common/category-input/CategoryInput';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { Button } from '@/components/common/button/Button';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/FlatDivider';

interface BaseCategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: { name: string; description: string; departments?: string[] }) => void;
  initialName: string;
  initialDescription: string;
  title?: string;
  children?: React.ReactNode;
}

const BaseCategoryEditModal: React.FC<BaseCategoryEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName,
  initialDescription,
  title = '카테고리 수정',
  children,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCategoryName(initialName ?? '');
      setDescription(initialDescription ?? '');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialName, initialDescription]);

  const handleConfirm = () => {
    const trimmedName = categoryName.trim();

    if (trimmedName === '') {
      setError('카테고리를 입력해주세요.');
      return;
    }

    onSubmit({
      name: trimmedName,
      description: description.trim(),
    });

    setCategoryName('');
    setDescription('');
    setError('');
    onClose();

    setTimeout(() => {
      (window as { showToast?: (_message: string) => void }).showToast?.(
        '카테고리가 수정되었습니다.'
      );
    }, 100);
  };

  const isDisabled = categoryName.trim() === '';

  const handleClose = () => {
    setCategoryName('');
    setDescription('');
    setError('');
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
              error={error}
            />

            {children}

            <DescriptionInput value={description} onChange={setDescription} onBlur={() => {}} />

            <ButtonRow>
              <Button variant="dark" size="medium" onClick={handleClose}>
                취소
              </Button>
              <Button variant="primary" size="medium" onClick={handleConfirm} disabled={isDisabled}>
                수정
              </Button>
            </ButtonRow>
          </ModalBox>
        </Overlay>
      )}
    </>
  );
};

export default BaseCategoryEditModal;

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
  gap: 20px;
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
  margin-top: 20px;
`;
