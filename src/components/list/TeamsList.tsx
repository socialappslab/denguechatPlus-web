import { useTranslation } from 'react-i18next';
import { Dialog } from '@mui/material';
import { useState } from 'react';
import useStateContext from '@/hooks/useStateContext';
import { Team } from '@/schemas/entities';
import Button from '@/themed/button/Button';
import { HeadCell } from '../../themed/table/DataTable';
import { AssignMembersDialog } from '../dialog/AssignMembersDialog';
import FilteredDataTable from './FilteredDataTable';
import { Member } from '@/schemas';

function headCells(isAdmin: boolean): HeadCell<Team>[] {
  const cells: HeadCell<Team>[] = [
    {
      id: 'id',
      label: 'id',
      sortable: true,
    },
    {
      id: 'name',
      label: 'name',
      sortable: true,
      filterable: true,
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
      label: 'members',
      filterable: false,
      render: (row) => <span>{row.members.map((m: Member) => `${m.fullName}`).join(', ')}</span>,
    },
    {
      id: 'leader',
      label: 'leader',
      filterable: true,
    },
    {
      id: 'members',
      label: 'memberCount',
      render: (row) => <span>{row.members.length}</span>,
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

const ITeamDataTable = FilteredDataTable<Team>;

export default function TeamList() {
  const { t } = useTranslation('translation');
  const {
    state: { user },
  } = useStateContext() as { state: { user: { roles: string[] } } };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [updateControl, setUpdateControl] = useState(0);

  const handleClose = () => {
    setOpenDialog(false);
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
        <Button primary disabled={loading} label="Members" buttonType="cell" onClick={() => onEdit(row)} />
      </div>
    );
  };

  return (
    <>
      {/* Edit */}
      <Dialog container={rootElement} fullWidth maxWidth="sm" open={openDialog} onClose={handleClose}>
        <AssignMembersDialog handleClose={() => setOpenDialog(false)} updateTable={updateTable} team={selectedTeam} />
      </Dialog>

      <ITeamDataTable
        endpoint="admin/teams"
        defaultFilter="sector"
        headCells={headCells(isAdmin)}
        title={t('menu.teams')}
        subtitle={t('menu.descriptions.teams')}
        actions={actions}
        updateControl={updateControl}
      />
    </>
  );
}
