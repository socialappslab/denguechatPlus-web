import { FormHelperText } from '@mui/material';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldErrorForTranslation } from '../../schemas/auth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FieldErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;

export interface FormInputErrorProps {
  fieldError: FieldErrorType;
  className?: string;
}

export function FormInputError({ fieldError, className = '' }: FormInputErrorProps) {
  const { t } = useTranslation('validation');

  if (!fieldError) {
    return null;
  }

  let message = '';
  if (typeof fieldError?.message === 'string' && fieldError.message) {
    try {
      const fieldErrorString = fieldError.message as string;
      const fieldErrorSplit = JSON.parse(fieldErrorString) as FieldErrorForTranslation;
      if (fieldErrorSplit.key) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message = t(fieldErrorSplit.key, fieldErrorSplit.args);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message = t(fieldError.message);
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message = t(fieldError.message);
    }

    if (!message) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message = fieldError.message;
    }
  }

  return (
    <FormHelperText className={`text-red text-base mx-0 ${className}`} error={!!fieldError}>{`${
      fieldError ? message : ''
    }`}</FormHelperText>
  );
}
