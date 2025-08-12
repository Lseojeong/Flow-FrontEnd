export interface ApiResponse<T> {
  code: string;
  message: string;
  result: T;
}

export interface AdminSignupRequest {
  name: string;
  adminId: string;
  password: string;
  passwordCheck: string;
  invitationToken: string;
}

export interface LoginRequest {
  adminId: string;
  password: string;
}

export interface CsrfTokenResult {
  csrfToken: string;
}

export interface AdminProfile {
  adminId: string;
  permission: 'ROOT' | 'GENERAL';
  organizationId: string;
  departmentId: string;
}
