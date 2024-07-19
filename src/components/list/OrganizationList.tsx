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
    label: 'name',
    filterable: true,
    sortable: true,
  },
  {
    id: 'status',
    label: 'status',
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
      headCells={headCells}
      title={t('menu.organizations')}
      subtitle={t('menu.descriptions.organizations')}
    />
  );
}
