import { Box, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormSelectOption } from '../../schemas';
import { getProperty } from '../../util';
import { FieldErrorType, FormInputError } from '../form-input/FormInputError';

export type FormSelectProps = {
  name: string;
  label: string;
  loading?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
  options: FormSelectOption[] | string[];
  renderOption?: (option: FormSelectOption) => string;
};

const defaultRenderOption = (option: FormSelectOption) => option.label;

const isStringArray = (obj: unknown): obj is string[] =>
  Array.isArray(obj) && obj.every((item) => typeof item === 'string');

export function FormSelect({
  name,
  label,
  className,
  placeholder,
  helperText,
  loading = false,
  renderOption = defaultRenderOption,
  options,
}: FormSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const optionsChecked: FormSelectOption[] = useMemo(() => {
    if (isStringArray(options)) {
      return options.map((option) => ({
        label: option,
        value: option,
      }));
    }
    return options;
  }, [options]);

  const fieldError: FieldErrorType = getProperty(errors, name);

  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field }) => (
        <FormControl fullWidth sx={{ mb: 2 }} className={className} error={!!fieldError}>
          <InputLabel id={`label-${name}`}>{label}</InputLabel>
          <Select
            labelId={`label-${name}`}
            label={label}
            error={!!fieldError}
            variant="outlined"
            inputProps={{ name, error: !!fieldError }}
            {...field}
            value={loading ? '' : field.value}
            endAdornment={
              loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                  <CircularProgress size={24} />
                </Box>
              ) : null
            }
          >
            {placeholder && !field.value && !loading && (
              <MenuItem disabled value="">
                <div className={` ${fieldError ? 'text-red opacity-50' : 'text-darkest opacity-50'}`}>
                  {placeholder}
                </div>
              </MenuItem>
            )}
            {loading && <MenuItem disabled>...</MenuItem>}
            {!loading &&
              optionsChecked.map((option) => (
                <MenuItem key={`key-${option.value}`} value={option.value}>
                  {renderOption(option)}
                </MenuItem>
              ))}
          </Select>
          {helperText && !fieldError && (
            <FormHelperText className={`font-light text-sm mx-0 ${className}`}>{helperText}</FormHelperText>
          )}
          <FormInputError className={`font-light text-sm mx-0 ${className}`} fieldError={fieldError} />
        </FormControl>
      )}
    />
  );
}

export default FormSelect;
