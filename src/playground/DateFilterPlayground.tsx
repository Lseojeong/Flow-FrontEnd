import React, { useState } from 'react';
import styled from 'styled-components';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import { colors, fontWeight } from '@/styles/index';

export const DateFilterPlayground: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '선택되지 않음';
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <PlaygroundContainer>
      <PlaygroundHeader>
        <PlaygroundTitle>DateFilter 플레이그라운드</PlaygroundTitle>
        <PlaygroundSubtitle>DateFilter 컴포넌트 테스트</PlaygroundSubtitle>
      </PlaygroundHeader>

      <PlaygroundSection>
        <SectionTitle>기본 DateFilter</SectionTitle>
        <DateFilterWrapper>
          <DateFilter startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
        </DateFilterWrapper>
      </PlaygroundSection>

      <PlaygroundSection>
        <SectionTitle>선택된 날짜 정보</SectionTitle>
        <InfoContainer>
          <InfoItem>
            <InfoLabel>시작일:</InfoLabel>
            <InfoValue>{formatDate(startDate)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>종료일:</InfoLabel>
            <InfoValue>{formatDate(endDate)}</InfoValue>
          </InfoItem>
        </InfoContainer>
      </PlaygroundSection>

      <PlaygroundSection>
        <SectionTitle>초기화 버튼</SectionTitle>
        <ButtonContainer>
          <ResetButton onClick={() => handleDateChange(null, null)}>날짜 초기화</ResetButton>
        </ButtonContainer>
      </PlaygroundSection>
    </PlaygroundContainer>
  );
};

const PlaygroundContainer = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  background-color: ${colors.White};
  min-height: 100vh;
`;

const PlaygroundHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const PlaygroundTitle = styled.h1`
  font-size: 32px;
  font-weight: ${fontWeight.Bold};
  color: ${colors.Black};
  margin-bottom: 8px;
`;

const PlaygroundSubtitle = styled.p`
  font-size: 16px;
  color: ${colors.BoxText};
  margin: 0;
`;

const PlaygroundSection = styled.div`
  margin-bottom: 40px;
  padding: 24px;
  border: 1px solid ${colors.BoxStroke};
  border-radius: 8px;
  background-color: ${colors.White};
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Black};
  margin-bottom: 16px;
`;

const DateFilterWrapper = styled.div`
  width: 300px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoLabel = styled.span`
  font-weight: ${fontWeight.Medium};
  color: ${colors.Black};
  min-width: 80px;
`;

const InfoValue = styled.span`
  color: ${colors.Normal};
  font-weight: ${fontWeight.Regular};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const ResetButton = styled.button`
  padding: 8px 16px;
  background-color: ${colors.MainRed};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e62e14;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 51, 23, 0.2);
  }
`;

export default DateFilterPlayground;
