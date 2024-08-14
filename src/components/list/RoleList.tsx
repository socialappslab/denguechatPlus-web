import { Dialog } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/themed/button/Button';
import CreateRoleDialog from '@/components/dialog/CreateRoleDialog';
import { Role } from '../../schemas/entities';
import { HeadCell } from '../../themed/table/DataTable';
import EditRoleDialog from '../dialog/EditRoleDialog';
import FilteredDataTable from './FilteredDataTable';
import { ROLES_CREATE } from '@/constants/permissions';
import ProtectedView from '@/layout/ProtectedView';

const headCells: HeadCell<Role>[] = [
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
];

const RoleDataTable = FilteredDataTable<Role>;

export default function RoleList() {
  const { t } = useTranslation('translation');

  const rootElement = document.getElementById('root-app');
  const [openDialog, setOpenDialog] = useState(false);
  const [updateControl, setUpdateControl] = useState(0);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const updateTable = () => {
    setUpdateControl((prev) => prev + 1);
  };

  const create = () => (
    <div className="flex flex-row">
      <ProtectedView hasPermission={[ROLES_CREATE]}>
        <Button
          primary={false}
          variant="outlined"
          className="justify-start text-md"
          label={t(`table.create`)}
          onClick={() => setOpenDialog(true)}
        />
      </ProtectedView>
    </div>
  );

  const onEdit = (role: Role) => {
    setOpenEditDialog(true);
    setSelectedRole(role);
  };

  const actions = (row: Role, loading?: boolean) => {
    return (
      <div className="flex flex-row">
        <Button
          primary
          disabled={loading}
          label={t('table.actions.edit')}
          buttonType="cell"
          onClick={() => onEdit(row)}
        />
      </div>
    );
  };

  return (
    <>
      {/* Create */}
      <Dialog container={rootElement} fullWidth maxWidth="sm" open={openDialog} onClose={handleClose}>
        <CreateRoleDialog handleClose={handleClose} updateTable={updateTable} />
      </Dialog>

      {/* Edit */}
      <Dialog container={rootElement} fullWidth maxWidth="sm" open={openEditDialog} onClose={handleClose}>
        <EditRoleDialog handleClose={() => setOpenEditDialog(false)} updateTable={updateTable} role={selectedRole} />
      </Dialog>

      {/* Table */}
      <RoleDataTable
        endpoint="roles"
        defaultFilter="name"
        headCells={headCells}
        title={t('menu.roles')}
        subtitle={t('menu.descriptions.roles')}
        create={create}
        updateControl={updateControl}
        actions={actions}
      />
    </>
  );
}
