import { Department } from '@/components/common/department/Department.types';

/**
 * 부서 이름 배열을 부서 ID 배열로 변환하는 유틸리티 함수
 * @param departmentNames - 부서 이름 배열
 * @param departments - 전체 부서 목록
 * @returns 부서 ID 배열
 */
export const convertDepartmentNamesToIds = (
  departmentNames: string[],
  departments: Department[]
): string[] => {
  return departmentNames.map((deptName) => {
    const dept = departments.find(
      (d: { departmentId: string; departmentName: string }) => d.departmentName === deptName
    );
    return dept?.departmentId || deptName;
  });
};

/**
 * 부서 ID 배열을 부서 이름 배열로 변환하는 유틸리티 함수
 * @param departmentIds - 부서 ID 배열
 * @param departments - 전체 부서 목록
 * @returns 부서 이름 배열
 */
export const convertDepartmentIdsToNames = (
  departmentIds: string[],
  departments: Department[]
): string[] => {
  return departmentIds.map((deptId) => {
    const dept = departments.find(
      (d: { departmentId: string; departmentName: string }) => d.departmentId === deptId
    );
    return dept?.departmentName || deptId;
  });
};
