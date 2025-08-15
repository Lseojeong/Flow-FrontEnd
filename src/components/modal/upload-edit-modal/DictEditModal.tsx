// /components/modal/upload-edit-modal/DictEditModalEdit.tsx
import React from 'react';
import BaseUploadEditModal from './BaseUploadEditModal';
import { UPLOAD_MODAL_CONSTANTS } from '@/constants/Modal.constants';
import { uploadViaPresigned } from '@/apis/files/api';
import { updateDictCategoryFile } from '@/apis/dictcategory_detail/api';
import type { FileItem } from '@/apis/dictcategory_detail/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_updatedFile?: FileItem) => void;
  categoryId: string;
  fileId: string;
  originalFileName: string;
  originalVersion: string;
  originalFileUrl: string;
  latestVersion?: string;
}

export const DictEditModalEdit: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  categoryId,
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
          folderType: 'dict',
          organizationId: '550e8400-e29b-41d4-a716-446655440001',
        });

        finalFileUrl = publicUrl;
        finalFileName = data.file.name;
      }

      const response = await updateDictCategoryFile(categoryId, fileId, {
        fileUrl: finalFileUrl,
        fileName: finalFileName,
        description: data.description,
        version: data.version || originalVersion,
      });

      // API 응답에서 업데이트된 파일 정보를 가져옵니다
      const responseData = response.data.result as {
        status?: string;
        lastModifier?: string;
        lastModifierId?: string;
        lastModifierName?: string;
        createdAt?: string;
        updatedAt?: string;
        latestVersion?: string;
      };
      const updatedFile: FileItem = {
        id: fileId,
        name: finalFileName,
        fileName: finalFileName,
        status: responseData?.status || 'Completed',
        manager: responseData?.lastModifier || '-',
        lastModifierId: responseData?.lastModifierId,
        lastModifierName: responseData?.lastModifierName,
        registeredAt: responseData?.createdAt || new Date().toISOString(),
        updatedAt: responseData?.updatedAt || new Date().toISOString(),
        version:
          responseData?.latestVersion ||
          data.version ||
          originalVersion ||
          latestVersion ||
          '1.0.0',
        fileUrl: finalFileUrl,
      };

      onSubmit(updatedFile);
      onClose();
    } catch {
      (window as { showToast?: (_: string) => void }).showToast?.(
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
      title="용어사전 데이터 수정"
      acceptFileType={UPLOAD_MODAL_CONSTANTS.CSV_ACCEPT}
      latestVersion={latestVersion}
    />
  );
};

export default DictEditModalEdit;
