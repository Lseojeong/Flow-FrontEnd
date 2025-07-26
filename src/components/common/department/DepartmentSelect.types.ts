export interface DepartmentSelectProps {
  options?: string[];
  value?: string;
  onChange: (_value: string) => void;
  placeholder?: string;
}

export interface DepartmentSelectItemProps {
  option: string;
  selected: boolean;
  onClick: () => void;
}

export interface DropdownStateProps {
  $open: boolean;
}

export interface DropdownItemStateProps {
  $selected: boolean;
}
