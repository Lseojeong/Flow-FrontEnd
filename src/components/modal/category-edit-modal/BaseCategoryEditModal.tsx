import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CategoryInput } from '@/components/common/category-input/CategoryInput';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { DepartmentCheck } from '@/components/common/department/DepartmentCheck';
import { Button } from '@/components/common/button/Button';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/FlatDivider';
import { CATEGORY_MODAL_CONSTANTS, MODAL_STYLE } from '@/constants/Modal.constants';
import { Department } from '@/components/common/department/Department.types';
import { useAuthStore } from '@/store/useAuthStore';

interface BaseCategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: {
    name: string;
    description: string;
    departments: string[];
  }) => void | Promise<unknown>;
  onSuccess?: () => void;
  initialName: string;
  initialDescription: string;
  initialDepartments?: string[];
  departments?: Department[];
  showDepartmentCheck?: boolean;
  title?: string;
  children?: React.ReactNode;
}

type ErrorType = '' | 'required' | 'duplicate';

const BaseCategoryEditModal: React.FC<BaseCategoryEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
  initialName,
  initialDescription,
  initialDepartments = [],
  departments = [],
  showDepartmentCheck = false,
  title = '카테고리 수정',
  children,
}) => {
  const { profile } = useAuthStore();
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [errorType, setErrorType] = useState<ErrorType>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isTouched, setIsTouched] = useState(false);

  const trimmedName = categoryName.trim();
  const trimmedDescription = description.trim();

  const isDisabled =
    trimmedName === '' || trimmedDescription === '' || isSubmitting || errorType !== '';

  useEffect(() => {
    if (isOpen) {
      setCategoryName(initialName ?? '');
      setDescription(initialDescription ?? '');
      setSelectedDepartments(initialDepartments || []);
      setErrorType('');
      setIsTouched(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialName, initialDescription, JSON.stringify(initialDepartments)]);

  const handleDepartmentChange = (newSelectedDepartments: string[]) => {
    setSelectedDepartments(newSelectedDepartments);
  };

  const handleNameChange = (val: string) => {
    setCategoryName(val);
    if (isTouched && val.trim() !== '') {
      setErrorType('');
    }
  };

  const handleNameBlur = () => {
    setIsTouched(true);
    if (trimmedName === '') {
      setErrorType('required');
    }
  };

  const handleConfirm = async () => {
    setIsTouched(true);
    if (trimmedName === '') {
      setErrorType('required');
      return;
    }
    if (isDisabled) return;

    try {
      setIsSubmitting(true);

      let finalDepartments = [...selectedDepartments];
      if (profile?.departmentId && !finalDepartments.includes(profile.departmentId)) {
        finalDepartments.push(profile.departmentId);
      }

      await onSubmit({
        name: trimmedName,
        description: trimmedDescription,
        departments: finalDepartments,
      });

      // 성공 시에만 모달을 닫음
      onSuccess?.();
      handleClose();
    } catch (error: unknown) {
      // CATEGORY400 에러 처리 (중복 에러)
      if (error && typeof error === 'object' && 'response' in error) {
        const response = error as { response?: { data?: { code?: string } } };
        if (response.response?.data?.code === 'CATEGORY400') {
          setErrorType('duplicate');
        }
      }
      // 에러 발생 시 모달을 닫지 않음
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorMessage = () => {
    if (errorType === 'required') return '카테고리를 입력해주세요.';
    if (errorType === 'duplicate') return '중복된 이름은 사용할 수 없습니다.';
    return '';
  };

  const handleClose = () => {
    setCategoryName('');
    setDescription('');
    setSelectedDepartments([]);
    setErrorType('');
    setIsSubmitting(false);
    setIsTouched(false);
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
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              error={getErrorMessage()}
            />

            {children}

            {showDepartmentCheck && (
              <DepartmentCheck
                departments={departments}
                selectedDepartmentIds={selectedDepartments}
                onChange={handleDepartmentChange}
                userDepartmentId={profile?.departmentId}
              />
            )}

            <DescriptionInput value={description} onChange={setDescription} onBlur={() => {}} />

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

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${MODAL_STYLE.BUTTON_GAP_EDIT};
  margin-top: ${MODAL_STYLE.BUTTON_ROW_MARGIN_TOP};
`;
