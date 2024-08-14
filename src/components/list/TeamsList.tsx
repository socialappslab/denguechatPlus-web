import { useTranslation } from 'react-i18next';
import { Team } from '@/schemas/entities';
import { HeadCell } from '../../themed/table/DataTable';
import FilteredDataTable from './FilteredDataTable';
import useStateContext from '@/hooks/useStateContext';
import { IUser } from '@/schemas/auth';

function headCells(isAdmin: boolean): HeadCell<Team>[] {
  const cells: HeadCell<Team>[] = [
    {
      id: 'id',
      label: 'id',
      sortable: true,
    },
    {
      id: 'name',
      label: 'name',
      sortable: true,
      filterable: true,
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
    {
      id: 'userProfiles',
      label: 'members',
      filterable: false,
    },
    {
      id: 'leader',
      label: 'leader',
      filterable: true,
      render: (row) => (
        <span>
          {row.leader.first_name}, {row.leader.last_name}
        </span>
      ),
    },
    {
      id: 'userProfiles',
      label: 'memberCount',
      render: (row) => <span>{row.userProfiles.length}</span>,
    },
  ];

  if (isAdmin) {
    cells.push({
      id: 'organization',
      label: 'organization',
      sortable: true,
      filterable: true,
    });
  }

  return cells;
}

const ITeamDataTable = FilteredDataTable<Team>;

export default function TeamList() {
  const { t } = useTranslation('translation');
  const {
    state: { user },
  } = useStateContext();

  const isAdmin = (user as IUser).roles.includes('admin');

  return (
    <ITeamDataTable
      endpoint="admin/teams"
      defaultFilter="sector"
      headCells={headCells(isAdmin)}
      title={t('menu.teams')}
      subtitle={t('menu.descriptions.teams')}
    />
  );
}
