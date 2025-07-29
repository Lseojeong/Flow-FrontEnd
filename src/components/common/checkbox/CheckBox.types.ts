<<<<<<< HEAD
=======
//CheckBox.types.tsx
export type CheckBoxSize = 'small' | 'medium';
export type CheckBoxVariant = 'default' | 'outline';

>>>>>>> 5abfb6a (feat: #19 pr 리뷰 반영)
export interface Props {
  id: string;
  label: string;
  checked: boolean;
  onChange: (_checked: boolean) => void;
<<<<<<< HEAD
=======
  size?: CheckBoxSize;
  variant?: CheckBoxVariant;
>>>>>>> 5abfb6a (feat: #19 pr 리뷰 반영)
  disabled?: boolean;
  className?: string;
}
