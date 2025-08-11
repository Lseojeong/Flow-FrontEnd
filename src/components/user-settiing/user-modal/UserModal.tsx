import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { Button } from '@/components/common/button/Button';
import DepartmentSelect from '@/components/common/department/DepartmentSelect';
import EmailInput from '@/components/user-settiing/input/EmailInput';
import UserTag from '@/components/user-settiing/tag/UserTag';
import { UserModalProps, EmailTagData, ValidationErrors } from './UserModal.types';
import FlatDivider from '@/components/common/divider/FlatDivider';
import { useInviteAdmin } from '@/apis/user/query';
import { Toast as ErrorToast } from '@/components/common/toast-popup/ErrorToastPopup';

const MAX_EMAIL_TAGS = 10;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  departmentOptions = [],
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [emailTags, setEmailTags] = useState<EmailTagData[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [errorToastMessage, setErrorToastMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const inviteAdminMutation = useInviteAdmin();

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateEmailFormat = (email: string): boolean => {
    if (!EMAIL_REGEX.test(email)) return false;

    const [localPart, domain] = email.split('@');

    if (localPart.length === 0 || localPart.length > 64) return false;
    if (domain.length === 0 || domain.length > 255) return false;
    if (!domain.includes('.')) return false;
    if (email.includes('..') || email.includes('--')) return false;

    return true;
  };

  const isEmailDuplicate = (email: string): boolean => {
    return emailTags.some((tag) => tag.email.toLowerCase() === email.toLowerCase());
  };

  const getEmailValidationError = (email: string): string => {
    if (!email.trim()) return '이메일을 입력해주세요.';
    if (!validateEmailFormat(email)) return '올바른 이메일 형식이 아닙니다.';
    if (isEmailDuplicate(email)) return '이미 추가된 이메일입니다.';
    return '';
  };

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    const email = emailInput.trim();

    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else {
      const emailError = getEmailValidationError(email);
      if (emailError) {
        newErrors.email = emailError;
      }
    }

    if (!selectedDepartment) {
      newErrors.department = '부서를 선택해주세요.';
    }

    if (emailTags.length >= MAX_EMAIL_TAGS) {
      newErrors.email = '최대 10개까지 추가할 수 있습니다.';
    }

    return newErrors;
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && emailInput.trim()) {
      handleAddEmail();
    }
  };

  const handleAddEmail = () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const departmentName =
      departmentOptions.find((d) => d.departmentId === selectedDepartment)?.departmentName || '';

    const newTag: EmailTagData = {
      id: Date.now().toString(),
      email: emailInput.trim(),
      departmentName: departmentName,
    };

    setEmailTags((prev) => [...prev, newTag]);
    setEmailInput('');
    setErrors({});
  };

  const handleRemoveTag = (tagId: string) => {
    setEmailTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const handleDepartmentChange = (departmentId: string | null) => {
    setSelectedDepartment(departmentId);
    if (errors.department) {
      setErrors((prev) => ({ ...prev, department: undefined }));
    }
  };

  const handleSubmit = async () => {
    try {
      const emails = emailTags.map((tag) => tag.email);

      const selectedDepartmentData = departmentOptions.find(
        (d) => d.departmentId === selectedDepartment
      );

      if (!selectedDepartmentData || !selectedDepartmentData.departmentId) {
        setSubmitError('부서 정보를 찾을 수 없습니다.');
        return;
      }

      const inviteData = emails.map((email) => ({
        email,
        departmentId: selectedDepartmentData.departmentId,
      }));

      const response = await inviteAdminMutation.mutateAsync(inviteData);

      if (response?.code === 'COMMON200') {
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('관리자 초대가 성공적으로 완료되었습니다.');
        }
        onSubmit();
        setEmailInput('');
        setSelectedDepartment(null);
        setEmailTags([]);
        setErrors({});
        setSubmitError(null);
        onClose();
      } else {
        const errorMessage = response?.message || '초대에 실패했습니다.';
        setSubmitError(errorMessage);
      }
    } catch (error: unknown) {
      console.error('초대 실패:', error);
      const errorResponse = error as {
        response?: {
          data?: {
            code?: string;
            message?: string;
            result?: {
              id?: string;
              email?: string;
            };
          };
        };
      };

      const errorCode = errorResponse?.response?.data?.code;
      const errorMessage = errorResponse?.response?.data?.message;
      const errorResult = errorResponse?.response?.data?.result;

      let displayMessage = '초대에 실패했습니다.';

      if (errorCode === 'INVITATION500') {
        displayMessage = '일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (errorCode === 'ADMIN400') {
        displayMessage = '관리자가 조직에 소속되어 있지 않아 작업을 수행할 수 없습니다.';
      } else if (errorCode === 'INVITATION400') {
        if (errorResult?.email) {
          displayMessage = `${errorResult.email}은(는) 이미 해당 부서에 관리자로 할당되어 있는 유저입니다.`;
        } else {
          displayMessage = '이미 해당 부서에 관리자로 할당되어 있는 유저입니다.';
        }
      } else if (errorMessage) {
        displayMessage = errorMessage;
      }

      setSubmitError(displayMessage);
    }
  };

  const handleClose = () => {
    setEmailInput('');
    setSelectedDepartment(null);
    setEmailTags([]);
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  const isSubmitDisabled = useMemo(() => {
    return emailTags.length === 0 || !selectedDepartment;
  }, [emailTags.length, selectedDepartment]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>관리자 초대</ModalTitle>
          <FlatDivider />
        </ModalHeader>
        <ModalBody>
          <FormSection>
            <InputRow>
              <EmailSection>
                <Label>이메일</Label>
                <EmailInput
                  value={emailInput}
                  onChange={handleEmailInputChange}
                  onKeyDown={handleEmailKeyDown}
                  hasError={!!errors.email}
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </EmailSection>
              <DepartmentSection>
                <Label>부서</Label>
                <DepartmentSelect
                  options={departmentOptions}
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  showAllOption={false}
                />
                {errors.department && <ErrorMessage>{errors.department}</ErrorMessage>}
              </DepartmentSection>
              <InviteButton onClick={handleAddEmail}>초대</InviteButton>
            </InputRow>
          </FormSection>

          <TagsSection>
            {emailTags.map((tag) => (
              <UserTag
                key={tag.id}
                id={tag.id}
                email={tag.email}
                departmentName={tag.departmentName}
                onRemove={handleRemoveTag}
              />
            ))}
          </TagsSection>
          {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
        </ModalBody>

        <ModalFooter>
          <Button variant="dark" onClick={handleClose} size="medium" type="reset">
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            size="medium"
            type="submit"
            disabled={isSubmitDisabled}
          >
            등록
          </Button>
        </ModalFooter>
      </ModalContent>
      {errorToastMessage && (
        <ErrorToastWrapper>
          <ErrorToast message={errorToastMessage} onClose={() => setErrorToastMessage(null)} />
        </ErrorToastWrapper>
      )}
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${colors.White};
  border-radius: 4px;
  width: 720px;
  max-width: 100vw;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 32px 24px 0 24px;
  text-align: left;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Normal};
  margin: 0;
  margin-bottom: 8px;
`;

const ModalBody = styled.div`
  padding: 20px 24px;
`;

const FormSection = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Black};
  margin-bottom: 8px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const EmailSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const DepartmentSection = styled.div`
  width: 152px;
  display: flex;
  flex-direction: column;
`;

const InviteButton = styled.button`
  height: 32px;
  width: 60px;
  background: ${colors.Normal};
  color: ${colors.White};
  border: none;
  border-radius: 2px;
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 25px;

  &:hover {
    background: ${colors.Normal_hover};
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.MainRed};
  font-size: 12px;
  margin-top: 4px;
`;

const TagsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 40px;
  padding: 8px 0;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 0 24px 24px 24px;
`;

const ErrorToastWrapper = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 9999;
`;

export default UserModal;
