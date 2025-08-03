export interface DepartmentTagProps {
  id: string;
  departmentName: string;
  onRemove: (_id: string) => void;
}
