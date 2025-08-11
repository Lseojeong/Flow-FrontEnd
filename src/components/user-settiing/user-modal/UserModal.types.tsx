export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_emails: string[], _department: string) => void;
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
