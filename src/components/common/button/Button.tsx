import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { colors, fontWeight } from '@/styles';
import { Loading } from '@/components/common/loading/Loading';
import { Props, ButtonVariant, ButtonSize } from './Button.types';

/**
 * Note:
 * 확인, 취소는 medium
 * auth 페이지는 large
 * 나머지는 medium으로 통일
 */
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
    height: '38px',
    fontSize: '14px',
    padding: '0 20px',
  },
  large: {
    height: '52px',
    padding: '0 168px',
    fontSize: '15px',
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

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      onClick,
      icon,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      isLoading = false,
      type = 'button',
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;

      preventDoubleClick(e.currentTarget);
      onClick?.();
    };

    const isDisabled = disabled || isLoading;

    return (
      <StyledButton
        ref={ref}
        onClick={handleClick}
        $variant={variant}
        $size={size}
        disabled={isDisabled}
        type={type}
      >
        <ButtonContent $isLoading={isLoading}>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          {children}
        </ButtonContent>

        {isLoading && (
          <LoadingOverlay>
            <Loading size={16} color="white" />
          </LoadingOverlay>
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

const ButtonContent = styled.div<{ $isLoading: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: ${({ $isLoading }) => ($isLoading ? 0 : 1)};
  transition: opacity 0.2s ease;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
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
  position: relative;

  ${({ $variant }) => getVariantStyles($variant)}
  ${({ $size }) => getSizeStyles($size)}

  &:disabled {
    background-color: ${colors.Disabled};
    cursor: not-allowed;
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
