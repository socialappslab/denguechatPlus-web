import { useTranslation } from 'react-i18next';
import { HouseBlock } from '../../schemas/entities';
import { HeadCell } from '../../themed/table/DataTable';
import FilteredDataTable from './FilteredDataTable';

const headCells: HeadCell<HouseBlock>[] = [
  {
    id: 'id',
    label: 'id',
    sortable: true,
  },
  {
    id: 'name',
    label: 'house_block',
    filterable: true,
    sortable: true,
  },
];

const HouseBlockDataTable = FilteredDataTable<HouseBlock>;

export default function HouseBlockList() {
  const { t } = useTranslation('translation');

  return (
    <HouseBlockDataTable
      endpoint="house_blocks"
      defaultFilter="name"
      headCells={headCells}
      title={t('menu.house_blocks')}
      subtitle={t('menu.descriptions.house_blocks')}
    />
  );
}
