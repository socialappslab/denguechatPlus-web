import {
  CheckCircleOutlined as CheckCircleOutlineIcon,
  DeleteOutlined as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
  LockOpenOutlined as LockOpenOutlinedIcon,
  ManageAccountsOutlined as ManageAccountsOutlinedIcon,
} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { USERS_DESTROY } from '@/constants/permissions';
import useStateContext from '@/hooks/useStateContext';
import ProtectedView from '../../layout/ProtectedView';
import { UserStatusValues, type IUser } from '../../schemas/auth';
import type { HeadCell } from '../../themed/table/DataTable';
import ApproveUserDialog from '../dialog/ApproveUserDialog';
import ChangeUserRoleDialog from '../dialog/ChangeUserRoleDialog';
import DeleteUserDialog from '../dialog/DeleteUserDialog';
import FilteredDataTable from './FilteredDataTable';
import PendingUsersAlert from './PendingUsersAlert';

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

interface UsersMeta {
  pending_count?: number;
}

const IUserDataTable = FilteredDataTable<IUser, UsersMeta>;

export default function UserList() {
  const { t } = useTranslation('translation');
  const { state } = useStateContext();
  const currentUser = state.user as IUser;
  const [updateControl, setUpdateControl] = useState<number>(0);
  const [openStatusDialog, setOpenStatusDialog] = useState<boolean>(false);
  const [openRolesDialog, setOpenRolesDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleClose = () => {
    setOpenStatusDialog(false);
    setOpenRolesDialog(false);
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const updateTable = () => {
    setUpdateControl((prev) => prev + 1);
  };

  const actions = (row: IUser, loading?: boolean) => (
    <div className="flex flex-row items-center gap-1">
      <ProtectedView hasPermission={['users-update']}>
        <Tooltip title={t('table.actions.edit')}>
          <IconButton component={Link} to={`${row.id}/edit`} color="primary" disabled={loading} size="small">
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </ProtectedView>

      {(row.status === 'pending' || row.status === 'locked') && (
        <ProtectedView hasPermission={['users-users_confirm_account']}>
          <Tooltip title={row.status === 'pending' ? t('table.actions.approve') : t('table.actions.unlock')}>
            <IconButton
              color="primary"
              disabled={loading}
              size="small"
              onClick={() => {
                setSelectedUser(row);
                setOpenStatusDialog(true);
              }}
            >
              {row.status === 'pending' ? (
                <CheckCircleOutlineIcon fontSize="small" />
              ) : (
                <LockOpenOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </ProtectedView>
      )}
      <ProtectedView hasPermission={['users-update']}>
        <Tooltip title={t('table.actions.roles')}>
          <IconButton
            color="primary"
            disabled={loading}
            size="small"
            onClick={() => {
              setSelectedUser(row);
              setOpenRolesDialog(true);
            }}
          >
            <ManageAccountsOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </ProtectedView>
      {String(row.id) !== String(currentUser.id) && (
        <ProtectedView hasPermission={[USERS_DESTROY]}>
          <Tooltip title={t('table.actions.delete')}>
            <IconButton
              color="error"
              disabled={loading}
              size="small"
              onClick={() => {
                setSelectedUser(row);
                setOpenDeleteDialog(true);
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ProtectedView>
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
        banner={({ meta, applyFilter }) => (
          <ProtectedView hasPermission={['users-users_confirm_account']}>
            <PendingUsersAlert count={meta.pending_count} onSeePending={() => applyFilter('status', 'pending')} />
          </ProtectedView>
        )}
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
          <DeleteUserDialog
            open={openDeleteDialog}
            updateTable={updateTable}
            handleClose={handleClose}
            user={selectedUser}
          />
        </>
      )}
    </>
  );
}
