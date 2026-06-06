import { Dialog } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/api/axios';
import type { IUser } from '../../schemas/auth';
import Button from '../../themed/button/Button';
import Title from '../../themed/title/Title';
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
    <Dialog fullWidth maxWidth="xs" container={rootElement} open={open} onClose={handleClose}>
      <div className="flex flex-col py-7 px-8">
        <Title type="section" label={t('admin:users.delete.title')} className="mb-4" />
        <p className="text-sm text-darkest">
          {t('admin:users.delete.confirm', { name: displayName })}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:flex md:justify-end md:gap-0">
          <div className="md:mr-2">
            <Button buttonType="medium" primary={false} disabled={loading} label={t('register:cancel')} onClick={handleClose} />
          </div>

          <div>
            <Button
              buttonType="medium"
              label={t('admin:users.delete.action')}
              disabled={loading}
              onClick={confirmDelete}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default DeleteUserDialog;
