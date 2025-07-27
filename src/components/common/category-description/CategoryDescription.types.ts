export interface Props {
  value: string;
  onChange: (_value: string) => void;
  onBlur?: () => void;
  error?: string;
  showValidation?: boolean;
}
