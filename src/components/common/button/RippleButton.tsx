import React, { useState, useRef, MouseEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, fontWeight } from '@/styles/index';

interface RippleType {
  x: number;
  y: number;
  size: number;
  key: number;
}

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: (_event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className,
}) => {
  const [ripples, setRipples] = useState<RippleType[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (clickEvent: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = clickEvent.clientX - rect.left - size / 2;
    const y = clickEvent.clientY - rect.top - size / 2;

    const newRipple: RippleType = {
      x,
      y,
      size,
      key: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.key !== newRipple.key));
    }, 600);

    if (onClick) {
      onClick(clickEvent);
    }
  };

  return (
    <StyledButton
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
      {ripples.map((ripple) => (
        <RippleEffect key={ripple.key} x={ripple.x} y={ripple.y} size={ripple.size} />
      ))}
    </StyledButton>
  );
};

const rippleAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

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
  overflow: hidden;
  transition: background-color 0.2s ease;
  margin-top: 16px;

  &:hover {
    background-color: ${colors.Normal_active};
  }

  &:disabled {
    background-color: rgba(15, 66, 157, 0.5); /* colors.Normal의 50% 투명도 */
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
  }
`;

const RippleEffect = styled.span<{ x: number; y: number; size: number }>`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ${rippleAnimation} 0.6s linear;
  pointer-events: none;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;
