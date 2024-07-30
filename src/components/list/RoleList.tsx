import { useTranslation } from 'react-i18next';
import { Role } from '../../schemas/entities';
import { HeadCell } from '../../themed/table/DataTable';
import FilteredDataTable from './FilteredDataTable';

const headCells: HeadCell<Role>[] = [
  {
    id: 'id',
    label: 'id',
    sortable: true,
  },
  {
    id: 'name',
    label: 'name',
    filterable: true,
    sortable: true,
  },
];

const RoleDataTable = FilteredDataTable<Role>;

export default function RoleList() {
  const { t } = useTranslation('translation');

  return (
    <RoleDataTable
      endpoint="roles"
      defaultFilter="name"
      headCells={headCells}
      title={t('menu.roles')}
      subtitle={t('menu.descriptions.roles')}
      createButton
    />
  );
}
