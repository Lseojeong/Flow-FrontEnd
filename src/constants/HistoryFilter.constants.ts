import { HistoryMenu } from '@/components/dash-board/history-filter/HistoryFilter.types';

export const MOCK_MENU_LIST: HistoryMenu[] = [
  {
    menu: '용어사전',
    categoryList: [
      {
        category: '카테고리명1',
        fileList: ['파일명1', '파일명2'],
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
    ],
  },
  {
    menu: 'FAQ',
    categoryList: [
      {
        category: 'FAQ카테고리1',
        fileList: ['파일명6'],
      },
    ],
  },
];

export const MSG = {
  selectMenu: '메뉴를 먼저 선택하세요',
  noCategory: '카테고리 없음',
  selectCategory: '카테고리를 먼저 선택하세요',
  noFile: '파일 없음',
} as const;

// 파일 이름 길이 제한
export const truncateFileName = (fileName: string, maxLength: number = 10) => {
  if (fileName.length <= maxLength) return fileName;
  return fileName.substring(0, maxLength) + '...';
};
