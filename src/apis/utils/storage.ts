export type FolderType = 'dict' | 'faqs' | 'docs';

export interface PresignedRequestBody {
  fileName: string;
  fileSize: number;
  folderType: FolderType;
  organizationId: string;
}

export interface RegisterFileBody {
  fileUrl: string;
  /** 원본 파일 이름 (예: "document.pdf") */
  fileName: string;
  /** 설명(예: "사내문서 v1.1.0") */
  description: string;
  /** 버전(예: "v1.0.0") */
  version: string;
}

/** 업로드 허용 확장자 규칙 */
const ALLOWED_EXT: Record<FolderType, ReadonlyArray<string>> = {
  dict: ['.csv'],
  faqs: ['.pdf'],
  docs: ['.pdf'],
} as const;

/** 확장자 → Content-Type 매핑 */
function getContentTypeByExt(fileName: string): 'text/csv' | 'application/pdf' {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.csv')) return 'text/csv';
  // 기본은 pdf
  return 'application/pdf';
}

/** 파일 이름에서 확장자 반환 ('.pdf' 형태) */
function getExt(fileName: string): string {
  const idx = fileName.lastIndexOf('.');
  return idx >= 0 ? fileName.slice(idx).toLowerCase() : '';
}

/** 폴더 타입 기준으로 파일 확장자 허용 여부 검사 */
export function assertAllowedFile(fileName: string, folderType: FolderType): void {
  const ext = getExt(fileName);
  const allowed = ALLOWED_EXT[folderType];
  if (!allowed.includes(ext)) {
    const allowList = allowed.join(', ');
    throw new Error(
      `허용되지 않은 확장자입니다. 현재: ${ext || '(없음)'} / 허용: ${allowList} / 폴더: ${folderType}`
    );
  }
}

export function extractFileKeyFromPresigned(presignedUrl: string): string {
  // 1) 쿼리 제거
  const [base] = presignedUrl.split('?');

  // 2) v1 경로일 수도 있고 아닐 수도 있음 → 'flow-file-bucket/' 다음 경로를 모두 fileKey로 사용
  const marker = '/flow-file-bucket/';
  const pos = base.indexOf(marker);
  if (pos === -1) {
    throw new Error('presigned URL에서 버킷 경로(flow-file-bucket)를 찾을 수 없습니다.');
  }

  // 3) fileKey 부분 추출 (예: docs/... 또는 dict/... 또는 faqs/...)
  const fileKeyEncoded = base.slice(pos + marker.length);

  // 4) URL 인코딩 해제 (일부 구간만 인코딩된 경우도 안전하게 처리)
  // decodeURIComponent는 전체 문자열을 기대하므로, 슬래시는 그대로 두기 위해 split/join 처리
  const parts = fileKeyEncoded.split('/').map((seg) => {
    try {
      return decodeURIComponent(seg);
    } catch {
      return seg; // 이미 디코드된 경우 등 예외시 원본 유지
    }
  });
  const fileKey = parts.join('/');

  // 5) 최소 폴더타입 접두 확인
  const folder = fileKey.split('/')[0] as FolderType | string;
  if (folder !== 'dict' && folder !== 'faqs' && folder !== 'docs') {
    throw new Error(`fileKey가 유효하지 않습니다: ${fileKey}`);
  }
  return fileKey;
}

export function buildPublicUrlFromFileKey(
  fileKey: string,
  options?: { useV1?: boolean; accountId?: string }
): string {
  if (options?.useV1) {
    const account = options.accountId ?? '';
    if (!account) {
      throw new Error('v1 경로를 사용하려면 accountId가 필요합니다.');
    }
    return `https://objectstorage.kr-central-2.kakaocloud.com/v1/${account}/flow-file-bucket/${fileKey}`;
  }
  return `https://objectstorage.kr-central-2.kakaocloud.com/flow-file-bucket/${fileKey}`;
}

export async function uploadWithPresigned(
  presignedUrl: string,
  file: File | Blob,
  contentType?: 'text/csv' | 'application/pdf'
): Promise<void> {
  const ct = contentType ?? (file instanceof File ? getContentTypeByExt(file.name) : undefined);

  const resp = await fetch(presignedUrl, {
    method: 'PUT',
    headers: ct ? { 'Content-Type': ct } : undefined,
    body: file,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`파일 업로드 실패: ${resp.status} ${resp.statusText} ${text}`);
  }
}

export function buildRegisterBody(params: {
  fileKey: string;
  originalFileName: string;
  description: string;
  version: string;
  useTestFileUrl?: boolean;
  useV1PublicUrl?: boolean;
  accountIdForV1?: string;
}): RegisterFileBody {
  const {
    fileKey,
    originalFileName,
    description,
    version,
    useTestFileUrl,
    useV1PublicUrl,
    accountIdForV1,
  } = params;

  const fileUrl = useTestFileUrl
    ? 'test'
    : buildPublicUrlFromFileKey(fileKey, {
        useV1: !!useV1PublicUrl,
        accountId: accountIdForV1,
      });

  return {
    fileUrl,
    fileName: originalFileName,
    description,
    version,
  };
}

export async function uploadAndBuildRegisterBody(params: {
  presignedUrl: string;
  file: File;
  folderType: FolderType;
  description: string;
  version: string;
  useTestFileUrl?: boolean;
  useV1PublicUrl?: boolean;
  accountIdForV1?: string;
}): Promise<RegisterFileBody> {
  const {
    presignedUrl,
    file,
    folderType,
    description,
    version,
    useTestFileUrl,
    useV1PublicUrl,
    accountIdForV1,
  } = params;

  // 1) 확장자 검사
  assertAllowedFile(file.name, folderType);

  // 2) 업로드
  await uploadWithPresigned(presignedUrl, file, getContentTypeByExt(file.name));

  // 3) fileKey
  const fileKey = extractFileKeyFromPresigned(presignedUrl);

  // 4) 등록 바디
  return buildRegisterBody({
    fileKey,
    originalFileName: file.name,
    description,
    version,
    useTestFileUrl,
    useV1PublicUrl,
    accountIdForV1,
  });
}
