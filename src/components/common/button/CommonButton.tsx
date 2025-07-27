import React from 'react';
import styled, { css } from 'styled-components';
import { colors, fontWeight } from '@/styles';

interface CommonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'dark';
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

type ButtonVariant = 'primary' | 'dark';
type ButtonSize = 'small' | 'medium';

const DOUBLE_CLICK_DELAY = 300;

const BUTTON_VARIANTS = {
  primary: {
    background: colors.Normal,
    hoverBackground: colors.Normal_active,
  },
  dark: {
    background: colors.Dark_active,
    hoverBackground: colors.Black,
  },
} as const;

const BUTTON_SIZES = {
  small: {
    height: '30px',
    fontSize: '14px',
    padding: '0 12px',
  },
  medium: {
    height: '32px',
    fontSize: '14px',
    padding: '0 12px',
  },
} as const;

const preventDoubleClick = (element: HTMLElement) => {
  element.style.pointerEvents = 'none';
  setTimeout(() => {
    element.style.pointerEvents = 'auto';
  }, DOUBLE_CLICK_DELAY);
};

const getVariantStyles = (variant: ButtonVariant) => {
  const variantConfig = BUTTON_VARIANTS[variant];

  return css`
    background-color: ${variantConfig.background};
    color: white;

    &:hover:not(:disabled) {
      background-color: ${variantConfig.hoverBackground};
    }
  `;
};

const getSizeStyles = (size: ButtonSize) => {
  const sizeConfig = BUTTON_SIZES[size];

  return css`
    height: ${sizeConfig.height};
    font-size: ${sizeConfig.fontSize};
    padding: ${sizeConfig.padding};
  `;
};

export const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  onClick,
  icon,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  type = 'button',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    preventDoubleClick(e.currentTarget);
    onClick?.();
  };

  return (
    <StyledButton
      onClick={handleClick}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      type={type}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}>`
  border: none;
  border-radius: 4px;
  font-weight: ${fontWeight.Medium};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $variant }) => getVariantStyles($variant)}
  ${({ $size }) => getSizeStyles($size)}
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    background-color: ${colors.Disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 12px;
    height: 12px;
  }
`;
