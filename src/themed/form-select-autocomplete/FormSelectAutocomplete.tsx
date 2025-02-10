import { Autocomplete, Box, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { deserialize } from 'jsonapi-fractal';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { convertToFormSelectOptions } from '@/util';
import { BaseEntity } from '@/schemas/entities';
import { FormSelectOption } from '@/schemas';
import { authApi } from '@/api/axios';

type Props = {
  defaultValue: FormSelectOption;
  endpoint: string;
  name: string;
  label: string;
  entityKey?: keyof BaseEntity;
};

export default function FormSelectAutocomplete<T extends BaseEntity>({
  endpoint,
  entityKey,
  label,
  name,
  defaultValue,
}: Props) {
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [options, setOptions] = useState<FormSelectOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { control } = useFormContext();

  const { t } = useTranslation('admin');
  const fetchData = useCallback(
    async (page: number, query?: string) => {
      setError('');
      try {
        const response = await authApi.get(endpoint, {
          params: {
            'page[number]': page,
            'filter[referenceCode]': query,
            'page[size]': 20,
          },
        });

        const data = response?.data;

        if (data) {
          const deserializedData = deserialize<T>(data);
          if (!deserializedData || !Array.isArray(deserializedData)) return;

          if (page === 1 || query) {
            if (Array.isArray(deserializedData)) {
              console.log(deserializedData);
              const selectOptions = convertToFormSelectOptions(deserializedData, entityKey);

              console.log(selectOptions, deserializedData);
              setOptions(selectOptions);
            }
          } else {
            setOptions((prevData) => {
              const updatedList = [...prevData, ...convertToFormSelectOptions(deserializedData, entityKey)];
              return updatedList;
            });
          }

          setHasMore(data.links?.self !== data.links?.last);
        }
      } catch (err) {
        console.log('error>>>>>>', err);
        setError(t('errorCodes:generic'));
      } finally {
        setLoadingMore(false);
      }
    },
    [t],
  );

  const firstLoad = useCallback(() => {
    // setAll(true);
    setHasMore(true);
    setCurrentPage(1);
    fetchData(1, undefined);
  }, [fetchData]);

  useEffect(() => {
    firstLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      fetchData(1, searchTerm);
    }
  }, [searchTerm]);

  const debouncedSearch = useMemo(() => debounce(setSearchTerm, 300), []);

  function loadMoreItems(event: Event) {
    const target = event.target as HTMLElement;
    const isEnd = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 1;
    if (isEnd && !loadingMore && hasMore && !error) {
      setCurrentPage(currentPage + 1);
      setLoadingMore(true);
      fetchData(currentPage + 1);
    }
  }

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      render={({ field }) => {
        return (
          <Autocomplete
            fullWidth
            isOptionEqualToValue={(o, v) => o.value === v.value}
            ListboxProps={{
              onScroll: loadMoreItems,
              style: {
                maxHeight: 300,
                overflowY: 'scroll',
              },
            }}
            style={{ marginTop: '8px' }}
            options={options}
            getOptionLabel={(option) => option?.label || ''}
            onInputChange={(_, newInputValue) => debouncedSearch(newInputValue)}
            loading={loadingMore}
            noOptionsText={error ? 'Error loading data' : 'No items found'}
            {...field}
            onChange={(e, data) => field.onChange(data)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                name={name}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: loadingMore ? (
                    <Box sx={{ display: 'flex', marginRight: '-25px' }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    params.InputProps.endAdornment
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                <Grid container sx={{ alignItems: 'center' }}>
                  <Grid item sx={{ width: '100%', wordWrap: 'break-word' }}>
                    <Box component="span" sx={{ display: 'block', typography: 'body1' }}>
                      {option.label}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      ID: {option.value}
                    </Typography>
                  </Grid>
                </Grid>
              </li>
            )}
          />
        );
      }}
    />
  );
}
