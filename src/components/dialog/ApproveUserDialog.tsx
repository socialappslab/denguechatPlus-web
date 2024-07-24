import { Dialog, Grid } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useApproveUser from '../../hooks/useApproveUser';
import { createRegisterSchema, IUser, RegisterInputType } from '../../schemas/auth';
import Button from '../../themed/button/Button';
import FormInput from '../../themed/form-input/FormInput';
import Title from '../../themed/title/Title';
import { extractAxiosErrorData } from '../../util';

export interface ApproveUserDialogProps {
  open: boolean;
  handleClose: () => void;
  updateTable: () => void;
  user: IUser;
}

export function ApproveUserDialog({ open, handleClose, updateTable, user }: ApproveUserDialogProps) {
  const { t } = useTranslation(['register', 'errorCodes']);
  const rootElement = document.getElementById('root-app');
  const { loading, approveUserMutation } = useApproveUser(user.id);
  const { enqueueSnackbar } = useSnackbar();

  const confirmApprove = async () => {
    try {
      await approveUserMutation({ status: 'active' });
      updateTable();
      handleClose();
      enqueueSnackbar(t('approve.success'), {
        variant: 'success',
      });
    } catch (error) {
      const errorData = extractAxiosErrorData(error);
      // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-explicit-any
      errorData?.errors?.forEach((error: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        enqueueSnackbar(t(`errorCodes:${error?.error_code || 'generic'}`), {
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

  const methods = useForm<RegisterInputType>({
    resolver: zodResolver(createRegisterSchema()),
  });

  return (
    <Dialog fullWidth maxWidth="sm" container={rootElement} open={open} onClose={handleClose}>
      <div className="flex flex-col py-7 px-8">
        <Title type="section" label={t('approve.title')} className="mb-8" />
        <FormProvider {...methods}>
          <Grid container spacing={2}>
            {user.firstName && (
              <Grid item xs={12} sm={6}>
                <FormInput
                  disabled
                  value={user.firstName}
                  name="firstName"
                  label={t('firstName')}
                  type="text"
                  placeholder={t('firstName_placeholder')}
                />
              </Grid>
            )}

            {user.lastName && (
              <Grid item xs={12} sm={6}>
                <FormInput
                  disabled
                  value={user.lastName}
                  name="lastName"
                  label={t('lastName')}
                  type="text"
                  placeholder={t('lastName_placeholder')}
                />
              </Grid>
            )}

            {user.username && (
              <Grid item xs={12} sm={6}>
                <FormInput
                  disabled
                  value={user.username}
                  name="username"
                  label={t('username')}
                  type="text"
                  placeholder={t('username_placeholder')}
                />
              </Grid>
            )}

            {user.phone && (
              <Grid item xs={12} sm={6}>
                <FormInput
                  disabled
                  value={user.phone}
                  name="phone"
                  label={t('phone')}
                  type="phone"
                  placeholder={t('phone_placeholder')}
                />
              </Grid>
            )}

            {user.email && (
              <Grid item xs={12} sm={6}>
                <FormInput
                  disabled
                  value={user.email}
                  name="email"
                  label={t('email')}
                  type="text"
                  placeholder={t('email_placeholder')}
                />
              </Grid>
            )}

            {user.cityName && (
              <Grid item xs={12} sm={6}>
                <FormInput
                  disabled
                  value={user.cityName}
                  name="city"
                  label={t('city')}
                  placeholder={t('city_placeholder')}
                />
              </Grid>
            )}
            {user.neighborhoodName && (
              <Grid item xs={12} sm={6}>
                <FormInput
                  disabled
                  value={user.neighborhoodName}
                  name="neighborhood"
                  label={t('neighborhood')}
                  placeholder={t('neighborhood_placeholder')}
                />
              </Grid>
            )}

            {user.organizationName && (
              <Grid item xs={12} sm={6}>
                <FormInput
                  disabled
                  value={user.organizationName}
                  name="organization"
                  label={t('organization')}
                  placeholder={t('organization_placeholder')}
                />
              </Grid>
            )}
          </Grid>
        </FormProvider>
        <div className="mt-4 grid grid-cols-1 gap-4 md:flex md:justify-end md:gap-0">
          <div className="md:mr-2">
            <Button buttonType="medium" primary={false} disabled={loading} label={t('cancel')} onClick={handleClose} />
          </div>

          <div>
            <Button
              buttonType="medium"
              label={user.status === 'pending' ? t('approve.action') : t('approve.actionUnlock')}
              disabled={loading}
              onClick={confirmApprove}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ApproveUserDialog;
