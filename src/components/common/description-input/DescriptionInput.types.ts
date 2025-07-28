export interface Props {
  label?: string;
  placeholder?: string;
  maxLength?: number;
  errorMessage?: string;
  value?: string;
  onChange?: (_value: string) => void;
  onBlur?: () => void;
}
