import { useTranslation } from 'react-i18next';
import { Organization } from '../../schemas/entities';
import { HeadCell } from '../../themed/table/DataTable';
import FilteredDataTable from './FilteredDataTable';

const headCells: HeadCell<Organization>[] = [
  {
    id: 'id',
    label: 'id',
    sortable: true,
  },
  {
    id: 'name',
    label: 'organization',
    filterable: true,
    sortable: true,
  },
  {
    id: 'status',
    label: 'statusActive',
    type: 'boolean',
    sortable: false,
  },
  {
    id: 'createdAt',
    label: 'createdAt',
    type: 'date',
    sortable: true,
  },
];

const OrganizationDataTable = FilteredDataTable<Organization>;

export default function OrganizationList() {
  const { t } = useTranslation('translation');

  return (
    <OrganizationDataTable
      endpoint="organizations"
      defaultFilter="name"
      headCells={headCells}
      title={t('menu.organizations')}
      subtitle={t('menu.descriptions.organizations')}
    />
  );
}
