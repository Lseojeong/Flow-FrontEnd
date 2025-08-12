export interface Department {
  departmentId: string;
  departmentName: string;
}

export interface DepartmentSetting {
  departmentId: string;
  departmentName: string;
  adminCount: number;
  categoryCount: number;
}

export interface DepartmentSettingListResponse {
  code: string;
  message: string;
  result: {
    organizationName: string;
    departmentList: Array<{
      departmentId: string;
      departmentName: string;
      adminCount: number | string;
      categoryCount: number | string;
    }>;
  };
}

export interface CreateDepartmentsRequest {
  departmentList: string[];
}

export interface CreateDepartmentsResponse {
  code: string;
  message: string;
  result: string;
}

export interface UpdateDepartmentRequest {
  departmentId: string;
  newName: string;
}

export interface UpdateDepartmentResponse {
  code: string;
  message: string;
  result: {
    departmentId: string;
    oldDepartmentName: string;
    newDepartmentName: string;
  };
}

export interface DeleteDepartmentRequest {
  departmentId: string;
}

export interface DeleteDepartmentResponse {
  code: string;
  message: string;
  result: {
    deletedDepartmentId: string;
  };
}

export interface DuplicateDepartmentError {
  code: string;
  message: string;
  result: {
    duplicateDepartmentNames: string[];
  };
}

export interface DepartmentListResponse {
  code: string;
  message: string;
  result: {
    departmentList: Array<{
      departmentId: string;
      departmentName: string;
    }>;
  };
}
