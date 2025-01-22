import { Box } from '@mui/material';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import FilteredDataTable from '../../components/list/FilteredDataTable';
import { Inspection, InspectionStatus } from '../../schemas/entities';
import { HeadCell } from '../../themed/table/DataTable';
import Button from '@/themed/button/Button';

const renderColor = (color: InspectionStatus) => {
  return (
    <Box className="flex">
      <Box className={`w-5 h-5 bg-${color}-600 mr-3 rounded-full`} />
      {capitalize(color)}
    </Box>
  );
};

const headCells: HeadCell<Inspection>[] = [
  {
    id: 'id',
    label: 'id',
  },
  {
    id: 'breadingSiteType',
    label: 'breedingSiteType',
  },
  {
    id: 'hasWater',
    label: 'hasWater',
    render: (row) => {
      // i18n
      const answer = row.hasWater ? 'Sí' : 'No';
      return <p>{answer}</p>;
    },
  },
  {
    id: 'typeContents',
    label: 'typeContents',
  },
  {
    id: 'status',
    label: 'containerStatus',
    render: (row) => renderColor(row.status),
  },
];

const VisitDataTable = FilteredDataTable<Inspection>;

interface InspectionsListProps {
  id: number;
}

export default function InspectionsList({ id }: InspectionsListProps) {
  const { t } = useTranslation();
  const actions = (_: Inspection, loading?: boolean) => {
    return (
      <div className="flex flex-row">
        <Button
          primary
          disabled={loading}
          onClick={() => {}}
          disable
          label={t('table.actions.edit')}
          buttonType="cell"
        />
      </div>
    );
  };
  return (
    <VisitDataTable
      endpoint={`visits/${id}/inspections`}
      defaultFilter="brigadist"
      headCells={headCells}
      pageSize={5}
      actions={actions}
      searchable={false}
    />
  );
}
