// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createDepartments } from './api';
// import { CreateDepartmentsRequest } from './type';

// export const useCreateDepartments = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: CreateDepartmentsRequest) => createDepartments(data),
//     onSuccess: () => {
//       // 부서 생성 성공 시 부서 목록을 다시 조회
//       queryClient.invalidateQueries({ queryKey: ['departmentList'] });
//     },
//     onError: (error) => {
//       console.error('부서 생성 실패:', error);
//     },
//   });
// };
