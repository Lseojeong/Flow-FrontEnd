export interface Department {
  departmentId: string;
  departmentName: string;
}

export interface DepartmentApiResponse {
  code: string;
  message: string;
  result: {
    departmentList: Department[];
  };
}

export interface DepartmentSelectProps {
  options?: Department[];
  value?: string;
  onChange: (_departmentId: string) => void;
  placeholder?: string;
}

export interface DepartmentSelectItemProps {
  option: Department;
  selected: boolean;
  onClick: () => void;
}

export interface DropdownStateProps {
  $open: boolean;
}

export interface DropdownItemStateProps {
  $selected: boolean;
}

export interface DepartmentTagProps {
  department: Department;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

export interface DepartmentTagListProps {
  departments?: Department[];
  onDepartmentClick?: (_department: Department) => void;
  showAll?: boolean;
}
