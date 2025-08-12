import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDocsCategory, updateDocsCategory, deleteDocsCategories } from './api';
import type {
  DocsCategoryCreateRequest,
  DocsCategoryUpdateRequest,
  DocsCategoryDeleteRequest,
} from './types';

export const useCreateDocsCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DocsCategoryCreateRequest) => createDocsCategory(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['docs-categories'] });

      if (response.data.result) {
        queryClient.setQueryData(['docs-category', response.data.result.id], response.data.result);
      }
    },
  });
};

export const useUpdateDocsCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: DocsCategoryUpdateRequest }) =>
      updateDocsCategory(categoryId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['docs-categories'] });

      if (response.data.result) {
        queryClient.setQueryData(['docs-category', variables.categoryId], response.data.result);
      }
    },
  });
};

export const useDeleteDocsCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DocsCategoryDeleteRequest) => deleteDocsCategories(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['docs-categories'] });

      variables.categoryIdList.forEach((categoryId) => {
        queryClient.removeQueries({ queryKey: ['docs-category', categoryId] });
      });
    },
  });
};
