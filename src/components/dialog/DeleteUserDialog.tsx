import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/api/axios';
import type { IUser } from '../../schemas/auth';
import { extractAxiosErrorData } from '../../util';

function useDeleteUser(idParam?: string) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      await authApi.delete(`admin/users/${idParam}`);
    },
  });

  return { deleteUserMutation: mutateAsync, loading: isPending };
}

export interface DeleteUserDialogProps {
  open: boolean;
  handleClose: () => void;
  updateTable: () => void;
  user: IUser;
}

export function DeleteUserDialog({ open, handleClose, updateTable, user }: DeleteUserDialogProps) {
  const { t } = useTranslation(['admin', 'register', 'errorCodes']);
  const rootElement = document.getElementById('root-app');
  const { loading, deleteUserMutation } = useDeleteUser(user.id);
  const { enqueueSnackbar } = useSnackbar();

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || user.phone;

  const confirmDelete = async () => {
    try {
      await deleteUserMutation();
      updateTable();
      handleClose();
      enqueueSnackbar(t('admin:users.delete.success'), {
        variant: 'success',
      });
    } catch (error) {
      const errorData = extractAxiosErrorData(error);

      errorData?.errors?.forEach((err: { error_code?: string }) => {
        enqueueSnackbar(t(`errorCodes:${err?.error_code || 'generic'}`), {
          variant: 'error',
        });
      });

      if (!errorData?.errors || errorData?.errors.length === 0) {
        enqueueSnackbar(t('errorCodes:generic'), {
          variant: 'error',
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} container={rootElement} role="alertdialog">
      <DialogTitle>{t('admin:users.delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('admin:users.delete.confirm', { name: displayName })}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t('register:cancel')}
        </Button>
        <Button onClick={confirmDelete} color="error" disabled={loading}>
          {t('admin:users.delete.action')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteUserDialog;
