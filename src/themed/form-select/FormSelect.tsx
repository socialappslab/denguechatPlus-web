/* eslint-disable react/jsx-props-no-spreading */
import { FormControl, FormHelperText, TextField as Input, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { getProperty } from '../../util';
import { FieldErrorType } from '../form-input/FormInput';
import { Text } from '../text/Text';

export type FormSelectOption = {
  label: string;
  value: string;
};

export type FormSelectProps = {
  name: string;
  label: string;
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
  renderOption = defaultRenderOption,
  options,
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

  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field }) => (
        <FormControl fullWidth sx={{ mb: 2 }} className={className}>
          <Text>{label}</Text>
          <Select
            displayEmpty
            disableUnderline
            error={!!fieldError}
            input={<Input />}
            inputProps={{ name, error: !!fieldError }}
            {...field}
          >
            {placeholder && (
              <MenuItem disabled value="">
                <div className={` ${fieldError ? 'text-red opacity-50' : 'text-darkest opacity-50'}`}>
                  {placeholder}
                </div>
              </MenuItem>
            )}
            {optionsChecked.map((option) => (
              <MenuItem key={`key-${option.value}`} value={option.value}>
                {renderOption(option)}
              </MenuItem>
            ))}
          </Select>

          <FormHelperText className="text-red text-base mx-0" error={!!fieldError}>{`${
            fieldError ? message : ''
          }`}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

export default FormSelect;
