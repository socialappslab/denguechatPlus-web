import { Dialog } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import CreateCityDialog from '@/components/dialog/CreateCityDialog';
import { CITIES_CREATE, CITIES_EDIT } from '@/constants/permissions';
import useStateContext from '@/hooks/useStateContext';
import ProtectedView from '@/layout/ProtectedView';
import { BaseObject, City } from '@/schemas';
import { IUser } from '@/schemas/auth';
import Button from '@/themed/button/Button';
import { HeadCell } from '@/themed/table/DataTable';

import FilteredDataTable from './FilteredDataTable';

const headCells: HeadCell<City>[] = [
  {
    id: 'id',
    label: 'id',
    sortable: true,
  },
  {
    id: 'name',
    label: 'city',
    filterable: true,
    sortable: true,
  },
];

const CityDataTable = FilteredDataTable<City>;

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
      <ProtectedView hasPermission={[CITIES_EDIT]}>
        <Button
          primary
          disabled={loading}
          component={Link}
          to={`${row.id}/edit`}
          label={t('table.actions.edit')}
          buttonType="cell"
        />
      </ProtectedView>
    </div>
  );

  const create = () => (
    <div className="flex flex-row">
      <ProtectedView hasPermission={[CITIES_CREATE]}>
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

  return (
    <>
      <Dialog container={rootElement} fullWidth maxWidth="sm" open={openDialog} onClose={handleClose}>
        <CreateCityDialog handleClose={handleClose} updateTable={updateTable} />
      </Dialog>
      <CityDataTable
        endpoint={`countries/${(user.country as BaseObject).id}/states/${user.state.id}/cities`}
        defaultFilter="name"
        headCells={headCells}
        title={t('menu.cities')}
        subtitle={t('menu.descriptions.cities')}
        create={create}
        actions={actions}
        updateControl={updateControl}
      />
    </>
  );
}
