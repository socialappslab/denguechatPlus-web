import { useTranslation } from 'react-i18next';
import FilteredDataTable from '../../components/list/FilteredDataTable';
import { Visit } from '../../schemas/entities';
import { HeadCell } from '../../themed/table/DataTable';

const headCells: HeadCell<Visit>[] = [
  {
    id: 'id',
    label: 'id',
    sortable: true,
  },
  {
    id: 'visitedAt',
    label: 'visitedAt',
    type: 'date',
    sortable: true,
  },
  {
    id: 'city',
    label: 'city',
    filterable: true,
    sortable: false,
  },
  {
    id: 'wedge',
    label: 'wedge',
    filterable: true,
    sortable: true,
  },
  {
    id: 'team',
    label: 'brigade',
    filterable: true,
    sortable: true,
  },
  {
    id: 'brigadist',
    label: 'brigadist',
    filterable: true,
    sortable: true,
  },
  {
    id: 'house',
    label: 'site',
    filterable: true,
    sortable: true,
  },
  {
    id: 'visitStatus',
    label: 'visitStatus',
    filterable: true,
    sortable: true,
  },
];

const VisitDataTable = FilteredDataTable<Visit>;

export default function VisitsList() {
  const { t } = useTranslation('translation');

  return (
    <VisitDataTable
      endpoint="visits"
      defaultFilter="brigadist"
      headCells={headCells}
      title={t('menu.visits')}
      subtitle={t('menu.descriptions.visits')}
      pageSize={15}
    />
  );
}
