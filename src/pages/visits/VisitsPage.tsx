import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '@/themed/button/Button';
import FilteredDataTable from '../../components/list/FilteredDataTable';
import { House, Visit } from '../../schemas/entities';
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
    render: (row) => <p>{(row.house as House).reference_code}</p>,
    filterable: true,
    sortable: true,
  },
  {
    id: 'visitStatus',
    label: 'visitStatus',
    filterable: true,
    sortable: true,
  },
  {
    id: 'possibleDuplicateVisitIds',
    label: 'possibleDuplicate',
    render: (row) => {
      if (row.possibleDuplicateVisitIds.length > 0) return <Trans i18nKey="yes" />;
      return <Trans i18nKey="no" />;
    },
  },
];

const VisitDataTable = FilteredDataTable<Visit>;

export default function VisitsList() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();

  const actions = (row: Visit, loading?: boolean) => {
    const navigateWithPayload = () => {
      navigate(`${row.id}/edit`, { state: { attributes: row } });
    };
    return (
      <div className="flex flex-row">
        <Button
          primary
          disabled={loading}
          onClick={navigateWithPayload}
          label={t('table.actions.edit')}
          buttonType="cell"
        />
      </div>
    );
  };

  return (
    <VisitDataTable
      endpoint="visits"
      defaultFilter="brigadist"
      headCells={headCells}
      title={t('menu.visits')}
      subtitle={t('menu.descriptions.visits')}
      pageSize={15}
      actions={actions}
    />
  );
}
