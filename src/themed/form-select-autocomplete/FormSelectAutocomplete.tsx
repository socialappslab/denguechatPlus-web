import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import useAxios from 'axios-hooks';
import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';

interface IHouseBlock {
  id: number;
  name: string;
}

type ApiResponseItem = {
  id: string;
  attributes: {
    name: string;
  };
};

type Props = {
  value: IHouseBlock | null;
  onChange?: (value: IHouseBlock | null) => void;
};

export default function HouseBlockAutocomplete({ value, onChange }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [{ data, error }, execute] = useAxios<{ data: ApiResponseItem[] }>(
    {
      url: `wedges?filter[name]=${searchTerm}`,
    },
    { manual: true },
  );

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      execute();
    }
  }, [searchTerm, execute]);

  const options = useMemo(() => {
    return (
      data?.data?.map((item) => ({
        id: Number(item.id),
        name: item.attributes.name,
      })) || []
    );
  }, [data]);

  const debouncedSearch = useMemo(() => debounce(setSearchTerm, 300), []);

  const normalizedValue = useMemo(() => {
    if (!value) return null;
    return options.find((opt) => opt.id === value.id) || { id: value.id, name: value.name };
  }, [value, options]);

  const handleChange = (_: any, newValue: IHouseBlock | null) => {
    if (onChange && newValue && newValue.id !== value?.id) {
      onChange(newValue);
    }
  };

  return (
    <Autocomplete
      fullWidth
      options={options}
      getOptionLabel={(option) => option?.name || ''}
      isOptionEqualToValue={(option, val) => option.id === val?.id}
      value={normalizedValue}
      onChange={handleChange}
      onInputChange={(_, newInputValue) => debouncedSearch(newInputValue)}
      loading={!data && !error}
      noOptionsText={error ? 'Error loading data' : 'No house blocks found'}
      renderInput={(params) => <TextField {...params} label="House Block" />}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Grid container sx={{ alignItems: 'center' }}>
            <Grid item sx={{ width: '100%', wordWrap: 'break-word' }}>
              <Box component="span" sx={{ display: 'block', typography: 'body1' }}>
                {option.name}
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                ID: {option.id}
              </Typography>
            </Grid>
          </Grid>
        </li>
      )}
    />
  );
}
