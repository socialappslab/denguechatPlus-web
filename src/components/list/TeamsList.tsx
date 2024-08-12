import { useTranslation } from 'react-i18next';
import { Team } from '@/schemas/entities';
import { HeadCell } from '../../themed/table/DataTable';
import FilteredDataTable from './FilteredDataTable';

const headCells: HeadCell<Team>[] = [
  {
    id: 'id',
    label: 'id',
    sortable: true,
  },
  {
    id: 'organization',
    label: 'organization',
    filterable: true,
    sortable: true,
  },
  {
    id: 'sector',
    label: 'sector',
    filterable: true,
    sortable: true,
  },
  {
    id: 'wedge',
    label: 'wedge',
    filterable: true,
    sortable: true,
  },
];

const ITeamDataTable = FilteredDataTable<Team>;

export default function TeamList() {
  const { t } = useTranslation('translation');

  return (
    <ITeamDataTable
      endpoint="admin/teams"
      // defaultFilter="username"
      headCells={headCells}
      title={t('menu.users')}
      subtitle={t('menu.descriptions.users')}
    />
  );
}
