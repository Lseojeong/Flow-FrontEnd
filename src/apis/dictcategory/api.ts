import { axiosInstance } from '@/apis/axiosInstance';

interface SearchParams {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  cursor?: string;
}

// 전체 카테고리 목록
export const getAllDictCategories = async (cursor?: string) => {
  const res = await axiosInstance.get('/admin/dict/categories', {
    params: cursor ? { cursor } : {},
  });
  return res;
};

// 조건 검색
export const searchDictCategories = async (params: SearchParams) => {
  return axiosInstance.get('/admin/dict/categories/search', {
    params,
  });
};
// 단일 카테고리 조회
export const getDictCategoryById = (categoryId: string) => {
  return axiosInstance.get(`/admin/dict/categories/${categoryId}`);
};

// 카테고리 생성
export const createDictCategory = (body: { name: string; description: string }) => {
  return axiosInstance.post('/admin/dict/categories', body);
};

// 카테고리 수정
export const updateDictCategory = (
  categoryId: string,
  body: {
    name: string;
    description: string;
  }
) => {
  return axiosInstance.put(`/admin/dict/categories/${categoryId}`, body);
};

// 카테고리 삭제 (배열로 전달)
export const deleteDictCategories = (categoryList: string[]) => {
  return axiosInstance.delete('/admin/dict/categories', {
    data: { categoryList },
  });
};
