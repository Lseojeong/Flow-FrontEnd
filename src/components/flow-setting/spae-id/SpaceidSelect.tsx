import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { colors, fontWeight } from '@/styles/index';
import { SpaceidSelectProps } from './SpaceIdSelect.types';
import { Loading } from '@/components/common/loading/Loading';

export const SpaceidSelect: React.FC<SpaceidSelectProps> = ({
  value,
  onChange,
  options,
  isLoading = false,
  children,
}) => {
  const handleSelectChange = (selectedOption: unknown) => {
    const option = selectedOption as { value: string; label: string } | null;
    onChange(option?.value || '');
  };

  const renderLoadingState = () => (
    <LoadingContainer>
      <Loading size={20} color={colors.Normal} />
    </LoadingContainer>
  );

  const renderSelectDropdown = () => (
    <StyledSelect
      value={options.find((option) => option.value === value)}
      onChange={handleSelectChange}
      options={options}
      placeholder="스페이스 ID를 선택하세요"
      isSearchable={true}
      isClearable={true}
      classNamePrefix="react-select"
    />
  );

  return (
    <SpaceSection>
      <SpaceTitle>스페이스 ID</SpaceTitle>
      <SpaceInputContainer>
        {isLoading ? renderLoadingState() : renderSelectDropdown()}
        <ButtonGroup>{children}</ButtonGroup>
      </SpaceInputContainer>
    </SpaceSection>
  );
};

const SpaceSection = styled.section`
  margin-top: 8px;
  margin-bottom: 24px;
`;

const SpaceTitle = styled.h2`
  font-size: 16px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Dark_active};
  margin-bottom: 16px;
`;

const SpaceInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid ${colors.Light};
  border-radius: 4px;
  background: ${colors.White};
  flex: 1;
  min-width: 300px;
`;

const StyledSelect = styled(Select)`
  flex: 1;
  min-width: 300px;

  .react-select__control {
    border: 1px solid ${colors.Light};
    border-radius: 4px;
    background: ${colors.White};
    box-shadow: none;
    min-height: 40px;

    &:hover {
      border-color: ${colors.Normal};
    }

    &.react-select__control--is-focused {
      border-color: ${colors.Normal};
      box-shadow: 0 0 0 1px ${colors.Normal};
    }
  }

  .react-select__single-value {
    color: ${colors.Normal};
    font-size: 14px;
  }

  .react-select__placeholder {
    color: ${colors.BoxText};
    font-size: 14px;
  }

  .react-select__menu {
    border: 1px solid ${colors.Light};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 9999;
  }

  .react-select__option {
    padding: 8px 12px;
    font-size: 14px;

    &:hover {
      background: ${colors.Light};
    }

    &.react-select__option--is-selected {
      background: ${colors.Normal};
      color: ${colors.White};
    }
  }
`;
