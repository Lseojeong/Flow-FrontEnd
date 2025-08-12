import React from 'react';
import BaseUploadModal from './BaseUploadModal';
import { uploadViaPresigned } from '@/apis/files/api';
import { createFaqCategoryFile } from '@/apis/faq_detail/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: string;
  onSubmit?: (_args: {
    fileUrl: string;
    fileName: string;
    description: string;
    version: string;
  }) => Promise<void>;
  onSuccess?: () => void;
}

export const FaqUploadModal: React.FC<Props> = ({ isOpen, onClose, categoryId, onSuccess }) => {
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
      fileType="pdf"
      downloadLink="https://objectstorage.kr-central-2.kakaocloud.com/v1/8b70d156b8334e4fb16a680a47e8dc79/flow-file-bucket/faq_example.csv"
    />
  );
};

export default FaqUploadModal;
