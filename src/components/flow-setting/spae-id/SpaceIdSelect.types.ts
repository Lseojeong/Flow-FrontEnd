export interface SpaceidSelectProps {
  value: string;
  onChange: (_value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export interface SpaceidOption {
  value: string;
  label: string;
}
