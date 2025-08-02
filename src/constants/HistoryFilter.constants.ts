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
