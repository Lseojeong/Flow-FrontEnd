import React from 'react';
import BaseUploadModal from './BaseUploadModal';
import { uploadViaPresigned } from '@/apis/files/api';
import { createDictCategoryFile } from '@/apis/dictcategory_detail/api';

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
  }) => Promise<void>;
  onSuccess?: () => void;
}

export const DictUploadModal: React.FC<Props> = ({
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
        folderType: 'dict',
        organizationId: '550e8400-e29b-41d4-a716-446655440001',
      });

      await createDictCategoryFile(categoryId!, {
        fileUrl: publicUrl,
        fileName: data.file.name,
        description: data.description,
        version: data.version,
      });

      (window as { showToast?: (_message: string) => void }).showToast?.('파일이 등록되었습니다.');
      onSuccess?.();
    } catch {
      (window as { showToast?: (_message: string, _type: string) => void }).showToast?.(
        '파일 업로드 또는 DB 등록 중 오류가 발생했습니다.',
        'error'
      );
    }
  };

  return (
    <BaseUploadModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handlePresignedSubmit}
      onSuccess={onSuccess}
      title="용어사전 데이터 등록"
      fileType="csv"
      downloadLink="https://objectstorage.kr-central-2.kakaocloud.com/v1/8b70d156b8334e4fb16a680a47e8dc79/flow-file-bucket/dict_example.csv"
      latestVersion={latestVersion || '1.0.0'}
    />
  );
};
