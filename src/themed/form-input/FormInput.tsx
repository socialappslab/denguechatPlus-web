/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormHelperText,
  IconButton,
  TextField as Input,
  InputAdornment,
  TextFieldProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DateField as MUIDateField, DatePicker as MUIDatePicker } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';

import dayjs, { Dayjs } from 'dayjs';
import { MuiTelInput } from 'mui-tel-input';
import React from 'react';
import { Controller, FieldError, FieldErrorsImpl, Merge, useFormContext } from 'react-hook-form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { twMerge } from 'tailwind-merge';
import { COLORS } from '../../constants';
import { getProperty } from '../../util';

export const DateField = styled(MUIDateField)`
  .MuiInputBase-root.MuiInput-root:before,
  .MuiInputBase-root.MuiInput-root:after,
  .MuiInputBase-root.MuiInput-root:hover:before,
  .MuiInputBase-root.MuiInput-root:hover {
    content: '';
    border-bottom: 0px;
  }
  .Mui-error {
    input {
      border-color: ${COLORS.red};
      color: ${COLORS.red};
    }
  }
  & input {
    &.Mui-error {
      border-color: ${COLORS.red};
      color: ${COLORS.red};
    }
  }
`;

export const DatePicker = styled(MUIDatePicker)`
  .MuiInputBase-root.MuiInput-root:before,
  .MuiInputBase-root.MuiInput-root:after,
  .MuiInputBase-root.MuiInput-root:hover:before,
  .MuiInputBase-root.MuiInput-root:hover {
    content: '';
    border-bottom: 0px;
  }
  .Mui-error {
    input {
      border-color: ${COLORS.red};
      color: ${COLORS.red};
    }
  }
  &.MuiTextField-root {
    border-color: ${COLORS.fieldBorder};
    &.Mui-error,
    &:has(.Mui-error) {
      border-color: ${COLORS.red};
      color: ${COLORS.red};
    }
  }
`;

interface CustomProps {
  onChange: (...event: any[]) => void;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange(values.value);
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  );
});

export type FormInputProps = {
  name: string;
  label: string;
  fullWidth?: boolean;
  placeholder?: string;
  helperText?: string;
  labelClassName?: string;
  formControlClasses?: string;
  fontVariant?: boolean;
  inputCell?: boolean;
} & TextFieldProps;

const TEXT_TYPES = ['text', 'email', 'password', 'number'];

export type FieldErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
interface FormInputErrorProps {
  fieldError: FieldErrorType;
  className?: string;
}

export function FormInputError({ fieldError, className = '' }: FormInputErrorProps) {
  const { t } = useTranslation('validation');

  if (!fieldError) {
    return null;
  }

  let message = '';
  if (typeof fieldError?.message === 'string') {
    message = t(fieldError.message as any);
  }

  return (
    <FormHelperText className={`text-red text-base mx-0 ${className}`} error={!!fieldError}>{`${
      fieldError ? message : ''
    }`}</FormHelperText>
  );
}

export function FormInput({
  name,
  label,
  placeholder,
  helperText,
  fullWidth = true,
  type,
  labelClassName,
  fontVariant,
  className,
  inputCell,
  formControlClasses,
  ...otherProps
}: FormInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation('translation');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const fieldError: FieldErrorType = getProperty(errors, name);
  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field }) => (
        <FormControl
          fullWidth={fullWidth}
          sx={{ mb: 2 }}
          className={twMerge(`${formControlClasses}`)}
          error={!!fieldError}
        >
          {(!type || TEXT_TYPES.includes(type)) && (
            <Input
              label={label}
              variant="outlined"
              // eslint-disable-next-line no-nested-ternary
              type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
              {...field}
              fullWidth={fullWidth}
              placeholder={placeholder}
              error={!!fieldError}
              {...otherProps}
              className={className}
              InputProps={{
                endAdornment:
                  type === 'password' ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ) : null,
              }}
            />
          )}
          {type === 'currency' && (
            <Input
              variant="outlined"
              InputProps={{
                inputComponent: NumericFormatCustom as any,
              }}
              label={label}
              type={type}
              value={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
              fullWidth={fullWidth}
              placeholder={placeholder}
              error={!!fieldError}
              {...otherProps}
            />
          )}
          {type === 'phone' && (
            <MuiTelInput
              forceCallingCode
              focusOnSelectCountry
              defaultCountry="PE"
              preferredCountries={['PE', 'BR', 'PY']}
              disableFormatting
              MenuProps={{ disableAutoFocusItem: true }}
              variant="outlined"
              label={label}
              type={type}
              value={field.value}
              onBlur={field.onBlur}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              onChange={field.onChange}
              fullWidth={fullWidth}
              placeholder={placeholder}
              error={!!fieldError}
              className={className}
              {...otherProps}
            />
          )}
          {type === 'date-picker' && (
            <DatePicker
              autoFocus
              localeText={{
                fieldYearPlaceholder: () => t('YYYY'),
              }}
              className={className}
              onChange={(value: unknown) => {
                const date = value as Dayjs;
                if (date.isValid()) {
                  field.onChange(date.toISOString());
                }
              }}
              slotProps={{
                textField: {
                  label,
                  variant: 'outlined',
                  value: dayjs(field.value),
                  onBlur: field.onBlur,
                  fullWidth,
                  error: !!fieldError,
                },
              }}
              sx={
                fontVariant
                  ? {
                      fontFamily: 'Inter',
                    }
                  : {}
              }
            />
          )}
          {type === 'date-field' && (
            <DateField
              autoFocus
              onChange={(value: unknown) => {
                const date = value as Dayjs;
                if (date.isValid()) {
                  field.onChange(date.toISOString());
                }
              }}
              variant="outlined"
              slotProps={{
                textField: {
                  label,
                  value: dayjs(field.value),
                  onBlur: field.onBlur,
                  fullWidth,
                  error: !!fieldError,
                },
              }}
              sx={
                fontVariant
                  ? {
                      fontFamily: 'Inter',
                    }
                  : {}
              }
            />
          )}
          {helperText && !fieldError && (
            <FormHelperText className={`font-light text-sm mx-0 ${className}`}>{helperText}</FormHelperText>
          )}
          <FormInputError className={`font-light text-sm mx-0 ${labelClassName}`} fieldError={fieldError} />
        </FormControl>
      )}
    />
  );
}

export default FormInput;
