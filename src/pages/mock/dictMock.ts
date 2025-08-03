import { Department } from '@/components/common/department/Department.types';
import { HistoryData } from '@/components/dash-board/historyTable/HistoryTable.types';
import { HistoryFilterData } from '@/components/dash-board/history-filter/HistoryFilter.types';



export const dictMockData = [
  {
    id: 1,
    name: '카카오워크 용어사전',
    description: '카카오워크 관련 FAQ입니다.',
    status: {
      green: 2,
      yellow: 3,
      red: 4,
      total: 9,
      completed: 2,
      processing: 3,
      fail: 4,
    },
    documentCount: 12,
    createdAt: '2025-07-15T10:30:00',
    updatedAt: '2025-07-15T10:30:00',
    registeredDate: '2025.07.01',
    lastModified: '2025.07.05',
    lastEditor: 'Milo',
    lastModifiedDate: '2025.07.05',
    departments: [
      { departmentId: '1', departmentName: '기술전략실' },
      { departmentId: '2', departmentName: 'B2B 사업부' },
    ] as Department[],
    files: [
      {
        id: 1,
        name: '카카오워크_기능_정의서.pdf',
        status: 'Completed',
        manager: 'Milo',
        registeredAt: '2025.07.01',
        updatedAt: '2025.07.05',
        version: '1.0.0'
      },
      {
        id: 2,
        name: '카카오워크_API_명세서.pdf',
        status: 'Processing',
        manager: 'Jane',
        registeredAt: '2025.07.02',
        updatedAt: '2025.07.04',
        version: '1.0.0'
      },
    ],
  },
];

const baseData: HistoryData[] = [
  {
    version: 'v2.0.1',
    fileName: '채팅방1',
    modifier: 'kodari385(Milo)',
    timeStamp: '2025.07.05 16:30',
    work: '수정',
    description: '로그인 설정 변경',
  },
  {
    version: 'v1.0.0',
    fileName: 'flow 챗봇',
    modifier: 'kodari385(Milo)',
    timeStamp: '2025.07.11 10:00',
    work: '등록',
    description: '새 메뉴 추가',
  },
  {
    version: 'v2.0.2',
    fileName: '채팅방2',
    modifier: 'kodari385(Milo)',
    timeStamp: '2025.07.10 15:00',
    work: '삭제',
    description: '불필요한 파일 정리',
  },
  {
    version: 'v1.9.9',
    fileName: '사용자 가이드',
    modifier: 'kodari385(Milo)',
    timeStamp: '2025.07.09 12:00',
    work: '수정',
    description: '사용자 인터페이스 개선',
  },
  {
    version: 'v1.9.8',
    fileName: 'API 문서',
    modifier: 'kodari385(Milo)',
    timeStamp: '2025.07.08 14:00',
    work: '등록',
    description: '새로운 API 엔드포인트 추가',
  },
];


export const historyMockData: HistoryData[] = Array(40)
  .fill(null)
  .flatMap(() => baseData); 

export const historyFilterMockData: HistoryFilterData[] = [
  {
    menu: '용어사전',
    categoryList: [
      {
        category: '카테고리명1',
        fileList: ['파일명1', '파일명2'],
      },
      {
        category: '카테고리명2',
        fileList: ['파일명3', '파일명4'],
      },
    ],
  },
  {
    menu: '사내문서',
    categoryList: [
      {
        category: '사내카테고리1',
        fileList: ['파일명5'],
      },
      {
        category: '사내카테고리2',
        fileList: ['파일명6', '파일명7'],
      },
    ],
  },
  {
    menu: 'FAQ',
    categoryList: [
      {
        category: '일반',
        fileList: ['FAQ 문서'],
      },
    ],
  },
];

export const chartData = [
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

export const mockApiResponse = {
  status: {
    total: 9,
    completed: 2,
    processing: 3,
    fail: 4,
  },
  responseTime: {
    unit: 'seconds',
    average: 0.8,
    fastest: 0.3,
    slowest: 1.0,
  },
  contentBreakdown: {
    total: 73,
    dictionary: 27,
    documentary: 23,
    faq: 23,
  },
  queryBreakdown: {
    total: 50,
    smallTalk: 27,
    rag: 23,
  },
};

export const mockData = [
  { spaceId: 265262, spaceName: '썬더일레븐' },
  { spaceId: 265263, spaceName: '개발팀' },
  { spaceId: 265264, spaceName: 'QA팀' },
  { spaceId: 265265, spaceName: '마케팅팀' },
];


export const getPaginatedHistoryData = (page: number = 1, size: number = 15) => {
  const total = 100;
  const start = (page - 1) * size;
  const end = start + size;

  const workOptions = ['등록', '수정']; 

  const mockScrollHistoryData: HistoryData[] = Array.from({ length: total }, (_, i) => ({
    version: `v1.${Math.floor(i / 10)}.${i % 10}`,
    fileName: i % 2 === 0 ? '카카오워크_기능_정의서.pdf' : '카카오워크_API_명세서.pdf',
    modifier: i % 3 === 0 ? 'Milo' : 'Jane',
    timeStamp: `2025.07.${String((i % 28) + 1).padStart(2, '0')} ${String(9 + (i % 10)).padStart(2, '0')}:00`,
    work: workOptions[i % 2], 
    description: workOptions[i % 2] === '등록' ? '신규 문서 업로드' : '내용 수정 반영',
  }));

  const sliced = mockScrollHistoryData.slice(start, end);
  const totalPage = Math.ceil(total / size);

  return {
    code: '200',
    message: '히스토리 조회 성공',
    result: {
      historyList: sliced,
      pagination: {
        last: end >= total,
        page,
        size,
        totalElement: total,
        totalPage,
      },
    },
  };
};



export interface DictFile {
  id: number;
  name: string;
  status: string;
  manager: string;
  registeredAt: string;
  updatedAt: string;
  version: string;
}