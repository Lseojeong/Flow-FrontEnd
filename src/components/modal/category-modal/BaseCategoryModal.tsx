import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CategoryInput } from '@/components/common/category-input/CategoryInput';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { Button } from '../../common/button/Button';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/FlatDivider';
import { CATEGORY_MODAL_CONSTANTS, MODAL_STYLE } from '@/constants/Modal.constants';
import axios, { AxiosError } from 'axios';

interface BaseCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: {
    name: string;
    description: string;
    departments?: string[];
  }) => void | Promise<unknown>;
  existingCategoryNames: string[];
  title?: string;
  children?: React.ReactNode;
}

type ErrorType = '' | 'required' | 'serverDuplicate';

type ErrorBody = {
  code?: string;
  message?: string;
};

const BaseCategoryModal: React.FC<BaseCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = '카테고리 등록',
  children,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [errorType, setErrorType] = useState<ErrorType>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isServerDuplicate, setIsServerDuplicate] = useState(false);

  const trimmedName = categoryName.trim();
  const trimmedDescription = description.trim();

  const isDisabled =
    trimmedName === '' || trimmedDescription === '' || isServerDuplicate || isSubmitting;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (trimmedName === '') {
      setErrorType('required');
    } else if (isServerDuplicate) {
      setErrorType('serverDuplicate');
    } else {
      setErrorType('');
    }
  }, [trimmedName, isServerDuplicate]);

  const handleNameChange = (val: string) => {
    setCategoryName(val);
    if (isServerDuplicate) {
      setIsServerDuplicate(false);
    }
  };

  const handleConfirm = async () => {
    if (isDisabled) return;

    try {
      setIsSubmitting(true);

      await onSubmit({
        name: trimmedName,
        description: trimmedDescription,
      });

      handleClose();

      const w = window as Window & { showToast?: (_message: string, _type: string) => void };
      setTimeout(() => {
        w.showToast?.(CATEGORY_MODAL_CONSTANTS.SUCCESS_REGISTER_MESSAGE, 'success');
      }, MODAL_STYLE.TOAST_DELAY);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = (err as AxiosError<ErrorBody>)?.response?.data;
        const code = data?.code;
        const msg = data?.message ?? '';

        if (code === 'CATEGORY400' || msg.includes('중복')) {
          setIsServerDuplicate(true);
          setErrorType('serverDuplicate');
          return;
        }
      }
      const w = window as Window & { showToast?: (_message: string, _type: string) => void };
      w.showToast?.('등록에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorMessage = () => {
    if (errorType === 'required') return '카테고리를 등록해주세요.';
    if (errorType === 'serverDuplicate') return '이미 존재하는 카테고리입니다.';
    return '';
  };

  const handleClose = () => {
    setCategoryName('');
    setDescription('');
    setErrorType('');
    setIsServerDuplicate(false);
    setIsSubmitting(false);
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
                onChange={handleNameChange}
                onBlur={() => {}}
                error={getErrorMessage()}
              />
              {children}
              <DescriptionInput value={description} onChange={setDescription} onBlur={() => {}} />
            </Container>
            <ButtonRow>
              <Button variant="dark" size="medium" onClick={handleClose} disabled={isSubmitting}>
                {CATEGORY_MODAL_CONSTANTS.CANCEL_BUTTON}
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={handleConfirm}
                disabled={isDisabled}
                isLoading={isSubmitting}
              >
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
  background: ${MODAL_STYLE.OVERLAY_BACKGROUND};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${MODAL_STYLE.OVERLAY_Z_INDEX};
`;

const ModalBox = styled.div`
  background: ${colors.White};
  padding: ${MODAL_STYLE.PADDING};
  border-radius: ${MODAL_STYLE.BORDER_RADIUS};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: ${MODAL_STYLE.WIDTH};
  display: flex;
  flex-direction: column;
  gap: ${MODAL_STYLE.MODAL_GAP};
`;

const Title = styled.h3`
  font-size: ${MODAL_STYLE.TITLE_FONT_SIZE};
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Dark};
  margin-bottom: ${MODAL_STYLE.TITLE_MARGIN_BOTTOM};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${MODAL_STYLE.CONTAINER_GAP};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${MODAL_STYLE.BUTTON_GAP};
  margin-top: ${MODAL_STYLE.BUTTON_ROW_MARGIN_TOP};
`;
