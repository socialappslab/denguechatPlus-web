import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import useAxios from 'axios-hooks';
import { deserialize } from 'jsonapi-fractal';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PAGE_SIZES } from '../../constants';
import { PaginationInput } from '../../schemas/entities';
import Button from '../../themed/button/Button';
import DataTable, { DataTableProps, Order } from '../../themed/table/DataTable';
import Title from '../../themed/title/Title';
import { constructFilterObject } from '../../util';

interface FilteredDataTableProps<T> extends Omit<DataTableProps<T>, 'rows'> {
  title?: string;
  subtitle?: string;
  endpoint: string;
}

export default function FilteredDataTable<T>({
  endpoint,
  headCells,
  title,
  subtitle,
  ...otherDataTableProps
}: FilteredDataTableProps<T>) {
  const { t } = useTranslation('translation');
  const { enqueueSnackbar } = useSnackbar();

  const TypedDataTable = DataTable<T>;

  const [searchText, setSearchText] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const options = headCells.filter((cell) => cell.filterable).map((cell) => cell.id);

  const [payload, setPayload] = useState<PaginationInput>({
    'page[number]': 1,
    'page[size]': PAGE_SIZES[0],
    // sort: '',
    // order: '',
  });

  const [filter, setFilter] = useState<{ [key: string]: string }>({});
  const [rows, setRows] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [{ data, loading, error }] = useAxios({
    url: `/${endpoint}`,
    params: {
      ...payload,
      ...constructFilterObject(filter),
    },
  });

  const handleChangePage = (newPage: number, rowsPerPage: number) => {
    setPayload((prev) => ({
      ...prev,
      'page[number]': newPage,
      'page[size]': rowsPerPage,
    }));
  };

  const handleRequestSort = (property: Extract<keyof T, string>, sortOrder: Order) => {
    setPayload((prev) => ({
      ...prev,
      sort: property,
      order: sortOrder,
    }));
  };

  useEffect(() => {
    if (data) {
      const deserializedData = deserialize<T>(data);
      if (!deserializedData || !Array.isArray(deserializedData)) return;
      console.log(deserializedData);
      setRows(deserializedData);
      setTotalCount(data.meta.total);
    }
  }, [data]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actions = (row: any) => (
    <Button
      disabled
      className="p-1 justify-start font-light"
      component={Link}
      to={`/edit/${row.name}`}
      label="Edit"
      size="small"
    />
  );

  function handleSearch(): void {
    setFilter({ [selectedOption]: searchText });
  }

  if (error) {
    enqueueSnackbar(error?.message || t('generalError'), {
      variant: 'error',
    });
  }

  return (
    <>
      {title && <Title type="section" label={title} className={subtitle ? 'mb-0' : ''} />}
      {subtitle && <Title type="subsection" label={subtitle} />}
      {(title || subtitle) && <div className="mb-8" />}
      <Grid className="mb-8 " container spacing={3} direction="row" justifyContent="flex-start" alignItems="center">
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label={t(`table.searchValue`)}
            variant="outlined"
            value={searchText}
            onChange={handleTextChange}
          />
        </Grid>
        <Grid item xs={8} sm={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="label-attribute-search"> {t(`table.selectAttribute`)}</InputLabel>
            <Select
              variant="outlined"
              labelId="label-attribute-search"
              value={selectedOption}
              onChange={handleSelectChange}
              label={t(`table.selectAttribute`)}
            >
              <MenuItem disabled value="">
                {t(`table.selectAttribute`)}
              </MenuItem>
              {options.map((option, index) => (
                <MenuItem key={`${option}-${index}`} value={option}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-expect-error */}
                  {t(`columns.${option}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            disabled={!searchText || !selectedOption}
            className="justify-start text-md"
            label={t(`table.search`)}
            onClick={handleSearch}
          />
        </Grid>
      </Grid>
      <TypedDataTable
        {...otherDataTableProps}
        rows={rows}
        useEmptyRows
        handleRequestSort={handleRequestSort}
        headCells={headCells}
        pagination={{
          totalCount,
          handleChangePage,
        }}
        isLoading={loading}
        actions={actions}
      />
    </>
  );
}
