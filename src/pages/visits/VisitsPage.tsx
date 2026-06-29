import { DeleteOutline as DeleteOutlineIcon, EditOutlined as EditOutlinedIcon } from '@mui/icons-material';
import { Box, Dialog, IconButton, Tooltip } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Link } from 'react-router';
import Button from '@/themed/button/Button';
import FilteredDataTable from '../../components/list/FilteredDataTable';
import { type House, type InspectionStatus, type Visit } from '../../schemas/entities';
import type { HeadCell } from '../../themed/table/DataTable';
import Title from '../../themed/title/Title';

const visitStatusColorClasses: Record<InspectionStatus, string> = {
  green: 'bg-green-600',
  yellow: 'bg-yellow-600',
  red: 'bg-red-600',
};

const visitStatusAliases: Record<string, InspectionStatus> = {
  green: 'green',
  verde: 'green',
  yellow: 'yellow',
  amarillo: 'yellow',
  amarelo: 'yellow',
  red: 'red',
  rojo: 'red',
  vermelho: 'red',
};

function VisitStatusSwatch({ status }: { status: string }) {
  const normalizedStatus = visitStatusAliases[status.trim().toLocaleLowerCase()];
  const colorClass = normalizedStatus ? visitStatusColorClasses[normalizedStatus] : 'bg-neutral-300';

  return (
    <Tooltip title={status}>
      <Box component="span" tabIndex={0} className={`block h-5 w-5 rounded-full ${colorClass}`} />
    </Tooltip>
  );
}

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
    filterable: true,
    filterType: 'date',
    filterKey: 'visited_at',
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
    render: (row) => <VisitStatusSwatch status={row.visitStatus} />,
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
  const { t } = useTranslation(['translation', 'admin', 'errorCodes', 'register']);
  const { enqueueSnackbar } = useSnackbar();
  const rootElement = document.getElementById('root-app');
  const [updateControl, setUpdateControl] = useState(0);
  const [visitToDelete, setVisitToDelete] = useState<Visit | null>(null);

  const [{ loading: deletingVisit }, deleteVisitRequest] = useAxios(
    {
      method: 'DELETE',
    },
    { manual: true },
  );

  const handleDeleteVisit = async (visitId: string | number) => {
    try {
      await deleteVisitRequest({ url: `/visits/${visitId}` });
      enqueueSnackbar(t('admin:visits.delete.success'), {
        variant: 'success',
      });
      setUpdateControl((value) => value + 1);
      setVisitToDelete(null);
    } catch {
      enqueueSnackbar(t('errorCodes:generic'), {
        variant: 'error',
      });
    }
  };

  const actions = (row: Visit, loading?: boolean) => {
    return (
      <div className="flex flex-row items-center gap-1">
        <Tooltip title={t('translation:table.actions.edit')}>
          <IconButton
            component={Link}
            to={`/visits/${row.id}/edit`}
            color="primary"
            disabled={loading || deletingVisit}
          >
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={t('translation:table.actions.delete')}>
          <IconButton color="error" disabled={loading || deletingVisit} onClick={() => setVisitToDelete(row)}>
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xs"
        container={rootElement}
        open={!!visitToDelete}
        onClose={() => setVisitToDelete(null)}
      >
        <div className="flex flex-col py-7 px-8">
          <Title type="section" label={t('translation:table.actions.delete')} className="mb-4" />
          <p className="text-sm text-darkest">{t('admin:visits.delete.confirm')}</p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:flex md:justify-end md:gap-0">
            <div className="md:mr-2">
              <Button
                buttonType="medium"
                primary={false}
                disabled={deletingVisit}
                label={t('register:cancel')}
                onClick={() => setVisitToDelete(null)}
              />
            </div>
            <div>
              <Button
                buttonType="medium"
                disabled={deletingVisit}
                label={t('translation:table.actions.delete')}
                onClick={() => visitToDelete && handleDeleteVisit(visitToDelete.id)}
              />
            </div>
          </div>
        </div>
      </Dialog>

      <VisitDataTable
        endpoint="visits"
        defaultFilter="brigadist"
        headCells={headCells}
        title={t('menu.visits')}
        subtitle={t('menu.descriptions.visits')}
        pageSize={15}
        actions={actions}
        updateControl={updateControl}
      />
    </>
  );
}
