import React from 'react';

export interface Props {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
<<<<<<< HEAD
  onBlur?: () => void;
=======
  onBlur?: (_e: React.FocusEvent<HTMLInputElement>) => void;
>>>>>>> 5abfb6a (feat: #19 pr 리뷰 반영)
  label: string;
  error?: string;
  hasMarginBottom?: boolean;
  maxLength?: number;
  width?: string;
}
