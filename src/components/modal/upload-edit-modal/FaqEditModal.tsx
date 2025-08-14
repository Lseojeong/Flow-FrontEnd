import React from 'react';
import BaseUploadEditModal from './BaseUploadEditModal';
import { UPLOAD_MODAL_CONSTANTS } from '@/constants/Modal.constants';
import { uploadViaPresigned } from '@/apis/files/api';
import { updateFaqCategoryFile } from '@/apis/faq_detail/api';

import type { FaqFile } from '@/apis/faq_detail/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_updatedFile?: FaqFile) => void;
  fileId: string;
  originalFileName: string;
  originalVersion: string;
  originalFileUrl: string;
  latestVersion?: string;
}

export const FaqEditModal: React.FC<Props> = ({
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
          folderType: 'faq',
          organizationId: '550e8400-e29b-41d4-a716-446655440001',
        });

        finalFileUrl = publicUrl;
        finalFileName = data.file.name;
      }

      const response = await updateFaqCategoryFile(fileId, {
        fileUrl: finalFileUrl,
        fileName: finalFileName,
        description: data.description,
        version: data.version || originalVersion,
      });

      const responseData = response.data.result;
      const updatedFile: FaqFile = {
        fileId,
        fileName: finalFileName,
        fileUrl: finalFileUrl,
        status: responseData.status || 'Completed',
        lastModifierName: '관리자',
        lastModifierId: 'temp-id',
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
      title="FAQ 데이터 수정"
      acceptFileType={UPLOAD_MODAL_CONSTANTS.CSV_ACCEPT}
      latestVersion={latestVersion || '1.0.0'}
    />
  );
};

export default FaqEditModal;
