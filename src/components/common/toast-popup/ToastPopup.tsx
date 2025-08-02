import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, fontWeight } from '@/styles';
import { ToastProps } from './ToastPopup.types';
import { CompletedIcon } from '@/assets/icons/common/index';

export const Toast: React.FC<ToastProps> = ({ message, duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <ToastContainer>
      <CompletedIcon />
      {message}
    </ToastContainer>
  );
};

const fadeInOut = keyframes`
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    10% {
      opacity: 1;
      transform: translateY(0);
    }
    90% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(10px);
    }
`;

const ToastContainer = styled.div`
  display: inline-block;
  padding: 16px 100px 16px 42px;
  border-radius: 32px 0 0 32px;
  background: linear-gradient(to right, rgba(7, 30, 71, 0.9) 70%, rgba(71, 158, 85, 0.9) 100%);
  color: ${colors.White};
  text-align: left;
  font-size: 12px;
  font-weight: ${fontWeight.Medium};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  animation: ${fadeInOut} 5s ease forwards;
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
`;
