import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CategoryInput } from '@/components/common/category-input/CategoryInput';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { Button } from '../../common/button/Button';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/FlatDivider';
import { CATEGORY_MODAL_CONSTANTS, ERROR_TYPES } from '@/constants/Modal.constants';

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
  const [errorType, setErrorType] = useState<'' | typeof ERROR_TYPES.DUPLICATE>('');
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
      setErrorType(ERROR_TYPES.DUPLICATE);
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
      setErrorType(ERROR_TYPES.DUPLICATE);
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
        CATEGORY_MODAL_CONSTANTS.SUCCESS_REGISTER_MESSAGE,
        'success'
      );
    }, CATEGORY_MODAL_CONSTANTS.TOAST_DELAY);
  };

  const trimmedName = categoryName.trim();
  const isDisabled = trimmedName === '' || existingCategoryNames.includes(trimmedName);

  const getErrorMessage = () => {
    if (errorType === ERROR_TYPES.DUPLICATE) return CATEGORY_MODAL_CONSTANTS.DUPLICATE_ERROR;
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

            <Container>
              <CategoryInput
                value={categoryName}
                onChange={setCategoryName}
                onBlur={() => {}}
                error={getErrorMessage()}
              />

              {children}

              <DescriptionInput value={description} onChange={setDescription} onBlur={() => {}} />
            </Container>

            <ButtonRow>
              <Button variant="dark" size="medium" onClick={handleClose}>
                {CATEGORY_MODAL_CONSTANTS.CANCEL_BUTTON}
              </Button>
              <Button variant="primary" size="medium" onClick={handleConfirm} disabled={isDisabled}>
                {CATEGORY_MODAL_CONSTANTS.REGISTER_BUTTON}
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${CATEGORY_MODAL_CONSTANTS.CONTAINER_GAP};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${CATEGORY_MODAL_CONSTANTS.BUTTON_GAP};
  margin-top: ${CATEGORY_MODAL_CONSTANTS.BUTTON_ROW_MARGIN_TOP};
`;
