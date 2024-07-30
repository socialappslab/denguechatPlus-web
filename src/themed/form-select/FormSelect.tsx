import { Box, Chip, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormSelectOption } from '../../schemas';
import { getProperty } from '../../util';
import { FieldErrorType } from '../form-input/FormInput';

export type FormSelectProps = {
  name: string;
  label: string;
  loading?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
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
  multiple,
}: FormSelectProps) {
  const { t } = useTranslation('translation');

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

  let message = '';
  if (typeof fieldError?.message === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message = t(fieldError.message as any);
  }

  const mapLabel = (items: FormSelectOption[], val: string) =>
    (items as FormSelectOption[]).find((item: FormSelectOption) => item.value === val)?.label;

  return (
    <Controller
      control={control}
      defaultValue={multiple ? [] : ''}
      name={name}
      render={({ field }) => {
        return (
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
              multiple={multiple}
              renderValue={(selected) => {
                if (multiple) {
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((val: string, key: string) => (
                        <Chip key={key} label={mapLabel(optionsChecked, val)} />
                      ))}
                    </Box>
                  );
                }
                return mapLabel(optionsChecked, selected);
              }}
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
                optionsChecked.map((option) => {
                  if (option.disabled) {
                    return (
                      <MenuItem key={`key-${option.label}`} disabled>
                        <div className={` ${fieldError ? 'text-red opacity-50' : 'text-darkest opacity-50'}`}>
                          {option.label}
                        </div>
                      </MenuItem>
                    );
                  }
                  return (
                    <MenuItem key={`key-${option.label}`} value={option.value} disabled={option.disabled}>
                      {renderOption(option)}
                    </MenuItem>
                  );
                })}
            </Select>
            {helperText && (
              <FormHelperText className={`font-light text-sm mx-0 ${className}`}>{helperText}</FormHelperText>
            )}
            <FormHelperText className="font-light text-sm mx-0" error={!!fieldError}>{`${
              fieldError ? message : ''
            }`}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}

export default FormSelect;
