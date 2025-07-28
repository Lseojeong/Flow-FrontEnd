export interface UploadInputProps {
  onFileSelect: (_file: File) => void;
  fileType?: 'csv' | 'pdf';
}
