

import { Department } from '@/components/common/department/Department.types';

export const dictMockData = [
  {
    id: 1,
    name: '카카오워크 용어사전',
    status: { green: 2, yellow: 3, red: 4 },
    documentCount: 12,
    lastModifiedDate: '2025.07.05',  
    departments: [
      { departmentId: '1', departmentName: '기술전략실' },
      { departmentId: '2', departmentName: 'B2B 사업부' },
    ] as Department[],
  },
  {
    id: 2,
    name: '제품번호',
    status: { green: 2, yellow: 3, red: 4 },
    documentCount: 8,
    lastModifiedDate: '2025.07.03',  
    departments: [
      { departmentId: '3', departmentName: '재무팀' },
    ] as Department[],
  },
];

