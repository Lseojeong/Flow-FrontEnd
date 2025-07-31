import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  description?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, description }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TooltipContainer
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <TooltipContent>
          <TooltipTitle>{content}</TooltipTitle>
          {description && <TooltipDescription>{description}</TooltipDescription>}
          <TooltipArrow />
        </TooltipContent>
      )}
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div`
  position: absolute;
  bottom: 100%;
  left: -50px;
  margin-bottom: 8px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;

  background: ${colors.Dark_hover};
  color: white;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.25),
    0 3px 6px rgba(0, 0, 0, 0.15),
    0 1px 3px rgba(0, 0, 0, 0.1);

  width: 280px;
  white-space: normal;

  animation: tooltipFadeIn 0.2s ease-out;

  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TooltipTitle = styled.div`
  font-size: 12px;
  font-weight: ${fontWeight.Medium};
  line-height: 1.3;
`;

const TooltipDescription = styled.div`
  font-size: 12px;
  font-weight: ${fontWeight.Regular};
  line-height: 1.3;
  margin-top: 4px;
  opacity: 0.9;
`;

const TooltipArrow = styled.div`
  position: absolute;
  top: 100%;
  left: 20%;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid ${colors.Dark_hover};
`;
