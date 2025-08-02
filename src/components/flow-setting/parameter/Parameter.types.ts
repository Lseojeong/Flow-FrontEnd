export interface ParameterProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (_value: number) => void;
  label?: string;
  showValue?: boolean;
}
