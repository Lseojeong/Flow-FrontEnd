export interface Admin {
  id: string;
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
  id: string;
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

export interface InviteAdminRequest {
  email: string;
  departmentId: string;
}

export interface InviteAdminResponse {
  code: string;
  message: string;
  result: string;
}

export interface InviteAdminErrorResponse {
  code: string;
  message: string;
  result: {
    email: string;
    departmentName: string;
    departmentId: string;
  }[];
}

export interface DeleteAdminResponse {
  code: string;
  message: string;
  result: Record<string, never>;
}
