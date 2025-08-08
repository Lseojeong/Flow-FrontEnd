export interface Admin {
  name: string;
  adminId: string;
  createdAt: string;
}

export interface DepartmentWithAdmins {
  departmentName: string;
  admin: Admin[];
}

export interface UserSettingResponse {
  code: string;
  message: string;
  result: {
    organizationName: string;
    departmentList: DepartmentWithAdmins[];
  };
}
