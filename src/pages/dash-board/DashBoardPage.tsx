import { useState, useEffect } from 'react';
import styled from 'styled-components';
import SideBar from '@/components/common/layout/SideBar';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/Divider';
import { DateFilter } from '@/components/common/date-filter/DateFilter';
import { StatusCard } from '@/components/dash-board/status-card/StatusCard';
import { Chart } from '@/components/dash-board/chart/Chart';
import { HistoryTable } from '@/components/dash-board/historyTable/HistoryTable';
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
import { useDashboardData } from '@/apis/dash-board/query';
import { Loading } from '@/components/common/loading/Loading';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

export default function DashBoardPage() {
  const [activeMenuId, setActiveMenuId] = useState<string>('dashboard');
  const [startDate, setStartDate] = useState<string>(getWeekAgoDate());
  const [endDate, setEndDate] = useState<string>(getTodayDate());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: dashboardData, isLoading } = useDashboardData({
    startDate: startDate ? formatDateForAPI(startDate) : '',
    endDate: endDate ? formatDateForAPI(endDate) : '',
  });

  const handleDateChange = (start: string | null, end: string | null) => {
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    }
  };

  const getStatusCardData = () => {
    const defaultData = {
      status: { total: 0, completed: 0, processing: 0, fail: 0 },
      responseTime: { average: '0s', fastest: '0s', slowest: '0s' },
      workHistory: { total: 0, dictionary: 0, document: 0, faq: 0 },
      question: { total: 0, smallTalk: 0, rag: 0 },
    };

    const data = dashboardData?.result || defaultData;
    const { status, responseTime, workHistory, question } = data;

    return [
      {
        title: 'FLOW 상태',
        count: `${status.total}건`,
        items: [
          {
            label: 'Completed',
            value: `${status.completed}건`,
            icon: <CompletedIcon />,
          },
          {
            label: 'Processing',
            value: `${status.processing}건`,
            icon: <ProcessingIcon />,
          },
          { label: 'Fail', value: `${status.fail}건`, icon: <FailIcon /> },
        ],
      },
      {
        title: '평균 응답시간',
        count: responseTime.average,
        items: [
          {
            label: '가장 빠른 응답 시간',
            value: responseTime.fastest,
            icon: <BadIcon />,
          },
          {
            label: '가장 오래 걸린 응답 시간',
            value: responseTime.slowest,
            icon: <GoodIcon />,
          },
        ],
      },
      {
        title: '작업 히스토리',
        count: `${workHistory.total}건`,
        items: [
          {
            label: '용어 사전',
            value: `${workHistory.dictionary}건`,
            icon: <TermsIcon />,
          },
          {
            label: '사내 문서',
            value: `${workHistory.document}건`,
            icon: <DocsIcon />,
          },
          { label: 'FAQ', value: `${workHistory.faq}건`, icon: <FaqIcon /> },
        ],
      },
      {
        title: '질문',
        count: `${question.total}건`,
        items: [
          {
            label: '스몰톡',
            value: `${question.smallTalk}건`,
            icon: <SmallTalkIcon />,
          },
          { label: 'RAG', value: `${question.rag}건`, icon: <DocsIcon /> },
        ],
      },
    ];
  };

  const renderStatusCards = () => (
    <StatusCardSection>
      {getStatusCardData().map((card, index) => (
        <StatusCard
          key={index}
          title={card.title}
          count={isLoading ? <Loading size={20} color={colors.Normal} /> : card.count}
          items={card.items}
        />
      ))}
    </StatusCardSection>
  );

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
          <DateFilter startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
          {renderStatusCards()}
          <Chart data={dashboardData?.result?.requestVolume || []} />
          <HistoryTableSection>
            <HistoryTable />
          </HistoryTableSection>
          <Footer />
        </ContentWrapper>
      </Content>
    </PageWrapper>
  );
}

function getTodayDate(): string {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return koreaTime.toISOString().replace('Z', '');
}

function getWeekAgoDate(): string {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const koreaTime = new Date(weekAgo.getTime() + 9 * 60 * 60 * 1000);
  return koreaTime.toISOString().replace('Z', '');
}

function formatDateForAPI(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 1158px;
  overflow-x: auto;
`;

const SideBarWrapper = styled.div`
  flex-shrink: 0;
  width: 280px;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  min-width: 1158px;
  padding: 0 36px;
  background-color: ${colors.background};
`;

const ContentWrapper = styled.div`
  max-width: 1158px;
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

const HistoryTableSection = styled.section`
  margin-top: 60px;
`;

const Footer = styled.footer`
  height: 40px;
`;
