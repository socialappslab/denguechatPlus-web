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
  const [openDialog, setOpenDialog] = useState(false);
  const [updateControl, setUpdateControl] = useState(0);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const updateTable = () => {
    setUpdateControl((prev) => prev + 1);
  };

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
      <Dialog container={rootElement} fullWidth maxWidth="sm" open={openDialog} onClose={handleClose}>
        <CreateCityDialog handleClose={handleClose} updateTable={updateTable} />
      </Dialog>
      <RoleDataTable
        endpoint={`admin/countries/${user.country.id}/states/${user.state.id}/cities`}
        defaultFilter="name"
        headCells={headCells}
        title={t('menu.cities')}
        subtitle={t('menu.descriptions.cities')}
        onCreate={() => setOpenDialog(true)}
        actions={actions}
        updateControl={updateControl}
      />
    </>
  );
}
