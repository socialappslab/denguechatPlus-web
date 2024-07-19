import { Link } from 'react-router-dom';
import Button from '../button/Button';
import { DataTable, HeadCell } from './DataTable';

interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

function createData(name: string, calories: number, fat: number, carbs: number, protein: number): Data {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData('Nádé', 305, 3.7, 67, 4.3),
  createData('Donut', 452, 25.0, 51, 4.9),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen Nádé español', 159, 6.0, 24, 4.0),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Honeycomb', 408, 3.2, 87, 6.5),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Jelly Bean', 375, 0.0, 94, 0.0),
  createData('KitKat', 518, 26.0, 65, 7.0),
  createData('Lollipop', 392, 0.2, 98, 0.0),
  createData('Marshmallow', 318, 0, 81, 2.0),
  createData('Nougat', 360, 19.0, 9, 37.0),
  createData('Oreo', 437, 18.0, 63, 4.0),
];

const headCells: HeadCell<Data>[] = [
  {
    id: 'name',
    label: 'Postre (100g serving)',
    sortable: true,
  },
  {
    id: 'calories',
    label: 'Calories',
    sortable: true,
  },
  {
    id: 'fat',
    label: 'Fat (g)',
    sortable: false,
  },
  {
    id: 'carbs',
    label: 'Carbs (g)',
    sortable: true,
  },
  {
    id: 'protein',
    label: 'Protein (g)',
    sortable: false,
  },
];

export default function DataTableExample() {
  const handleChangePage = (newPage: number, rowsPerPage: number) => {
    // eslint-disable-next-line no-console
    console.log('newPage', newPage, 'rowsPerPage', rowsPerPage);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actions = (row: any) => (
    <Button
      className="p-1 justify-start font-light"
      component={Link}
      to={`/edit/${row.name}`}
      label="Edit"
      size="small"
    />
  );

  return (
    <DataTable
      rows={rows}
      headCells={headCells}
      actions={actions}
      pagination={{ totalCount: rows.length, handleChangePage }}
    />
  );
}
