export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_emails: string[], _department: string) => void;
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
