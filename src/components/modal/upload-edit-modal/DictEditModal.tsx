// /components/modal/upload-edit-modal/DictEditModalEdit.tsx
import React from 'react';
import BaseUploadEditModal from './BaseUploadEditModal';
import { UPLOAD_MODAL_CONSTANTS } from '@/constants/Modal.constants';
import { uploadViaPresigned } from '@/apis/files/api';
import { updateDictCategoryFile } from '@/apis/dictcategory_detail/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  categoryId: string;
  fileId: string;
  originalFileName: string;
  originalVersion: string;
  originalFileUrl: string;
}

export const DictEditModalEdit: React.FC<Props> = ({
  isOpen,
  onClose,
  categoryId,
  fileId,
  originalFileName,
  originalVersion,
  originalFileUrl,
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

      await updateDictCategoryFile(categoryId, fileId, {
        fileUrl: finalFileUrl,
        fileName: finalFileName,
        description: data.description,
        version: data.version || originalVersion,
      });

      (window as { showToast?: (_: string) => void }).showToast?.('파일이 수정되었습니다.');
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
    />
  );
};

export default DictEditModalEdit;
