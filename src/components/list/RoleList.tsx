import { Dialog } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateRolePage from '@/pages/admin/CreateRoleDialog';
import { Role } from '../../schemas/entities';
import { HeadCell } from '../../themed/table/DataTable';
import FilteredDataTable from './FilteredDataTable';

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
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Dialog container={rootElement} fullWidth maxWidth="sm" open={open} onClose={handleClose}>
        <CreateRolePage goBack={() => setOpen(false)} />
      </Dialog>
      <RoleDataTable
        endpoint="roles"
        defaultFilter="name"
        headCells={headCells}
        title={t('menu.roles')}
        subtitle={t('menu.descriptions.roles')}
        createButton
        onCreate={() => setOpen(true)}
      />
    </>
  );
}
