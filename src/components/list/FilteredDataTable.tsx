import ClearIcon from '@mui/icons-material/Clear';
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import useAxios from 'axios-hooks';
import { deserialize } from 'jsonapi-fractal';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  defaultSort?: string;
  defaultOrder?: Order;
  defaultFilter?: string;
  updateControl?: number;
  actions?: (row: T, loading?: boolean) => JSX.Element;
  create?: () => JSX.Element;
}

interface FilterOptionsObject {
  [key: string]: string[];
}

export default function FilteredDataTable<T>({
  endpoint,
  headCells,
  title,
  subtitle,
  defaultSort,
  defaultOrder = 'asc',
  defaultFilter,
  updateControl,
  actions,
  create,
  ...otherDataTableProps
}: FilteredDataTableProps<T>) {
  const { t } = useTranslation('translation');
  const { enqueueSnackbar } = useSnackbar();

  const TypedDataTable = DataTable<T>;

  const [searchText, setSearchText] = useState('');
  const [searchSelect, setSearchSelect] = useState('');
  const [selectedOption, setSelectedOption] = useState(defaultFilter || '');
  const options = headCells.filter((cell) => cell.filterable).map((cell) => cell.id);
  const filterOptions = useMemo(() => {
    const filterOptionsObject: FilterOptionsObject = {};

    headCells.forEach((cell) => {
      if (cell.filterOptions) {
        filterOptionsObject[cell.id] = cell.filterOptions;
      }
    });

    return filterOptionsObject;
  }, [headCells]);

  const [payload, setPayload] = useState<PaginationInput>({
    'page[number]': 1,
    'page[size]': PAGE_SIZES[0],
    sort: defaultSort,
    order: defaultSort ? defaultOrder : undefined,
  });

  const [filter, setFilter] = useState<{ [key: string]: string }>({});
  const [rows, setRows] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [{ data, loading, error }, refetch] = useAxios({
    url: `/${endpoint}`,
    params: {
      ...payload,
      ...constructFilterObject(filter, Object.keys(filterOptions)),
    },
  });

  useEffect(() => {
    refetch();
  }, [updateControl, refetch]);

  const handleChangePage = (newPage: number, rowsPerPage: number) => {
    setPayload((prev) => ({
      ...prev,
      'page[number]': newPage + 1,
      'page[size]': rowsPerPage,
    }));
  };

  const handleRequestSort = (property: string, sortOrder: Order) => {
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

      // console.log('rows', deserializedData);
      setRows(deserializedData);
      setTotalCount(data.meta.total);
    }
  }, [data]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value);
    if (filterOptions[event.target.value]) {
      setSearchSelect('');
    }
  };

  const handleSelectOptionChange = (event: SelectChangeEvent<string>) => {
    setSearchSelect(event.target.value);
  };

  function handleSearch(): void {
    if (filterOptions[selectedOption]) {
      setFilter({ [selectedOption]: searchSelect });
    } else {
      setFilter({ [selectedOption]: searchText });
    }
  }

  if (error) {
    enqueueSnackbar(error?.message || t('generalError'), {
      variant: 'error',
    });
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => () => {
    setSearchText('');
    setFilter({ [selectedOption]: '' });
  };

  return (
    <>
      {title && <Title type="section" label={title} className={subtitle ? 'mb-0' : ''} />}
      {subtitle && <Title type="subsection" label={subtitle} />}
      {(title || subtitle) && <div className="mb-8" />}
      <Grid className="mb-8 " container spacing={3} direction="row" justifyContent="flex-start" alignItems="center">
        <Grid item xs={12} sm={5}>
          {!filterOptions[selectedOption] && (
            <TextField
              fullWidth
              onKeyDown={handleKeyPress}
              label={t(`table.searchValue`)}
              variant="outlined"
              value={searchText}
              onChange={handleTextChange}
              InputProps={{
                endAdornment: searchText ? (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClear()}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          )}
          {filterOptions[selectedOption] && (
            <FormControl fullWidth variant="outlined">
              <InputLabel id="label-attribute-search"> {t(`table.searchValue`)}</InputLabel>
              <Select
                variant="outlined"
                labelId="label-attribute-search"
                value={searchSelect}
                onChange={handleSelectOptionChange}
                label={t(`table.searchValue`)}
              >
                <MenuItem disabled value="">
                  {t(`table.searchValue`)}
                </MenuItem>
                {filterOptions[selectedOption].map((option, index) => (
                  <MenuItem key={`${option}-${index}`} value={option}>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-expect-error */}
                    {t(`options.${option}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
            disabled={(filterOptions[selectedOption] ? !searchSelect : !searchText) || !selectedOption}
            className="justify-start text-md"
            label={t(`table.search`)}
            onClick={handleSearch}
          />
        </Grid>
        {create && <Grid item>{create()}</Grid>}
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
