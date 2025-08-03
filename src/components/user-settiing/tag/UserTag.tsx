import React from 'react';
import styled from 'styled-components';
import { colors } from '@/styles/index';
import { XmarkIcon } from '@/assets/icons/settings';
import { UserTagProps } from './UserTag.types';

const UserTag: React.FC<UserTagProps> = ({ id, email, departmentName, onRemove }) => {
  return (
    <TagContainer>
      <TagText>
        {email} / {departmentName}
      </TagText>
      <RemoveButton onClick={() => onRemove(id)}>
        <XmarkIcon />
      </RemoveButton>
    </TagContainer>
  );
};

const TagContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: ${colors.Light};
  border-radius: 4px;
`;

const TagText = styled.span`
  font-size: 12px;
  color: ${colors.Normal};
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  svg {
    width: 12px;
    height: 12px;
    color: ${colors.BoxText};
  }

  &:hover svg {
    color: ${colors.MainRed};
  }
`;

export default UserTag;
