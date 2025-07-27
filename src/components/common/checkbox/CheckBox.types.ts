export interface Props {
  id: string;
  label: string;
  checked: boolean;
  onChange: (_checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}
