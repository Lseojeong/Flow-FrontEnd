import { axiosInstance } from '@/apis/axiosInstance';

export type FolderType = 'faq' | 'docs' | 'dict' | 'others';

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
  return axiosInstance.post<CreatePresignedUrlResponse>('/admin/files/url', body);
};

// 확장자 → Content-Type 매핑
function getContentTypeByExt(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.pdf')) return 'application/pdf';
  return 'application/octet-stream';
}

// S3 버킷 URL과 fileKey를 조합하여 Public URL 생성
export function buildPublicUrlFromFileKey(fileKey: string): string {
  return `https://flow-file-bucket.s3.ap-northeast-2.amazonaws.com/${fileKey}`;
}

// Presigned URL 기반 Public URL 생성 (쿼리스트링 제거) - 기존 호환성 유지
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
  const res = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': contentType || file.type || 'application/octet-stream',
    },
  });

  if (!res.ok) {
    throw new Error(`파일 업로드 실패: ${res.statusText}`);
  }
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
  const rawName =
    fileName ||
    (file instanceof File
      ? file.name
      : (() => {
          throw new Error('fileName is required for Blob');
        })());
  const name = rawName.split(/[/\\]/).pop() || rawName;
  const mime = contentType || getContentTypeByExt(name);

  // presigned URL 발급
  const presigned = await createPresignedUrl({
    fileName: name,
    fileSize: file.size,
    folderType,
    organizationId,
    contentType: mime,
  });

  const presignedPutUrl = presigned.data.result.fileUrl;
  const fileKey = presigned.data.result.fileKey;

  // presigned URL로 PUT 업로드
  await putFileToPresignedUrl(presignedPutUrl, file, mime);

  // Public URL 생성 (S3 버킷 URL + fileKey)
  const publicUrl = buildPublicUrlFromFileKey(fileKey);

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
    case 'faq':
      endpoint = '/admin/faqs/files';
      break;
    default:
      throw new Error(`folderType ${folderType}는 지원되지 않습니다.`);
  }
  return axiosInstance.post(endpoint, body);
};

export interface UploadAndRegisterArgs extends UploadViaPresignedArgs {
  categoryId: string;
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

  // 3. DB 등록 (folderType별 API 자동 선택)
  const dbRes = await registerFileByFolderType(folderType, {
    categoryId,
    fileKey,
    fileName: cleanFileName,
  });

  return {
    publicUrl,
    fileKey,
    dbResponse: dbRes.data,
  };
}
