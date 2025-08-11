import { axiosInstance } from '@/apis/axiosInstance';

export type FolderType = 'faqs' | 'docs' | 'dict' | 'others';

export interface CreatePresignedUrlBody {
  fileName: string;
  fileSize: number;
  folderType: FolderType;
  organizationId: string;
  contentType?: string; // Content-Type 추가
}

export interface CreatePresignedUrlResult {
  fileUrl: string;
  fileKey: string;
}

export interface CreatePresignedUrlResponse {
  code: string;
  message: string;
  result: CreatePresignedUrlResult;
}

export const createPresignedUrl = (body: CreatePresignedUrlBody) =>
  axiosInstance.post<CreatePresignedUrlResponse>('/admin/files/url', body);

export const PUBLIC_OBJECT_BASE =
  'https://objectstorage.kr-central-2.kakaocloud.com/v1/8b70d156b8334e4fb16a680a47e8dc79/flow-file-bucket/';

export function extractFileKeyFromPresignedUrl(presignedUrl: string): string {
  try {
    const url = new URL(presignedUrl);
    const marker = '/flow-file-bucket/';
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return '';
    return url.pathname.substring(idx + marker.length);
  } catch {
    return '';
  }
}

export function buildPublicUrlFromKey(fileKey: string): string {
  return `${PUBLIC_OBJECT_BASE}${fileKey}`;
}

// 확장자 → Content-Type 매핑
function getContentTypeByExt(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.pdf')) return 'application/pdf';
  return 'application/octet-stream';
}

export const putFileToPresignedUrl = async (url: string, file: File, contentType?: string) => {
  console.log('=== putFileToPresignedUrl 호출됨 ===');
  console.log('업로드 URL:', url);
  console.log('파일 정보:', {
    name: file.name,
    size: file.size,
    type: file.type,
  });
  console.log('Content-Type:', contentType || file.type || 'application/octet-stream');

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
  fileName?: string;
  contentType?: string;
}

export interface UploadViaPresignedResult {
  presignedPutUrl: string;
  fileKey: string;
  publicUrl: string;
}

export async function uploadViaPresigned({
  file,
  folderType,
  organizationId,
  fileName,
  contentType,
}: UploadViaPresignedArgs): Promise<UploadViaPresignedResult> {
  console.log('=== uploadViaPresigned 시작 ===');
  console.log('파라미터:', { file, folderType, organizationId, fileName, contentType });

  try {
    const name =
      fileName ||
      (file instanceof File
        ? file.name
        : (() => {
            throw new Error('fileName is required for Blob');
          })());

    // Content-Type 결정 (인자 우선, 없으면 확장자 기반)
    const mime = contentType || getContentTypeByExt(name);
    console.log('[1] 결정된 MIME 타입:', mime);

    // presigned URL 발급 시 Content-Type 포함
    console.log('[2] Presigned URL 발급 요청 시작');
    const uuidFile = `${crypto.randomUUID()}_${name}`;

    const presigned = await createPresignedUrl({
      fileName: uuidFile,
      fileSize: file.size,
      folderType,
      organizationId,
      contentType: mime,
    });
    console.log('[3] Presigned URL 발급 결과:', presigned.data);

    const { fileUrl: presignedPutUrl } = presigned.data.result;
    console.log('[4] Presigned PUT URL:', presignedPutUrl);

    console.log('[5] 파일 PUT 업로드 시작');
    await putFileToPresignedUrl(presignedPutUrl, file, mime);

    console.log('[6] fileKey 추출 시작');
    const fileKey = extractFileKeyFromPresignedUrl(presignedPutUrl);
    console.log('[7] 추출된 fileKey:', fileKey);

    const publicUrl = buildPublicUrlFromKey(fileKey);
    console.log('[8] Public URL:', publicUrl);

    console.log('=== uploadViaPresigned 완료 ===');
    return { presignedPutUrl, fileKey, publicUrl };
  } catch (error) {
    console.error('❌ [ERROR] uploadViaPresigned 실패:', error);
    throw error; // 호출부에서도 캐치 가능하도록 다시 던짐
  }
}
