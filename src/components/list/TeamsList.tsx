import { EditOutlined as EditOutlinedIcon, InfoOutlined as InfoOutlinedIcon } from '@mui/icons-material';
import { Box, Dialog, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { TEAMS_CREATE, TEAMS_UPDATE } from '@/constants/permissions';
import useStateContext from '@/hooks/useStateContext';
import ProtectedView from '@/layout/ProtectedView';
import type { Team } from '@/schemas/entities';
import Button from '@/themed/button/Button';
import type { HeadCell } from '../../themed/table/DataTable';
import CreateTeamDialog from '../dialog/CreateTeamDialog';
import FilteredDataTable from './FilteredDataTable';

function PeopleCountCell({
  count,
  people,
  column,
}: {
  count: number;
  people: Team['members'];
  column: 'leader' | 'memberCount';
}) {
  const { t } = useTranslation('translation');
  const label = column === 'leader' ? t('columns.leader') : t('columns.memberCount');

  if (count === 0) return <span>0</span>;

  return (
    <Tooltip
      arrow
      title={
        <Box component="ul" sx={{ m: 0, pl: 2, maxHeight: 280, overflowY: 'auto' }}>
          {people.map((person) => (
            <li key={person.id}>{person.fullName}</li>
          ))}
        </Box>
      }
    >
      <Box
        component="button"
        type="button"
        aria-label={`${count} ${label}`}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          p: 0,
          border: 0,
          bgcolor: 'transparent',
          cursor: 'help',
          color: 'inherit',
        }}
      >
        {count}
        <InfoOutlinedIcon fontSize="small" color="action" />
      </Box>
    </Tooltip>
  );
}

function headCells(isAdmin: boolean): HeadCell<Team>[] {
  const cells: HeadCell<Team>[] = [
    {
      id: 'id',
      label: 'id',
      sortable: true,
    },
    {
      id: 'name',
      label: 'brigade',
      sortable: true,
      filterable: true,
    },
    {
      id: 'city',
      label: 'city',
      filterable: true,
      sortable: true,
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
      id: 'members',
      label: 'memberCount',
      filterable: false,
      render: (row) => <PeopleCountCell count={row.members.length} people={row.members} column="memberCount" />,
    },
    {
      id: 'facilitators',
      label: 'leader',
      render: (row) => <PeopleCountCell count={row.facilitators.length} people={row.facilitators} column="leader" />,
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

const TeamDataTable = FilteredDataTable<Team>;

export default function TeamList() {
  const { t } = useTranslation(['translation', 'admin']);
  const {
    state: { user },
  } = useStateContext() as { state: { user: { roles: string[] } } };

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [updateControl, setUpdateControl] = useState(0);

  const handleClose = () => {
    setOpenCreateDialog(false);
  };

  const rootElement = document.getElementById('root-app');
  const isAdmin = user?.roles.includes('admin');

  const updateTable = () => {
    setUpdateControl((prev) => prev + 1);
  };

  const actions = (row: Team, loading?: boolean) => {
    return (
      <div className="flex flex-row">
        <ProtectedView hasPermission={[TEAMS_UPDATE]}>
          <Tooltip title={t('table.actions.edit')}>
            <IconButton
              component={Link}
              to={`/admin/brigades/${row.id}/members`}
              color="primary"
              disabled={loading}
              size="small"
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ProtectedView>
      </div>
    );
  };

  const create = () => (
    <div className="flex flex-row">
      <ProtectedView hasPermission={[TEAMS_CREATE]}>
        <Button
          primary={false}
          variant="outlined"
          className="text-md justify-start"
          label={t(`table.create`)}
          onClick={() => setOpenCreateDialog(true)}
        />
      </ProtectedView>
    </div>
  );

  return (
    <>
      <Dialog container={rootElement} fullWidth maxWidth="sm" open={openCreateDialog} onClose={handleClose}>
        <CreateTeamDialog handleClose={() => setOpenCreateDialog(false)} updateTable={updateTable} />
      </Dialog>

      <TeamDataTable
        endpoint="teams"
        defaultFilter="sector"
        headCells={headCells(isAdmin)}
        title={t('menu.teams')}
        subtitle={t('menu.descriptions.teams')}
        actions={actions}
        create={create}
        updateControl={updateControl}
      />
    </>
  );
}
