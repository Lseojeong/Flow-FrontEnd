import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CategoryInput } from '@/components/common/category-input/CategoryInput';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { Button } from '@/components/common/button/Button';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/FlatDivider';
import { CATEGORY_MODAL_CONSTANTS } from '@/constants/Modal.constants';

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
      setError(CATEGORY_MODAL_CONSTANTS.EMPTY_NAME_ERROR);
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
        CATEGORY_MODAL_CONSTANTS.SUCCESS_EDIT_MESSAGE
      );
    }, CATEGORY_MODAL_CONSTANTS.TOAST_DELAY);
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
                {CATEGORY_MODAL_CONSTANTS.CANCEL_BUTTON}
              </Button>
              <Button variant="primary" size="medium" onClick={handleConfirm} disabled={isDisabled}>
                {CATEGORY_MODAL_CONSTANTS.EDIT_BUTTON}
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
  background: ${CATEGORY_MODAL_CONSTANTS.OVERLAY_BACKGROUND};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${CATEGORY_MODAL_CONSTANTS.OVERLAY_Z_INDEX};
`;

const ModalBox = styled.div`
  background: ${colors.White};
  padding: ${CATEGORY_MODAL_CONSTANTS.MODAL_PADDING};
  border-radius: ${CATEGORY_MODAL_CONSTANTS.MODAL_BORDER_RADIUS};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: ${CATEGORY_MODAL_CONSTANTS.MODAL_WIDTH};
  display: flex;
  flex-direction: column;
  gap: ${CATEGORY_MODAL_CONSTANTS.MODAL_GAP};
`;

const Title = styled.h3`
  font-size: ${CATEGORY_MODAL_CONSTANTS.TITLE_FONT_SIZE};
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Dark};
  margin-bottom: ${CATEGORY_MODAL_CONSTANTS.TITLE_MARGIN_BOTTOM};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${CATEGORY_MODAL_CONSTANTS.BUTTON_GAP_EDIT};
  margin-top: ${CATEGORY_MODAL_CONSTANTS.BUTTON_ROW_MARGIN_TOP};
`;
