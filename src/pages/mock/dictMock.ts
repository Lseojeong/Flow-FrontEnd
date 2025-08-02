import { Department } from '@/components/common/department/Department.types';
import { HistoryData } from '@/components/dash-board/historyTable/HistoryTable.types';

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
      },
      {
        id: 2,
        name: '카카오워크_API_명세서.pdf',
        status: 'Processing',
        manager: 'Jane',
        registeredAt: '2025.07.02',
        updatedAt: '2025.07.04',
      },
    ],
  },
];

export const historyMockData: HistoryData[] = [
  {
    version: 'v2.0.1',
    fileName: '채팅방1',
    modifier: 'kodari385(Milo)',
    timeStamp: '2025-07-11',
    work: '수정',
    description: '로그인 설정 변경',
  },
  {
    version: 'v1.0.0',
    fileName: 'flow 챗봇',
    modifier: 'kodari385(Milo)',
    timeStamp: '2025-07-11',
    work: '등록',
    description: '새 메뉴 추가',
  },
  {
    version: 'v2.0.2',
    fileName: '채팅방2',
    modifier: 'kodari385(Milo)',
    timeStamp: '2025-07-10',
    work: '삭제',
    description: '불필요한 파일 정리',
  },
  {
    version: 'v1.9.9',
    fileName: '사용자 가이드',
    modifier: 'kodari385(Milo)',
    timeStamp: '2025-07-09',
    work: '수정',
    description: '사용자 인터페이스 개선',
  },
  {
    version: 'v1.9.8',
    fileName: 'API 문서',
    modifier: 'kodari385(Milo)',
    timeStamp: '2025-07-08',
    work: '등록',
    description: '새로운 API 엔드포인트 추가',
  },
];

// HistoryFilter용 mock data (API 응답 형식)
export interface HistoryFilterData {
  menu: string;
  categoryList: {
    category: string;
    fileList: string[];
  }[];
}

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
