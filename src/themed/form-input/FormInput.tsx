import {
  Box,
  FormControl,
  FormHelperText,
  TextField as Input,
  InputAdornment,
  type TextFieldProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  DateField as MUIDateField,
  DatePicker as MUIDatePicker,
  DateTimePicker as MUIDateTimePicker,
} from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';

import dayjs, { Dayjs } from 'dayjs';
import { MuiTelInput } from 'mui-tel-input';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';

import {
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import { twMerge } from 'tailwind-merge';
import { COLORS } from '../../constants';
import { getProperty } from '../../util';
import { FormInputError, type FieldErrorType } from './FormInputError';

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

const DateTimePicker = styled(MUIDateTimePicker)`
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
} & TextFieldProps;

const TEXT_TYPES = ['text', 'email', 'password', 'number'];

export default function FormInput({
  name,
  label,
  placeholder,
  helperText,
  fullWidth = true,
  type,
  labelClassName,
  fontVariant,
  className,
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
      render={({ field }) => {
        const { ref, ...fieldProps } = field;
        const { InputProps: inputPropsFromOther, ...textFieldProps } = otherProps;

        return (
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
              type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
              {...fieldProps}
              inputRef={ref}
              fullWidth={fullWidth}
              placeholder={placeholder}
              error={!!fieldError}
              {...textFieldProps}
              className={className}
              InputProps={{
                ...inputPropsFromOther,
                endAdornment:
                  type === 'password' ? (
                    <InputAdornment position="end">
                      <Box
                        component="button"
                        type="button"
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        sx={{
                          display: 'flex',
                          cursor: 'pointer',
                          alignItems: 'center',
                          border: 0,
                          background: 'none',
                          padding: 0,
                          font: 'inherit',
                          color: 'inherit',
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlined fontSize="small" />
                        ) : (
                          <VisibilityOutlined fontSize="small" />
                        )}
                      </Box>
                    </InputAdornment>
                  ) : (
                    inputPropsFromOther?.endAdornment ?? null
                  ),
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
              localeText={{
                fieldYearPlaceholder: () => t('YYYY'),
              }}
              format="YYYY/MM/DD"
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
          {type === 'date-time-picker' && (
            <DateTimePicker
              value={field.value ? dayjs(field.value) : null}
              localeText={{
                fieldYearPlaceholder: () => t('YYYY'),
              }}
              format="YYYY/MM/DD HH:mm"
              ampm={false}
              className={className}
              inputRef={ref}
              onChange={(value: Dayjs | null) => {
                if (value?.isValid()) {
                  field.onChange(value.toISOString());
                }
              }}
              slotProps={{
                textField: {
                  label,
                  variant: 'outlined',
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
        );
      }}
    />
  );
}
