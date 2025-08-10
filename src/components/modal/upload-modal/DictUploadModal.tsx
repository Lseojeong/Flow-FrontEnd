import React from 'react';
import BaseUploadModal from './BaseUploadModal';
import { uploadViaPresigned } from '@/apis/files/api';
import { createDictCategoryFile } from '@/apis/dictcategory_detail/api';

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
}

export const DictUploadModal: React.FC<Props> = ({ isOpen, onClose, categoryId }) => {
  const handlePresignedSubmit = async (data: {
    file: File;
    description: string;
    version: string;
  }) => {
    console.log('=== handlePresignedSubmit 실행됨 ===');
    console.log('전달된 데이터:', data);

    try {
      const { publicUrl } = await uploadViaPresigned({
        file: data.file,
        folderType: 'dict',
        organizationId: '550e8400-e29b-41d4-a716-446655440001',
      });

      console.log('업로드 완료 Public URL:', publicUrl);

      await createDictCategoryFile(categoryId!, {
        fileUrl: publicUrl,
        fileName: data.file.name,
        description: data.description,
        version: data.version,
      });

      console.log('DB 등록 완료');
      onClose();
    } catch (err) {
      console.error('파일 업로드 실패', err);
    }
  };

  return (
    <BaseUploadModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handlePresignedSubmit}
      title="용어사전 데이터 등록"
      fileType="csv"
      downloadLink="/assets/dict-template.csv"
    />
  );
};
