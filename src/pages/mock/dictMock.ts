import { Department } from '@/components/common/department/Department.types';
import { HistoryData } from '@/components/dash-board/historyTable/HistoryTable.types';
import { HistoryMenu } from '@/apis/dash-board/types';

const duplicatedDicts = Array.from({ length: 40 }, (_, index) => ({
  id: index + 2,
  name: `카카오워크 용어사전 ${index + 2}`,
  description:
    '카카오워크는 익숙하면서도 안전하게, 온라인과 오프라인의 구분 없이 어디서나 빠른 협업을 할 수 있도록 최신 기술과 AI 기술을 활용',
  status: {
    total: 9,
    completed: 2,
    processing: 3,
    fail: 4,
  },
  documentCount: 12,
  createdAt: `2025-07-${String((index % 28) + 1).padStart(2, '0')}T10:30:00`,
  updatedAt: `2025-07-${String((index % 28) + 1).padStart(2, '0')}T10:30:00`,
  registeredDate: `2025.07.${String((index % 28) + 1).padStart(2, '0')}`,
  lastModified: `2025.07.${String((index % 28) + 2).padStart(2, '0')}`,
  lastEditor: 'Milo',
  lastModifiedDate: `2025.07.${String((index % 28) + 2).padStart(2, '0')}`,
  departments: [
    { departmentId: '1', departmentName: '기술전략실' },
    { departmentId: '2', departmentName: 'B2B 사업부' },
    { departmentId: '2', departmentName: 'B2B 사업부' },
    { departmentId: '2', departmentName: 'B2B 사업부' },
    { departmentId: '2', departmentName: 'B2B 사업부' },
  ] as Department[],
  files: [] as DictFile[],
}));

