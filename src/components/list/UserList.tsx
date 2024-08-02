import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ProtectedView from '../../layout/ProtectedView';
import { IUser, UserStatusValues } from '../../schemas/auth';
import Button from '../../themed/button/Button';
import { HeadCell } from '../../themed/table/DataTable';
import ApproveUserDialog from '../dialog/ApproveUserDialog';
import ChangeUserRoleDialog from '../dialog/ChangeUserRoleDialog';
import FilteredDataTable from './FilteredDataTable';

const headCells: HeadCell<IUser>[] = [
  {
    id: 'id',
    label: 'id',
    sortKey: 'user_account.id',
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
  const [openStatusDialog, setOpenStatusDialog] = useState<boolean>(false);

  const [openRolesDialog, setOpenRolesDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleClose = () => {
    setOpenStatusDialog(false);
    setOpenRolesDialog(false);
    setSelectedUser(null);
  };

  const updateTable = () => {
    setUpdateControl((prev) => prev + 1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow
  const actions = (row: IUser, loading?: boolean) => (
    <div className="flex flex-row">
      <ProtectedView hasPermission={['users-edit']}>
        <Button primary component={Link} to={`${row.id}/edit`} label={t('table.actions.edit')} buttonType="cell" />
      </ProtectedView>

      {(row.status === 'pending' || row.status === 'locked') && (
        <ProtectedView hasPermission={['users-users_confirm_account']}>
          <Button
            primary
            disabled={loading}
            onClick={() => {
              setSelectedUser(row);
              setOpenStatusDialog(true);
            }}
            label={row.status === 'pending' ? t('table.actions.approve') : t('table.actions.unlock')}
            buttonType="cell"
          />
        </ProtectedView>
      )}
      <ProtectedView hasPermission={['users-update']}>
        <Button
          primary
          disabled={loading}
          onClick={() => {
            setSelectedUser(row);
            setOpenRolesDialog(true);
          }}
          label={t('table.actions.roles')}
          buttonType="cell"
        />
      </ProtectedView>
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
        <>
          <ApproveUserDialog
            open={openStatusDialog}
            updateTable={updateTable}
            handleClose={handleClose}
            user={selectedUser}
          />
          <ChangeUserRoleDialog
            open={openRolesDialog}
            updateTable={updateTable}
            handleClose={handleClose}
            user={selectedUser}
          />
        </>
      )}
    </>
  );
}
