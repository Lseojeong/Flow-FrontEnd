export interface UserTagProps {
  id: string;
  email: string;
  departmentName: string;
  onRemove: (_id: string) => void;
}
