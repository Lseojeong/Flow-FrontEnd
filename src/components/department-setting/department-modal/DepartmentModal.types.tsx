export interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_departments: string[]) => void;
}