export const dictMockData = [
  {
    id: 1,
    name: '카카오워크 용어사전',
    description:
      '카카오워크는 익숙하면서도 안전하게, 온라인과 오프라인의 구분 없이 어디서나 빠른 협업을 할 수 있도록 최신 기술과 AI 기술을 활용',
    status: {
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
      { departmentId: '2', departmentName: 'B2B 사업부' },
      { departmentId: '2', departmentName: 'B2B 사업부' },
      { departmentId: '2', departmentName: 'B2B 사업부' },
    ] as Department[],
    files: [
      {
        id: 1,
        name: '카카오워크_기능_정의서.pdf',
        status: 'Completed',
        manager: 'kodari385(Milo)',
        registeredAt: '2025.07.05 16:30',
        updatedAt: '2025.07.05 16:30',
        version: '1.0.0',
      },
      {
        id: 2,
        name: '카카오워크_API_명세서.pdf',
        status: 'Processing',
        manager: 'Jane',
        registeredAt: '2025.07.05 16:30',
        updatedAt: '2025.07.05 16:30',
        version: '1.0.0',
      },
      {
        id: 3,
        name: '카카오워크_UI_가이드.pdf',
        status: 'Completed',
        manager: 'Tom',
        registeredAt: '2025.07.06 10:00',
        updatedAt: '2025.07.06 10:00',
        version: '1.0.1',
      },
      {
        id: 4,
        name: '카카오워크_보안정책_요약.pdf',
        status: 'Fail',
        manager: 'Alice',
        registeredAt: '2025.07.06 11:00',
        updatedAt: '2025.07.06 11:00',
        version: '1.0.1',
      },
      {
        id: 5,
        name: '카카오워크_서버_구조도.pdf',
        status: 'Processing',
        manager: 'Bob',
        registeredAt: '2025.07.07 09:30',
        updatedAt: '2025.07.07 09:30',
        version: '1.1.0',
      },
      {
        id: 6,
        name: '카카오워크_이용약관.pdf',
        status: 'Completed',
        manager: 'Emma',
        registeredAt: '2025.07.07 14:15',
        updatedAt: '2025.07.07 14:15',
        version: '2.0.0',
      },
      {
        id: 7,
        name: '카카오워크_서비스_흐름도.pdf',
        status: 'Completed',
        manager: 'Leo',
        registeredAt: '2025.07.08 09:00',
        updatedAt: '2025.07.08 09:00',
        version: '2.1.0',
      },
      {
        id: 8,
        name: '카카오워크_서버_구조도.pdf',
        status: 'Processing',
        manager: 'Bob',
        registeredAt: '2025.07.07 09:30',
        updatedAt: '2025.07.07 09:30',
        version: '1.1.0',
      },
      {
        id: 9,
        name: '카카오워크_이용약관.pdf',
        status: 'Completed',
        manager: 'Emma',
        registeredAt: '2025.07.07 14:15',
        updatedAt: '2025.07.07 14:15',
        version: '2.0.0',
      },
      {
        id: 10,
        name: '카카오워크_서비스_흐름도.pdf',
        status: 'Completed',
        manager: 'Leo',
        registeredAt: '2025.07.08 09:00',
        updatedAt: '2025.07.08 09:00',
        version: '2.1.0',
      },
      ...Array.from({ length: 40 }, (_, i) => ({
        id: i + 11,
        name: `카카오워크_문서_${i + 11}.pdf`,
        status: i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'Processing' : 'Fail',
        manager: i % 4 === 0 ? 'Milo' : i % 4 === 1 ? 'Jane' : i % 4 === 2 ? 'Leo' : 'Emma',
        registeredAt: `2025.07.${String((i % 28) + 1).padStart(2, '0')} 10:00`,
        updatedAt: `2025.07.${String((i % 28) + 1).padStart(2, '0')} 10:00`,
        version: `1.${Math.floor(i / 10)}.${i % 10}`,
      })),
    ],
  },
  ...duplicatedDicts,
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

export const historyFilterMockData: HistoryMenu[] = [
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
  { date: '2025-01-01', count: 100 },
  { date: '2025-01-02', count: 200 },
  { date: '2025-01-03', count: 300 },
  { date: '2025-01-04', count: 100 },
  { date: '2025-01-05', count: 500 },
  { date: '2025-01-06', count: 600 },
  { date: '2025-01-07', count: 100 },
  { date: '2025-01-08', count: 800 },
  { date: '2025-01-09', count: 900 },
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
  fileUrl?: string;
}

export const MOCK_DEPARTMENTS: Department[] = [
  {
    departmentId: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
    departmentName: '고객지원팀',
  },
  {
    departmentId: 'b2c3d4e5-f6a1-8901-bcda-2345678901bc',
    departmentName: '기술지원팀',
  },
  {
    departmentId: 'c3d4e5f6-a1b2-9012-cdab-3456789012cd',
    departmentName: '마케팅팀',
  },
  {
    departmentId: 'd4e5f6a1-b2c3-0123-abcd-4567890123de',
    departmentName: '인사팀',
  },
  {
    departmentId: 'e5f6a1b2-c3d4-1234-bcda-5678901234ef',
    departmentName: '재무팀',
  },
  {
    departmentId: 'f6a1b2c3-d4e5-2345-abcd-6789012345fg',
    departmentName: '회계팀',
  },
];

export const mockUsers = [
  {
    id: 'kodari385',
    nickname: 'Milo',
    departmentName: '재무팀',
    createdAt: '2025.07.05 16:30',
  },
  {
    id: 'kodar385',
    nickname: 'Milo',
    departmentName: '회계팀',
    createdAt: '2025.07.05 16:30',
  },
];

export const mockDepartments = [
  {
    id: '1',
    name: '기술전략실',
    managerCount: 3,
    categoryCount: 10,
  },
  {
    id: '2',
    name: '마케팅팀',
    managerCount: 2,
    categoryCount: 1,
  },
];

export const getPaginatedFilesData = (page = 1, size = 5) => {
  const files = dictMockData[0].files;
  const start = (page - 1) * size;
  const end = start + size;

  const sliced = files.slice(start, end);

  return {
    code: '200',
    result: {
      historyList: sliced,
      pagination: {
        last: end >= files.length,
      },
    },
  };
};
export const getPaginatedCategoriesData = (page = 1, size = 5) => {
  const start = (page - 1) * size;
  const end = start + size;
  const sliced = dictMockData.slice(start, end);

  return {
    code: '200',
    result: {
      historyList: sliced,
      pagination: {
        last: end >= dictMockData.length,
      },
    },
  };
};

export interface DictCategory {
  id: number;
  name: string;
  description: string;
  status: {
    total: number;
    completed: number;
    processing: number;
    fail: number;
  };
  documentCount: number;
  lastModifiedDate: string;
  departments?: {
    departmentId: string;
    departmentName: string;
  }[];
}
