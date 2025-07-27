import React from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { CompletedIcon, FailIcon, ProcessingIcon } from '@/assets/icons/common/index';
import { StatusItemData, StatusSummaryProps } from './Status.types';

export const StatusSummary: React.FC<StatusSummaryProps> = ({ items }) => {
  const getStatusIcon = (type: StatusItemData['type']) => {
    switch (type) {
      case 'Completed':
        return <CompletedIcon />;
      case 'Processing':
        return <ProcessingIcon />;
      case 'Fail':
        return <FailIcon />;
      default:
        return null;
    }
  };

  return (
    <Container>
      {items.map((item, index) => (
        <StatusItemWrapper key={index}>
          <IconWrapper color={item.type}>{getStatusIcon(item.type)}</IconWrapper>
          <CountText>{item.count}건</CountText>
        </StatusItemWrapper>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const IconWrapper = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CountText = styled.span`
  font-size: 14px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.Black};
`;

export default StatusSummary;
