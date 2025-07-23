import React, { useState } from 'react';

interface ValidationRule {
  validate: (_value: string) => boolean;
  message: string;
}

interface UseFormFieldProps {
  validations?: ValidationRule[];
}

export function useFormField({ validations = [] }: UseFormFieldProps) {
  const [value, setValue] = useState('');
  const [isBlurred, setIsBlurred] = useState(false);

  const failedRule = validations.find((rule) => !rule.validate(value));

  const isValid = !failedRule;
  const isError = isBlurred && !isValid;
  const errorMessage = isError ? (failedRule?.message ?? '') : '';

  return {
    value,
    setValue,
    isBlurred,
    setIsBlurred,
    isValid,
    isError,
    errorMessage,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    onBlur: () => setIsBlurred(true),
  };
}
