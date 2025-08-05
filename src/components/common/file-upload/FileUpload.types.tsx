export interface UploadInputProps {
  onFileSelect: (_file: File) => void;
  onError?: (_error: string) => void;
  fileType?: 'csv' | 'pdf';
  readOnly?: boolean;
  value?: string;
}
