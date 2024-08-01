import { Dialog } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateRolePage from '@/pages/admin/CreateRoleDialog';
import { Role } from '../../schemas/entities';
import { HeadCell } from '../../themed/table/DataTable';
import FilteredDataTable from './FilteredDataTable';
import Button from '@/themed/button/Button';
import { Link } from 'react-router-dom';
import { City } from '@/schemas';

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

  const actions = (row: City, loading?: boolean) => (
    <div className="flex flex-row">
      <Button
        primary
        disabled={loading}
        component={Link}
        to={`${row.id}/edit`}
        label={t('table.actions.edit')}
        buttonType="cell"
      />
    </div>
  );

  return (
    <>
      <Dialog container={rootElement} fullWidth maxWidth="sm" open={open} onClose={handleClose}>
        <CreateRolePage goBack={() => setOpen(false)} />
      </Dialog>
      <RoleDataTable
        endpoint="admin/countries/1/states/1/cities"
        defaultFilter="name"
        headCells={headCells}
        title={t('menu.cities')}
        subtitle={t('menu.descriptions.cities')}
        createButton
        onCreate={() => setOpen(true)}
        actions={actions}
      />
    </>
  );
}