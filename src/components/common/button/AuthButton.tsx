import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (_event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const AuthButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className,
}) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled} className={className}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  position: relative;
  width: 370px;
  height: 52px;
  background-color: ${colors.Normal};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: ${fontWeight.SemiBold};
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 16px;

  &:hover {
    background-color: ${colors.Normal_active};
  }

  &:disabled {
    background-color: rgba(15, 66, 157, 0.5);
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
  }
`;
