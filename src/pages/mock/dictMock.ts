import { Department } from '@/components/common/department/Department.types';

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
