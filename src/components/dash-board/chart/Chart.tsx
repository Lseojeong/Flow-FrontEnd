import React from 'react';
import ReactECharts from 'echarts-for-react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';

interface ChartProps {
  data: { date?: string; time?: string; count?: number; requests?: number }[];
  isLoading?: boolean;
}

export const Chart: React.FC<ChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    date:
      item.date ||
      (item.time
        ? new Date(item.time.replace('Z', '')).toLocaleString('ko-KR', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : ''),
    count: item.count || item.requests || 0,
  }));

  console.log('Chart data:', data);
  console.log('Chart chartData:', chartData);

  const noData = chartData.length === 0;

  const option = {
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut',
    animationDelay: (idx: number) => idx * 80,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: colors.Normal,
      borderWidth: 1,
      borderRadius: 4,
      textStyle: {
        color: colors.Darker,
        fontSize: 13,
        fontWeight: fontWeight.Medium,
      },
      formatter: (params: Array<{ axisValue: string; data: number }>) => {
        const item = params[0];
        return `<div style="padding: 4px 0;">
          <div style="font-weight: 600; margin-bottom: 4px;">${item.axisValue}</div>
          <div style="display: flex; align-items: center;">
            <div style="width: 8px; height: 8px; background: ${colors.Normal}; border-radius: 50%; margin-right: 8px;"></div>
            요청 수: <strong style="margin-left: 4px;">${item.data}</strong>
          </div>
        </div>`;
      },
    },
    xAxis: {
      type: 'category',
      data: chartData.map((d) => d.date),
      boundaryGap: false,
      axisLabel: {
        color: colors.BoxText,
        fontSize: 12,
        fontWeight: 500,
        interval: 0,
        rotate: 45,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: colors.Darker,
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: colors.BoxText,
        fontSize: 12,
        fontWeight: 500,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: colors.GridLine,
          opacity: 0.6,
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: colors.Darker,
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: '요청 수',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: colors.Normal,
          borderColor: colors.White,
          borderWidth: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: colors.Light_active,
              },
              {
                offset: 1,
                color: `${colors.Light_active}1A`,
              },
            ],
          },
        },
        lineStyle: {
          color: colors.Normal,
          width: 3,
          shadowColor: `${colors.Normal}40`,
          shadowBlur: 8,
          shadowOffsetY: 2,
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowColor: colors.Normal,
            shadowBlur: 10,
            shadowOffsetY: 0,
          },
        },
        data: chartData.map((d) => d.count),
      },
    ],
    grid: {
      left: 48,
      right: 48,
      top: 40,
      bottom: 2,
      containLabel: true,
    },
    graphic: noData
      ? [
          {
            type: 'text',
            left: 'center',
            top: 'middle',
            style: {
              text: '데이터가 없습니다.',
              fontSize: 16,
              fill: colors.BoxText,
            },
          },
        ]
      : [],
  };

  return (
    <ChartContainer>
      <ChartTitle>요청량</ChartTitle>
      <ChartWrapper>
        <ReactECharts
          key={JSON.stringify(chartData)}
          option={option}
          style={{ height: 360, width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </ChartWrapper>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  border: 2px solid ${colors.Light_hover};
  border-radius: 4px;
  padding: 16px;
  background: ${colors.White};
  margin-top: 24px;
`;

const ChartTitle = styled.h2`
  font-size: 16px;
  font-weight: ${fontWeight.Bold};
  color: ${colors.Darker};
  margin-top: 16px;
  margin-left: 16px;
`;

const ChartWrapper = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;
