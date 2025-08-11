import { axiosInstance } from '@/apis/axiosInstance';

export type FolderType = 'faqs' | 'docs' | 'dict' | 'others';

export interface CreatePresignedUrlBody {
  fileName: string;
  fileSize: number;
  folderType: FolderType;
  organizationId: string;
  contentType?: string;
}

export interface CreatePresignedUrlResult {
  fileUrl: string; // presigned PUT URL
  fileKey: string;
}

export interface CreatePresignedUrlResponse {
  code: string;
  message: string;
  result: CreatePresignedUrlResult;
}

// Presigned URL 발급 API
export const createPresignedUrl = (body: CreatePresignedUrlBody) => {
  console.log('[API 요청] Presigned URL 발급', body);
  return axiosInstance.post<CreatePresignedUrlResponse>('/admin/files/url', body);
};

// 확장자 → Content-Type 매핑
function getContentTypeByExt(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.pdf')) return 'application/pdf';
  return 'application/octet-stream';
}

// Presigned URL 기반 Public URL 생성 (쿼리스트링 제거)
export function buildPublicUrlFromPresigned(presignedUrl: string): string {
  try {
    const urlObj = new URL(presignedUrl);
    urlObj.search = ''; // ? 이후 제거
    return urlObj.toString();
  } catch {
    return presignedUrl;
  }
}

// Presigned URL에 PUT 업로드
export const putFileToPresignedUrl = async (url: string, file: File, contentType?: string) => {
  console.log('=== putFileToPresignedUrl 호출됨 ===');
  console.log('PUT 업로드 URL:', url);
  console.log('PUT 요청 헤더:', {
    'Content-Type': contentType || file.type || 'application/octet-stream',
  });
  console.log('PUT 업로드 파일 정보:', { name: file.name, size: file.size, type: file.type });

  const res = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': contentType || file.type || 'application/octet-stream',
    },
  });

  console.log('업로드 응답 상태:', res.status, res.statusText);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('업로드 실패 응답 본문:', text);
    throw new Error(`파일 업로드 실패: ${res.statusText}`);
  }

  console.log('=== 파일 업로드 성공 ===');
};

export interface UploadViaPresignedArgs {
  file: File;
  folderType: FolderType;
  organizationId: string;
  categoryId?: string;
  fileName?: string;
  contentType?: string;
}

export interface UploadViaPresignedResult {
  presignedPutUrl: string;
  fileKey: string;
  publicUrl: string;
  originalFileName: string;
}

// presigned URL 발급 + 파일 업로드
export async function uploadViaPresigned({
  file,
  folderType,
  organizationId,
  fileName,
  contentType,
}: UploadViaPresignedArgs): Promise<UploadViaPresignedResult> {
  console.log('=== uploadViaPresigned 시작 ===');

  const rawName =
    fileName ||
    (file instanceof File
      ? file.name
      : (() => {
          throw new Error('fileName is required for Blob');
        })());
  const name = rawName.split(/[/\\]/).pop() || rawName;
  const mime = contentType || getContentTypeByExt(name);

  console.log('[1] Presigned URL 발급 요청 데이터:', {
    fileName: name,
    fileSize: file.size,
    folderType,
    organizationId,
    contentType: mime,
  });

  // presigned URL 발급
  const presigned = await createPresignedUrl({
    fileName: name,
    fileSize: file.size,
    folderType,
    organizationId,
    contentType: mime,
  });

  console.log('[1-응답] Presigned URL 발급 성공:', presigned.data);

  const presignedPutUrl = presigned.data.result.fileUrl;
  const fileKey = presigned.data.result.fileKey;

  console.log('[2] Presigned URL:', presignedPutUrl);

  // presigned URL로 PUT 업로드
  console.log('[3] 파일 PUT 업로드 시작');
  await putFileToPresignedUrl(presignedPutUrl, file, mime);

  // Public URL 생성
  const publicUrl = buildPublicUrlFromPresigned(presignedPutUrl);
  console.log('[4] Public URL 생성 완료:', publicUrl);
  console.log('=== uploadViaPresigned 완료 ===');

  return {
    presignedPutUrl,
    fileKey,
    publicUrl,
    originalFileName: name,
  };
}

export interface RegisterFileBody {
  categoryId: string;
  fileKey: string;
  fileName: string;
}

export const registerFileByFolderType = (folderType: FolderType, body: RegisterFileBody) => {
  let endpoint = '';
  switch (folderType) {
    case 'dict':
      endpoint = '/admin/dict/files';
      break;
    case 'docs':
      endpoint = '/admin/docs/files';
      break;
    case 'faqs':
      endpoint = '/admin/faqs/files';
      break;
    default:
      throw new Error(`folderType ${folderType}는 지원되지 않습니다.`);
  }
  console.log(`[API 요청] ${folderType} 파일 등록`, body);
  return axiosInstance.post(endpoint, body);
};

export interface UploadAndRegisterArgs extends UploadViaPresignedArgs {
  categoryId: string; // ✅ 필수
}

// 업로드 후 DB 등록까지
export async function uploadAndRegisterFile({
  file,
  folderType,
  organizationId,
  categoryId,
  fileName,
  contentType,
}: UploadAndRegisterArgs) {
  console.log('=== uploadAndRegisterFile 시작 ===');

  if (!categoryId) {
    throw new Error('categoryId가 없습니다. 업로드 전에 카테고리를 선택하세요.');
  }

  // 1. presigned URL 발급 + 업로드
  const { fileKey, publicUrl, presignedPutUrl } = await uploadViaPresigned({
    file,
    folderType,
    organizationId,
    fileName,
    contentType,
  });

  // 2. 파일명 추출
  const cleanFileName = (() => {
    try {
      const urlObj = new URL(presignedPutUrl);
      urlObj.search = '';
      return decodeURIComponent(urlObj.pathname.split('/').pop() || file.name);
    } catch {
      return file.name;
    }
  })();

  console.log('[추출된 파일명]', cleanFileName);

  // 3. DB 등록 (folderType별 API 자동 선택)
  const dbRes = await registerFileByFolderType(folderType, {
    categoryId,
    fileKey,
    fileName: cleanFileName,
  });

  console.log('[3] DB 등록 완료:', dbRes.data);

  return {
    publicUrl,
    fileKey,
    dbResponse: dbRes.data,
  };
}
