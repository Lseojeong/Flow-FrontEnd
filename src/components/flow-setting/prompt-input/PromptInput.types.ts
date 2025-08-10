export interface PromptInputProps {
  value?: string;
  onChange?: (_value: string) => void;
  placeholder?: string;
  maxLength?: number;
  label?: string;
  defaultValue?: string;
  onReset?: () => void;
  isDefault?: boolean;
}
