export interface Admin {
  adminId: string;
  name: string;
  createdAt: string;
}

export interface DepartmentWithAdmins {
  departmentName: string;
  admin: Admin[];
}

export interface Department {
  departmentId: string;
  departmentName: string;
}

export interface UserSettingResponse {
  code: string;
  message: string;
  result: {
    organizationName: string;
    departmentList: DepartmentWithAdmins[];
  };
}

export interface DepartmentListResponse {
  code: string;
  message: string;
  result: {
    departmentList: Department[];
  };
}

export interface ChangeAdminDepartmentRequest {
  adminId: string;
  newDepartmentId: string;
}

export interface ChangeAdminDepartmentResponse {
  code: string;
  message: string;
  result: {
    adminId: string;
    adminName: string;
    oldDepartmentName: string;
    newDepartmentName: string;
  };
}
