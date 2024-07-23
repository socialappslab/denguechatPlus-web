import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IUser, UserStatusValues } from '../../schemas/auth';
import Button from '../../themed/button/Button';
import { HeadCell } from '../../themed/table/DataTable';
import ApproveUserDialog from '../dialog/ApproveUserDialog';
import FilteredDataTable from './FilteredDataTable';

const headCells: HeadCell<IUser>[] = [
  {
    id: 'id',
    label: 'id',
    sortKey: 'user_account.id',
    filterable: true,
    sortable: true,
  },
  {
    id: 'username',
    label: 'username',
    sortKey: 'user_account.username',
    filterable: true,
    sortable: true,
  },
  {
    id: 'phone',
    label: 'phone',
    sortKey: 'user_account.phone',
    filterable: true,
    sortable: true,
  },
  {
    id: 'firstName',
    label: 'firstName',
    sortKey: 'user_profiles.first_name',
    filterable: true,
    sortable: true,
  },
  {
    id: 'lastName',
    label: 'lastName',
    sortKey: 'user_profiles.lastName',
    filterable: true,
    sortable: true,
  },
  {
    id: 'status',
    label: 'status',
    type: 'enum',
    filterable: true,
    filterOptions: Object.values(UserStatusValues),
    sortable: false,
  },
  {
    id: 'createdAt',
    label: 'createdAt',
    sortKey: 'user_account.createdAt',
    type: 'date',
    sortable: true,
  },
];

const IUserDataTable = FilteredDataTable<IUser>;

export default function UserList() {
  const { t } = useTranslation('translation');
  const [updateControl, setUpdateControl] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const updateTable = () => {
    setUpdateControl((prev) => prev + 1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow
  const actions = (row: IUser, loading?: boolean) => (
    <div className="flex flex-row">
      <Button
        primary
        disabled
        component={Link}
        to={`/edit/${row.id}`}
        label={t('table.actions.edit')}
        buttonType="cell"
      />

      {row.status === 'pending' && (
        <Button
          primary
          disabled={loading}
          onClick={() => {
            setSelectedUser(row);
            setOpenDialog(true);
          }}
          label={t('table.actions.approve')}
          buttonType="cell"
        />
      )}
    </div>
  );

  return (
    <>
      <IUserDataTable
        updateControl={updateControl}
        endpoint="users"
        defaultFilter="username"
        headCells={headCells}
        title={t('menu.users')}
        subtitle={t('menu.descriptions.users')}
        actions={actions}
      />
      {selectedUser && (
        <ApproveUserDialog open={openDialog} updateTable={updateTable} handleClose={handleClose} user={selectedUser} />
      )}
    </>
  );
}
