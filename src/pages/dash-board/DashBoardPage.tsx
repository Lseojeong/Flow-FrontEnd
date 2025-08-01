import { useState } from 'react';
import styled from 'styled-components';
import SideBar from '@/components/common/layout/SideBar';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/Divider';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import { StatusCard } from '@/components/dash-board/status-card/StatusCard';
import { Chart } from '@/components/dash-board/chart/Chart';

import {
  BadIcon,
  CompletedIcon,
  DocsIcon,
  FailIcon,
  FaqIcon,
  GoodIcon,
  ProcessingIcon,
  SmallTalkIcon,
  TermsIcon,
} from '@/assets/icons/dash-board/index';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

export default function DashBoardPage() {
  const [activeMenuId, setActiveMenuId] = useState<string>('dashboard');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const chartData = [
    { date: '2025-01-01', count: 100 },
    { date: '2025-01-02', count: 200 },
    { date: '2025-01-03', count: 300 },
    { date: '2025-01-04', count: 100 },
    { date: '2025-01-05', count: 500 },
    { date: '2025-01-06', count: 600 },
    { date: '2025-01-07', count: 100 },
    { date: '2025-01-08', count: 800 },
    { date: '2025-01-09', count: 900 },
    { date: '2025-01-10', count: 1000 },
  ];
  return (
    <PageWrapper>
      <SideBarWrapper>
        <SideBar
          logoSymbol={symbolTextLogo}
          menuItems={menuItems}
          activeMenuId={activeMenuId}
          onMenuClick={setActiveMenuId}
        />
      </SideBarWrapper>
      <Content>
        <ContentWrapper>
          <HeaderSection>
            <PageTitle>대시보드</PageTitle>
            <DescriptionRow>
              <Description>Flow의 인사이트를 얻을 수 있는 대시보드입니다.</Description>
            </DescriptionRow>
          </HeaderSection>
          <Divider />
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            onDateChange={(start, end) => {
              setStartDate(start || '');
              setEndDate(end || '');
            }}
          />
          <StatusCardSection>
            <StatusCard
              title="FLOW 상태"
              count="9건"
              items={[
                { label: 'Completed', value: '2건', icon: <CompletedIcon /> },
                { label: 'Processing', value: '3건', icon: <ProcessingIcon /> },
                { label: 'Fail', value: '4건', icon: <FailIcon /> },
              ]}
            />
            <StatusCard
              title="평균 응답시간"
              count="0.8s"
              items={[
                { label: '가장 빠른 응답 시간', value: '0.2s', icon: <BadIcon /> },
                { label: '가장 오래 걸린 응답 시간', value: '1m', icon: <GoodIcon /> },
              ]}
            />
            <StatusCard
              title="작업 히스토리"
              count="50건"
              items={[
                { label: '용어 사전', value: '27건', icon: <TermsIcon /> },
                { label: '사내 문서', value: '23건', icon: <DocsIcon /> },
                { label: 'FAQ', value: '23건', icon: <FaqIcon /> },
              ]}
            />
            <StatusCard
              title="질문"
              count="50건"
              items={[
                { label: '스몰톡', value: '27건', icon: <SmallTalkIcon /> },
                { label: 'RAG', value: '23건', icon: <DocsIcon /> },
              ]}
            />
          </StatusCardSection>
          <Chart data={chartData} />
        </ContentWrapper>
      </Content>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 1000px;
  overflow-x: auto;
`;

const SideBarWrapper = styled.div`
  flex-shrink: 0;
  width: 280px;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  min-width: 1230px;
  padding: 0 36px;
  background-color: ${colors.background};
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const PageTitle = styled.h1`
  font-size: 40px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Normal};
  margin-bottom: 12px;
  margin-top: 80px;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 16px;
`;

const DescriptionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Description = styled.p`
  font-size: 16px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
`;

const StatusCardSection = styled.section`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 44px;
`;
