import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

import { PAGE_SIZES, PageSizes } from '@/constants';
import { formatDateFromString } from '@/util';
import useLangContext from '../../hooks/useLangContext';

function descendingComparator<T>(a: T, b: T, orderBy: Extract<keyof T, string>) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type Order = 'asc' | 'desc';

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export type DataCellType = 'date' | 'boolean' | 'enum' | undefined;

export interface HeadCell<T> {
  withPadding?: boolean;
  id: Extract<keyof T, string>;
  label: string;
  type?: DataCellType;
  render?: (row: T, headCell: HeadCell<T>) => JSX.Element;
  sortable?: boolean;
  sortKey?: string;
  filterable?: boolean;
  filterOptions?: string[];
  width?: number;
}

export interface DataTableHeadProps<T> {
  onRequestSort: (event: React.MouseEvent<unknown>, property: Extract<keyof T, string>) => void;
  order: Order | undefined;
  orderBy: string | undefined;
  headCells: HeadCell<T>[];
  hasActions?: boolean;
}

export function DataTableHeadCell(props: TableCellProps) {
  const { children, className, width } = props;
  return (
    <TableCell
      sx={{ width: width || 'auto' }}
      {...props}
      className={twMerge(
        `px-4 py-5 border-solid border-r-0 border-l-0 border-t-0 border-fieldBorder bg-white ${className}`,
      )}
    >
      {children}
    </TableCell>
  );
}

export function DataTableHeadLabel({ label }: { label: string }) {
  return <span className="flex flex-row justify-between text-grass text-sm font-bold">{label}</span>;
}

export function DataTableCell(props: TableCellProps) {
  const { children, className } = props;
  return (
    <TableCell
      {...props}
      className={twMerge(
        `px-4 text-darkest text-sm font-normal border-solid border-r-0 border-l-0 border-t-0 border-fieldBorder bg-white ${className}`,
      )}
    >
      {children}
    </TableCell>
  );
}

function DataTableHead<T>({
  order = 'asc',
  orderBy,
  hasActions = false,
  onRequestSort,
  headCells,
}: DataTableHeadProps<T>) {
  const { t } = useTranslation('translation');

  const createSortHandler = (property: Extract<keyof T, string>) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <DataTableHeadCell
            width={headCell.width}
            key={String(headCell.id)}
            align="left"
            padding={headCell.withPadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable && (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                className="flex flex-row justify-between text-grass text-sm font-bold"
                // IconComponent={orderBy === headCell.id ? SorterDirection : Sorter}
                onClick={createSortHandler(headCell.id)}
              >
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-expect-error */}
                {t(`columns.${headCell.label}`)}
              </TableSortLabel>
            )}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
            {!headCell.sortable && <DataTableHeadLabel label={t(`columns.${headCell.label}`)} />}
          </DataTableHeadCell>
        ))}
        {hasActions && (
          <DataTableHeadCell>
            <DataTableHeadLabel label={t('columns.actions')} />
          </DataTableHeadCell>
        )}
      </TableRow>
    </TableHead>
  );
}

export interface HandlePagination {
  totalCount: number;
  handleChangePage: (newPage: number, rowsPerPage: number) => void;
}

export interface DataTableProps<T> {
  rows: T[];
  headCells: HeadCell<T>[];
  useEmptyRows?: boolean;
  handleRequestSort?: (property: Extract<keyof T, string> | string, sortOrder: Order) => void;
  pagination?: HandlePagination;
  actions?: (row: T, isLoading?: boolean) => JSX.Element;
  isLoading?: boolean;
  pageSize?: PageSizes;
}

export function DataTable<T>({
  rows,
  headCells,
  useEmptyRows = true,
  handleRequestSort,
  pagination,
  actions,
  isLoading,
  pageSize = PAGE_SIZES[0],
}: DataTableProps<T>) {
  const { t } = useTranslation('translation');

  const langContext = useLangContext();

  const [visibleRows, setVisibleRows] = React.useState<T[]>(rows);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<Extract<keyof T, string> | undefined>();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(pageSize);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderValue = (row: T, headCell: HeadCell<T>): string | React.ReactNode => {
    if (headCell.render) {
      return headCell.render(row, headCell);
    }

    if (headCell.type === 'boolean') {
      return row[headCell.id] ? t('yes') : t('no');
    }

    if (headCell.type === 'enum') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return t(`options.${row[headCell.id]}`);
    }

    if (headCell.type === 'date') {
      return formatDateFromString(langContext.state.selected, String(row[headCell.id]));
    }

    return String(row[headCell.id]);
  };

  useEffect(() => {
    if (!handleRequestSort && orderBy) {
      if (order === 'desc') {
        setVisibleRows(stableSort(rows, (a, b) => descendingComparator(a, b, orderBy)));
      } else {
        setVisibleRows(stableSort(rows, (a, b) => -descendingComparator(a, b, orderBy)));
      }
    } else {
      setVisibleRows(rows);
    }
  }, [order, orderBy, handleRequestSort, rows]);

  const onRequestSort = (_event: React.MouseEvent<unknown>, property: Extract<keyof T, string>) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
    if (handleRequestSort) {
      const newProperty = headCells.find((cell) => cell.id === property)?.sortKey || property;
      handleRequestSort(newProperty, newOrder);
    }
  };

  const onChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    pagination?.handleChangePage(newPage, rowsPerPage);
  };

  const onChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(`${event.target.value}`, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    pagination?.handleChangePage(0, newRowsPerPage);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = useMemo(
    () => (useEmptyRows ? Math.max(0, rowsPerPage - rows.length) : 0),
    [rows, rowsPerPage, useEmptyRows],
  );

  return (
    <Box>
      <Paper elevation={0} square className="bg-background">
        <TableContainer>
          <Table aria-labelledby="data-table" size="medium">
            <DataTableHead
              hasActions={Boolean(actions)}
              order={order}
              orderBy={orderBy}
              onRequestSort={onRequestSort}
              headCells={headCells}
            />
            <TableBody>
              {visibleRows.map((row: T, index) => (
                <TableRow tabIndex={-1} key={`${String(index)}`}>
                  {headCells.map((headCell) => (
                    <DataTableCell
                      key={`${String(`${row[headCell.id]}-${index}-${headCell.id}`)}`}
                      className={row[headCell.id] !== null ? '' : 'italic font-thin'}
                    >
                      {row[headCell.id] === null ? t('options.notDefined') : renderValue(row, headCell)}
                    </DataTableCell>
                  ))}
                  {actions && <DataTableCell>{actions(row, isLoading)}</DataTableCell>}
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <DataTableCell colSpan={headCells.length + (actions ? 1 : 0)} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {pagination && (
          <TablePagination
            className="border-solid border-r-0 border-l-0 border-t-0 border-fieldBorder bg-white"
            classes={{
              selectLabel: 'text-darkest text-sm font-normal',
              select: 'text-darkest text-sm font-normal',
              menuItem: 'text-darkest text-sm font-normal',
              input: 'text-darkest text-sm font-normal',
              displayedRows: 'text-darkest text-sm font-normal',
            }}
            rowsPerPageOptions={PAGE_SIZES}
            labelRowsPerPage={t('table.rowsInPage')}
            labelDisplayedRows={({ from, to, count }: { from: number; to: number; count: number }) =>
              `${from}–${to} ${t('table.rowsInPageOf')} ${count !== -1 ? count : `${t('table.rowsMoreThan')} ${to}`}`
            }
            component="div"
            count={pagination.totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  );
}

export default DataTable;
