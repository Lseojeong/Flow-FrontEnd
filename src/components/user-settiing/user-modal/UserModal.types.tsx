export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  departmentOptions?: Array<{
    departmentId: string;
    departmentName: string;
  }>;
}

export interface EmailTagData {
  id: string;
  email: string;
  departmentName: string;
}

export interface ValidationErrors {
  email?: string;
  department?: string;
}
