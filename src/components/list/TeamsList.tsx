import { Dialog } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TEAMS_CREATE } from '@/constants/permissions';
import useStateContext from '@/hooks/useStateContext';
import ProtectedView from '@/layout/ProtectedView';
import { Team } from '@/schemas/entities';
import Button from '@/themed/button/Button';
import { HeadCell } from '../../themed/table/DataTable';
import { AssignMembersDialog } from '../dialog/AssignMembersDialog';
import CreateTeamDialog from '../dialog/CreateTeamDialog';
import FilteredDataTable from './FilteredDataTable';

function headCells(isAdmin: boolean): HeadCell<Team>[] {
  const cells: HeadCell<Team>[] = [
    {
      id: 'id',
      label: 'id',
      sortable: true,
    },
    {
      id: 'name',
      label: 'team',
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
      id: 'memberCount',
      label: 'memberCount',
      filterable: false,
      sortKey: 'members',
    },
    {
      id: 'leader',
      label: 'leader',
      filterable: true,
      sortKey: 'leader',
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

  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [updateControl, setUpdateControl] = useState(0);

  const handleClose = () => {
    setOpenDialog(false);
    setOpenCreateDialog(false);
  };

  const rootElement = document.getElementById('root-app');
  const isAdmin = user?.roles.includes('admin');

  const onEdit = (team: Team) => {
    setOpenDialog(true);
    setSelectedTeam(team);
  };

  const updateTable = () => {
    setUpdateControl((prev) => prev + 1);
  };

  const actions = (row: Team, loading?: boolean) => {
    return (
      <div className="flex flex-row">
        <Button
          primary
          disabled={loading}
          label={t('admin:teams.form.members')}
          buttonType="cell"
          onClick={() => onEdit(row)}
        />
      </div>
    );
  };

  const create = () => (
    <div className="flex flex-row">
      <ProtectedView hasPermission={[TEAMS_CREATE]}>
        <Button
          primary={false}
          variant="outlined"
          className="justify-start text-md"
          label={t(`table.create`)}
          onClick={() => setOpenCreateDialog(true)}
        />
      </ProtectedView>
    </div>
  );

  return (
    <>
      {/* Edit */}
      <Dialog container={rootElement} fullWidth maxWidth="sm" open={openDialog} onClose={handleClose}>
        <AssignMembersDialog handleClose={() => setOpenDialog(false)} updateTable={updateTable} team={selectedTeam} />
      </Dialog>

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
