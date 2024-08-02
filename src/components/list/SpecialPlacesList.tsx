import { useTranslation } from 'react-i18next';
import { SpecialPlace } from '../../schemas/entities';
import { HeadCell } from '../../themed/table/DataTable';

import FilteredDataTable from './FilteredDataTable';

const headCells: HeadCell<SpecialPlace>[] = [
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
    label: 'statusActive',
    type: 'boolean',
    sortable: false,
  },
  {
    id: 'createdAt',
    label: 'createdAt',
    // sortKey: 'user_account.createdAt',
    type: 'date',
    sortable: true,
  },
];

const SpecialPlaceDataTable = FilteredDataTable<SpecialPlace>;

export default function SpecialPlaceList() {
  const { t } = useTranslation('translation');

  return (
    <>
      <SpecialPlaceDataTable
        endpoint="special_places"
        defaultFilter="name"
        headCells={headCells}
        title={t('menu.specialPlaces')}
        subtitle={t('menu.descriptions.specialPlaces')}
      />
    </>
  );
}
