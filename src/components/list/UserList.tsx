import { useTranslation } from 'react-i18next';
import { IUser } from '../../schemas/auth';
import { HeadCell } from '../../themed/table/DataTable';
import FilteredDataTable from './FilteredDataTable';

const headCells: HeadCell<IUser>[] = [
  {
    id: 'id',
    label: 'id',
    filterable: true,
    sortable: true,
  },
  {
    id: 'username',
    label: 'username',
    filterable: true,
    sortable: true,
  },
  {
    id: 'phone',
    label: 'phone',
    filterable: true,
    sortable: true,
  },
  {
    id: 'firstName',
    label: 'firstName',
    filterable: true,
    sortable: true,
  },
  {
    id: 'lastName',
    label: 'lastName',
    filterable: true,
    sortable: true,
  },
  {
    id: 'status',
    label: 'status',
    filterable: false,
    sortable: true,
  },
];

const IUserDataTable = FilteredDataTable<IUser>;

export default function UserList() {
  const { t } = useTranslation('translation');

  return (
    <IUserDataTable
      endpoint="users"
      headCells={headCells}
      title={t('menu.users')}
      subtitle={t('menu.descriptions.users')}
    />
  );
}
