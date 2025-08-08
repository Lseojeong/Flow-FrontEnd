export interface Department {
  departmentId: string;
  departmentName: string;
}

export interface DepartmentListResponse {
  code: string;
  message: string;
  result: {
    departmentList: Department[];
  };
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
