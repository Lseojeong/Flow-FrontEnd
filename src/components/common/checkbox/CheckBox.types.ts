export type CheckBoxSize = 'small' | 'medium';
export type CheckBoxVariant = 'default' | 'outline';

export interface Props {
  id: string;
  label: string;
  checked: boolean;
  onChange: (_checked: boolean) => void;
  size?: CheckBoxSize;
  variant?: CheckBoxVariant;
  disabled?: boolean;
  className?: string;
}