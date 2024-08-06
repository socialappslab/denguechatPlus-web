import { Dialog } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '@/themed/button/Button';
import { City } from '@/schemas';
import CreateCityDialog from '@/pages/admin/CreateCityDialog';
import { HeadCell } from '../../themed/table/DataTable';
import FilteredDataTable from './FilteredDataTable';
import useStateContext from '@/hooks/useStateContext';
import { IUser } from '@/schemas/auth';

const headCells: HeadCell<City>[] = [
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

const RoleDataTable = FilteredDataTable<City>;

export default function RoleList() {
  const { state } = useStateContext();
  const user = state.user as IUser;
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
        <CreateCityDialog goBack={() => setOpen(false)} />
      </Dialog>
      <RoleDataTable
        endpoint={`admin/countries/1/states/${user.state.id}/cities`}
        defaultFilter="name"
        headCells={headCells}
        title={t('menu.cities')}
        subtitle={t('menu.descriptions.cities')}
        onCreate={() => setOpen(true)}
        actions={actions}
      />
    </>
  );
}
