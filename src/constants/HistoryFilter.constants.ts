import {
  MenuItem,
  CategoryItem,
  FileItem,
} from '@/components/dash-board/history-filter/HistoryFilter.types';

// ===== 더미 데이터 =====
export const MENU_LIST: MenuItem[] = [
  { id: 'dictionary', label: '용어사전' },
  { id: 'docs', label: '사내문서' },
  { id: 'faq', label: 'FAQ' },
];

export const CATEGORY_MAP: Record<string, CategoryItem[]> = {
  dictionary: [
    { id: 'dict-cat-1', label: 'IT용어' },
    { id: 'dict-cat-2', label: '경영용어' },
  ],
  docs: [
    { id: 'docs-cat-1', label: '인사문서' },
    { id: 'docs-cat-2', label: '재무문서' },
  ],
  faq: [],
};

export const FILE_MAP: Record<string, FileItem[]> = {
  'dict-cat-1': [
    { id: 'file-1', label: 'IT용어집.pdf' },
    { id: 'file-2', label: 'IT트렌드.docx' },
  ],
  'dict-cat-2': [{ id: 'file-3', label: '경영용어집.pdf' }],
  'docs-cat-1': [{ id: 'file-4', label: '인사규정.docx' }],
  'docs-cat-2': [{ id: 'file-5', label: '재무보고서.pdf' }],
};

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
