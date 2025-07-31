export interface Department {
  departmentId: string;
  departmentName: string;
}

export interface DepartmentSelectProps {
  options?: Department[];
  value?: string | null;
  onChange: (_departmentId: string | null) => void;
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

export interface DepartmentCheckProps {
  /** 부서 목록 */
  departments: Department[];
  /** 선택된 부서 ID 목록 */
  selectedDepartmentIds: string[];
  /** 부서 선택 변경 시 호출되는 함수 */
  onChange: (_selectedDepartmentIds: string[]) => void;
  /** 제목 표시 여부 (기본값: true) */
  showTitle?: boolean;
  /** 모두 선택 버튼 표시 여부 (기본값: true) */
  showSelectAll?: boolean;
  /** 커스텀 제목 */
  title?: string;
}
