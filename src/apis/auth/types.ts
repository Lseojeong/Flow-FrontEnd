// 공통 API 응답 래퍼
export interface ApiResponse<T> {
  code: string;
  message: string;
  result: T;
}

// 관리자 회원가입
export interface AdminSignupRequest {
  name: string;
  adminId: string;
  password: string;
  passwordCheck: string;
  invitationToken: string;
}

// 로그인
export interface LoginRequest {
  adminId: string;
  password: string;
}

export interface CsrfTokenResult {
  csrfToken: string;
}

// 관리자 프로필 (백엔드 스키마 변동 가능성을 고려해 유연 타입으로 정의)
export type AdminProfile = Record<string, unknown>;
