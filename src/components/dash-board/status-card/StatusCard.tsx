import React from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { StatusCardProps } from './StatusCard.types';

export const StatusCard: React.FC<StatusCardProps> = ({ title, count, items = [] }) => {
  return (
    <Card>
      <TitleRow>
        <Title>{title}</Title>
        <Count>{count}</Count>
      </TitleRow>
      <ItemList>
        {items.map((item, idx) => (
          <Item key={idx}>
            {item.icon} {item.label}: {item.value}
          </Item>
        ))}
      </ItemList>
    </Card>
  );
};

const Card = styled.div`
  background: ${colors.White};
  border-radius: 4px;
  width: 256px;
  height: 148px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;
  border: 2px solid ${colors.Light_hover};
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: ${fontWeight.Bold};
  color: ${colors.Darker};
  margin: 0;
`;

const Count = styled.span`
  font-size: 16px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Normal};
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
`;

const Item = styled.div`
  font-size: 12px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 8px;
    height: 8px;
  }
`;
