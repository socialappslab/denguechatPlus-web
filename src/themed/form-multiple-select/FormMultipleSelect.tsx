import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Box, Checkbox, CircularProgress, FormControl, FormHelperText, TextField } from '@mui/material';

import { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormSelectOption } from '../../schemas';
import { getProperty } from '../../util';
import { FieldErrorType, FormInputError } from '../form-input/FormInputError';

export type FormMultipleSelectProps = {
  name: string;
  label: string;
  loading?: boolean;
  checkBoxOptions?: boolean;
  filterSelectedOptions?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
  options: FormSelectOption[] | string[];
  renderOption?: (option: FormSelectOption) => string;
  disabled?: boolean;
};

const defaultRenderOption = (option: FormSelectOption) => option.label;

const isStringArray = (obj: unknown): obj is string[] =>
  Array.isArray(obj) && obj.every((item) => typeof item === 'string');

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function FormMultipleSelect({
  name,
  label,
  className,
  placeholder,
  helperText,
  loading = false,
  checkBoxOptions = false,
  filterSelectedOptions = true,
  renderOption = defaultRenderOption,
  options,
  disabled = false,
}: FormMultipleSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [value, setValue] = useState<FormSelectOption[] | undefined>();

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
      defaultValue={[]}
      name={name}
      render={({ field }) => (
        <FormControl fullWidth sx={{ mb: 2 }} className={className} error={!!fieldError}>
          <Autocomplete
            id={name}
            multiple
            defaultChecked
            options={optionsChecked}
            defaultValue={field.value}
            value={value}
            onChange={(_event, newValue) => {
              // const newValues = newValue.filter((option) => optionsChecked.indexOf(option) === -1);
              setValue([...newValue]);
              field.onChange(newValue);
            }}
            isOptionEqualToValue={(o, v) => o.value === v.value}
            getOptionLabel={renderOption}
            filterSelectedOptions={filterSelectedOptions}
            disableCloseOnSelect={checkBoxOptions}
            renderOption={
              checkBoxOptions
                ? (props, option, { selected }) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore - key is not a valid prop for li
                    const { key, ...optionProps } = props;

                    return (
                      <li key={`${key}-${optionProps.id}`} {...optionProps}>
                        <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                        {renderOption(option)}
                      </li>
                    );
                  }
                : undefined
            }
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                placeholder={placeholder}
                {...params}
                name={name}
                variant="outlined"
                error={!!fieldError}
                label={label}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    params.InputProps.endAdornment
                  ),
                }}
              />
            )}
          />
          {helperText && !fieldError && (
            <FormHelperText className={`font-light text-sm mx-0 ${className}`}>{helperText}</FormHelperText>
          )}
          <FormInputError className={`font-light text-sm mx-0 ${className}`} fieldError={fieldError} />
        </FormControl>
      )}
    />
  );
}

export default FormMultipleSelect;
