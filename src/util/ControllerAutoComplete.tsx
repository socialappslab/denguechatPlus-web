// @ts-expect-error
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Controller } from 'react-hook-form';

// @ts-expect-error
const ControlledAutocomplete = ({
  options = [],
  // @ts-expect-error
  renderInput,
  // @ts-expect-error
  getOptionLabel,
  // @ts-expect-error
  onChange: ignored,
  // @ts-expect-error
  control,
  // @ts-expect-error
  defaultValue,
  // @ts-expect-error
  name,
  // @ts-expect-error
  renderOption,
}) => {
  return (
    <Controller
      // @ts-expect-error
      render={({ onChange, ...props }) => (
        <Autocomplete
          options={options}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          renderInput={renderInput}
          // @ts-expect-error
          onChange={(e, data) => onChange(data)}
          {...props}
        />
      )}
      // @ts-expect-error
      onChange={([, data]) => data}
      defaultValue={defaultValue}
      name={name}
      control={control}
    />
  );
};
