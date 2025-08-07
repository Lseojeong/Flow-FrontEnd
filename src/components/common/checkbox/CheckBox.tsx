import React from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { Props, CheckBoxSize, CheckBoxVariant } from './CheckBox.types';

const SIZE_CONFIG = {
  small: {
    boxSize: '12px',
    fontSize: '12px',
    gap: '8px',
    checkWidth: '3px',
    checkHeight: '6px',
  },
  medium: {
    boxSize: '16px',
    fontSize: '16px',
    gap: '10px',
    checkWidth: '4px',
    checkHeight: '8px',
  },
} as const;

const DESIGN_TOKENS = {
  borderWidth: '0.3px',
  borderRadius: '2px',
  transitionDuration: '0.2s',
  disabledOpacity: 0.4,
  hoverScale: 1.05,
  checkMarkPosition: {
    left: '30%',
    bottom: '30%',
  },
  outlineHoverOpacity: 0.1,
} as const;

const COLOR_SCHEME = {
  default: {
    border: {
      checked: colors.Normal,
      unchecked: colors.BoxStroke,
    },
    background: {
      checked: colors.Normal,
      unchecked: 'transparent',
      hover: colors.Light,
    },
    text: {
      normal: colors.Black,
      disabled: colors.BoxStroke,
    },
    checkMark: 'white',
  },
  outline: {
    border: colors.White,
    background: {
      normal: 'transparent',
      hover: `rgba(255, 255, 255, ${DESIGN_TOKENS.outlineHoverOpacity})`,
    },
    text: colors.White,
    checkMark: colors.White,
  },
} as const;

type SizeConfiguration = (typeof SIZE_CONFIG)[CheckBoxSize];

interface StyledProps {
  $checked: boolean;
  $disabled: boolean;
  $size: CheckBoxSize;
  $variant: CheckBoxVariant;
}

const getSizeConfig = (size: CheckBoxSize): SizeConfiguration => SIZE_CONFIG[size];

const getBorderColor = (checked: boolean, variant: CheckBoxVariant): string => {
  if (variant === 'outline') {
    return COLOR_SCHEME.outline.border;
  }

  return checked ? COLOR_SCHEME.default.border.checked : COLOR_SCHEME.default.border.unchecked;
};

const getBackgroundColor = (checked: boolean, variant: CheckBoxVariant): string => {
  if (variant === 'outline') {
    return COLOR_SCHEME.outline.background.normal;
  }

  return checked
    ? COLOR_SCHEME.default.background.checked
    : COLOR_SCHEME.default.background.unchecked;
};

const getTextColor = (disabled: boolean, variant: CheckBoxVariant): string => {
  if (disabled) {
    return COLOR_SCHEME.default.text.disabled;
  }

  return variant === 'outline' ? COLOR_SCHEME.outline.text : COLOR_SCHEME.default.text.normal;
};

const getCheckMarkColor = (variant: CheckBoxVariant): string => {
  return variant === 'outline' ? COLOR_SCHEME.outline.checkMark : COLOR_SCHEME.default.checkMark;
};

const createCheckMarkStyles = (size: CheckBoxSize, variant: CheckBoxVariant): string => {
  const checkColor = getCheckMarkColor(variant);

  return `
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${checkColor};
    font-size: ${size === 'small' ? '10px' : '12px'};
    font-weight: ${fontWeight.Regular};
    line-height: 1;
  `;
};

const createHoverStyles = (
  checked: boolean,
  disabled: boolean,
  variant: CheckBoxVariant
): string => {
  if (disabled) return '';

  const scale = `transform: scale(${DESIGN_TOKENS.hoverScale});`;

  if (variant === 'outline') {
    return `
      &:hover {
        border-color: ${COLOR_SCHEME.outline.border};
        background-color: ${COLOR_SCHEME.outline.background.hover};
        ${scale}
      }
    `;
  }

  const borderColor = COLOR_SCHEME.default.border.checked;
  const backgroundColor = checked
    ? COLOR_SCHEME.default.background.checked
    : COLOR_SCHEME.default.background.hover;

  return `
    &:hover {
      border-color: ${borderColor};
      background-color: ${backgroundColor};
      ${scale}
    }
  `;
};

export const CheckBox: React.FC<Props> = ({
  id,
  label,
  checked,
  onChange,
  size = 'small',
  variant = 'default',
  disabled = false,
  className,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.checked);
  };

  return (
    <CheckBoxContainer
      htmlFor={id}
      className={className}
      $size={size}
      $variant={variant}
      $checked={checked}
      $disabled={disabled}
    >
      <HiddenInput
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleInputChange}
        disabled={disabled}
      />
      <CheckBoxIndicator $checked={checked} $disabled={disabled} $size={size} $variant={variant} />
      {label && (
        <CheckBoxLabel $disabled={disabled} $size={size} $variant={variant}>
          {label}
        </CheckBoxLabel>
      )}
    </CheckBoxContainer>
  );
};

const CheckBoxContainer = styled.label<StyledProps>`
  display: flex;
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  gap: ${({ $size }) => getSizeConfig($size).gap};
  opacity: ${({ $disabled }) => ($disabled ? DESIGN_TOKENS.disabledOpacity : 1)};
  transition: all ${DESIGN_TOKENS.transitionDuration};
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const CheckBoxIndicator = styled.span<StyledProps>`
  width: ${({ $size }) => getSizeConfig($size).boxSize};
  height: ${({ $size }) => getSizeConfig($size).boxSize};
  border: ${DESIGN_TOKENS.borderWidth} solid
    ${({ $checked, $variant }) => getBorderColor($checked, $variant)};
  background-color: ${({ $checked, $variant }) => getBackgroundColor($checked, $variant)};
  border-radius: ${DESIGN_TOKENS.borderRadius};
  position: relative;
  transition: all ${DESIGN_TOKENS.transitionDuration};
  flex-shrink: 0;

  ${({ $checked, $size, $variant }) =>
    $checked &&
    `
    &::after {
      ${createCheckMarkStyles($size, $variant)}
    }
  `}

  ${({ $checked, $disabled, $variant }) => createHoverStyles($checked, $disabled, $variant)}
`;

const CheckBoxLabel = styled.span<Omit<StyledProps, '$checked'>>`
  font-size: ${({ $size }) => getSizeConfig($size).fontSize};
  color: ${({ $disabled, $variant }) => getTextColor($disabled, $variant)};
  font-weight: ${fontWeight.Regular};
  line-height: 1.4;
  user-select: none;
`;
