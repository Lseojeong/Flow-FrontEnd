// /components/modal/upload-edit-modal/DictEditModalEdit.tsx
import React from 'react';
import BaseUploadEditModal from './BaseUploadEditModal';
import { UPLOAD_MODAL_CONSTANTS } from '@/constants/Modal.constants';
import { uploadViaPresigned } from '@/apis/files/api';
import { updateDocsCategoryFile } from '@/apis/docs_detail/api';

import type { DocsFile } from '@/apis/docs_detail/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_updatedFile?: DocsFile) => void;
  fileId: string;
  originalFileName: string;
  originalVersion: string;
  originalFileUrl: string;
  latestVersion?: string;
}

export const DocsEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  fileId,
  originalFileName,
  originalVersion,
  originalFileUrl,
  latestVersion,
}) => {
  const handlePresignedEdit = async (data: {
    file?: File;
    description: string;
    version: string;
  }) => {
    try {
      let finalFileUrl = originalFileUrl;
      let finalFileName = originalFileName;

      if (data.file) {
        const { publicUrl } = await uploadViaPresigned({
          file: data.file,
          folderType: 'docs',
          organizationId: '550e8400-e29b-41d4-a716-446655440001',
        });

        finalFileUrl = publicUrl;
        finalFileName = data.file.name;
      }

      const response = await updateDocsCategoryFile(fileId, {
        fileUrl: finalFileUrl,
        fileName: finalFileName,
        description: data.description,
        version: data.version || originalVersion,
      });

      // API 응답에서 업데이트된 파일 정보를 가져옵니다
      const responseData = response.data.result;
      const updatedFile: DocsFile = {
        fileId,
        fileName: finalFileName,
        fileUrl: finalFileUrl,
        status: responseData.status || 'Completed',
        lastModifierName: '관리자', // API에서 제공하지 않는 경우 기본값
        lastModifierId: 'temp-id', // API에서 제공하지 않는 경우 기본값
        createdAt: responseData.createdAt || new Date().toISOString(),
        updatedAt: responseData.updatedAt || new Date().toISOString(),
        latestVersion: responseData.latestVersion || latestVersion || '1.0.0',
      };

      onSubmit(updatedFile);
      onClose();
    } catch {
      (window as { showErrorToast?: (_: string) => void }).showErrorToast?.(
        '파일 수정 중 오류가 발생했습니다.'
      );
    }
  };

  return (
    <BaseUploadEditModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handlePresignedEdit}
      originalFileName={originalFileName}
      originalVersion={originalVersion}
      title="사내문서 데이터 수정"
      acceptFileType={UPLOAD_MODAL_CONSTANTS.PDF_ACCEPT}
      latestVersion={latestVersion || '1.0.0'}
    />
  );
};

export default DocsEditModal;
