import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { Button } from '@/components/common/button/Button';
import FlatDivider from '@/components/common/divider/FlatDivider';
import DepartmentTag from '@/components/department-setting/department-tag/DepartmentTag';
import DepartmentInput from '@/components/department-setting/input/DepartmentInput';
import { DepartmentModalProps } from './DepartmentModal.types';

const MAX_DEPARTMENT_TAGS = 10;

const DepartmentModal: React.FC<DepartmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string>('');

  const handleAddDepartment = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setError('부서를 입력해주세요.');
      return;
    }

    if (trimmedValue.length > 10) {
      setError('부서명은 최대 10자까지 입력 가능합니다.');
      return;
    }

    if (departments.includes(trimmedValue)) {
      setError('이미 추가된 부서입니다.');
      return;
    }

    if (departments.length >= MAX_DEPARTMENT_TAGS) {
      setError('최대 10개까지 추가할 수 있습니다.');
      return;
    }

    setDepartments([...departments, trimmedValue]);
    setInputValue('');
    setError('');
  };

  const handleRemoveDepartment = (departmentToRemove: string) => {
    setDepartments(departments.filter((dept) => dept !== departmentToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddDepartment();
    }
  };

  const handleSubmit = () => {
    onSubmit(departments);
    onClose();
  };

  const handleClose = () => {
    setDepartments([]);
    setInputValue('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>관리자 부서 설정</ModalTitle>
          <FlatDivider />
        </ModalHeader>
        <ModalBody>
          <FormSection>
            <InputRow>
              <DepartmentInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                error={error}
              />
              <AddButton onClick={handleAddDepartment}>추가</AddButton>
            </InputRow>
          </FormSection>

          <TagsSection>
            {departments.map((department, index) => (
              <DepartmentTag
                key={index}
                id={department}
                departmentName={department}
                onRemove={handleRemoveDepartment}
              />
            ))}
          </TagsSection>
        </ModalBody>

        <ModalFooter>
          <Button variant="dark" onClick={handleClose} size="medium">
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            size="medium"
            disabled={departments.length === 0}
          >
            적용
          </Button>
        </ModalFooter>
      </ModalContent>
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

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const AddButton = styled.button`
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

export default DepartmentModal;
