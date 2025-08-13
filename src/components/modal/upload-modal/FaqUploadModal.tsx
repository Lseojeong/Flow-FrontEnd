import React from 'react';
import BaseUploadModal from './BaseUploadModal';
import { uploadViaPresigned } from '@/apis/files/api';
import { createFaqCategoryFile } from '@/apis/faq_detail/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: string;
  latestVersion?: string;
  onSubmit?: (_args: {
    fileUrl: string;
    fileName: string;
    description: string;
    version: string;
  }) => void | Promise<void>;
  onSuccess?: () => void;
}

export const FaqUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  categoryId,
  latestVersion,
  onSuccess,
}) => {
  const handlePresignedSubmit = async (data: {
    file: File;
    description: string;
    version: string;
  }) => {
    try {
      const { publicUrl } = await uploadViaPresigned({
        file: data.file,
        folderType: 'faq',
        organizationId: '550e8400-e29b-41d4-a716-446655440001',
      });

      await createFaqCategoryFile(categoryId!, {
        fileUrl: publicUrl,
        fileName: data.file.name,
        description: data.description,
        version: data.version,
      });

      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '파일 업로드 또는 DB 등록 중 오류가 발생했습니다.';

      if (
        typeof window !== 'undefined' &&
        'showErrorToast' in window &&
        typeof window.showErrorToast === 'function'
      ) {
        window.showErrorToast(errorMessage);
      }
    }
  };

  return (
    <BaseUploadModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handlePresignedSubmit}
      title="FAQ 데이터 등록"
      fileType="csv"
      latestVersion={latestVersion || '1.0.0'}
    />
  );
};

export default FaqUploadModal;
