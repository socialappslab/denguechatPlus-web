import { Box, Dialog, Grid } from '@mui/material';

import useAxios from 'axios-hooks';
import { deserialize, ExistingDocumentObject } from 'jsonapi-fractal';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useUpdateUser from '../../hooks/useUpdateUser';
import { ErrorResponse, FormSelectOption } from '../../schemas';
import { ChangeUserRoleInputType, IUser, UserUpdate } from '../../schemas/auth';
import { Role } from '../../schemas/entities';
import Button from '../../themed/button/Button';
import FormInput from '../../themed/form-input/FormInput';
import FormMultipleSelect from '../../themed/form-multiple-select/FormMultipleSelect';
import Title from '../../themed/title/Title';
import { convertToFormSelectOptions, extractAxiosErrorData } from '../../util';

export interface ChangeUserRoleDialogProps {
  open: boolean;
  handleClose: () => void;
  updateTable: () => void;
  user: IUser;
}

export function ChangeUserRoleDialog({ open, handleClose, updateTable, user }: ChangeUserRoleDialogProps) {
  const { t } = useTranslation(['register', 'errorCodes']);
  const rootElement = document.getElementById('root-app');
  const { loading, udpateUserMutation } = useUpdateUser(user.id);
  const { enqueueSnackbar } = useSnackbar();
  const [roleOptions, setRoleOptions] = useState<FormSelectOption[]>([]);

  const [{ data: rolesData, loading: loadingRoles }] = useAxios<ExistingDocumentObject, unknown, ErrorResponse>({
    url: '/roles?page[number]=1&page[size]=100&sort=name',
  });

  useEffect(() => {
    if (!rolesData) return;
    const deserializedData = deserialize<Role>(rolesData);
    if (Array.isArray(deserializedData)) {
      const roles = convertToFormSelectOptions(deserializedData);
      setRoleOptions(roles);
    }
  }, [rolesData]);

  const methods = useForm<ChangeUserRoleInputType>({
    defaultValues: {
      roles: user.roles?.map((role) => ({ label: role.name, value: String(role.id) })),
    },
  });

  const {
    handleSubmit,
    setError,
    watch,
    // formState: { isValid, errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<ChangeUserRoleInputType> = async (values) => {
    try {
      const { roles } = values;

      const payload: UserUpdate = {
        roleIds: roles.map((role) => Number(role.value)),
      };

      await udpateUserMutation(payload);
      enqueueSnackbar(t('changeRoles.success'), {
        variant: 'success',
      });
      updateTable();
      handleClose();
    } catch (error) {
      const errorData = extractAxiosErrorData(error);

      // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-explicit-any
      errorData?.errors?.forEach((error: any) => {
        if (error?.field && watch(error.field)) {
          setError(error.field, {
            type: 'manual',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            message: t(`errorCodes:${String(error?.error_code)}` || 'errorCodes:genericField', {
              field: watch(error.field),
            }),
          });
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          enqueueSnackbar(t(`errorCodes:${error?.error_code || 'generic'}`), {
            variant: 'error',
          });
        }
      });

      if (!errorData?.errors || errorData?.errors.length === 0) {
        enqueueSnackbar(t('errorCodes:generic'), {
          variant: 'error',
        });
      }
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" container={rootElement} open={open} onClose={handleClose}>
      <Box className="flex flex-col py-7 px-8" component="div">
        <FormProvider {...methods}>
          <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate autoComplete="off">
            <Title type="section" label={t('changeRoles.title')} className="mb-8" />

            <Grid container spacing={2}>
              {user.firstName && (
                <Grid item xs={12} sm={6}>
                  <FormInput disabled value={user.firstName} name="firstName" label={t('firstName')} type="text" />
                </Grid>
              )}

              {user.lastName && (
                <Grid item xs={12} sm={6}>
                  <FormInput disabled value={user.lastName} name="lastName" label={t('lastName')} type="text" />
                </Grid>
              )}

              {user.username && (
                <Grid item xs={12} sm={6}>
                  <FormInput disabled value={user.username} name="username" label={t('username')} type="text" />
                </Grid>
              )}

              {user.phone && (
                <Grid item xs={12} sm={6}>
                  <FormInput disabled value={user.phone} name="phone" label={t('phone')} type="phone" />
                </Grid>
              )}

              {user.email && (
                <Grid item xs={12} sm={6}>
                  <FormInput disabled value={user.email} name="email" label={t('email')} type="text" />
                </Grid>
              )}

              {user.cityName && (
                <Grid item xs={12} sm={6}>
                  <FormInput disabled value={user.cityName} name="city" label={t('city')} />
                </Grid>
              )}
              {user.neighborhoodName && (
                <Grid item xs={12} sm={6}>
                  <FormInput disabled value={user.neighborhoodName} name="neighborhood" label={t('neighborhood')} />
                </Grid>
              )}

              {user.organizationName && (
                <Grid item xs={12} sm={6}>
                  <FormInput disabled value={user.organizationName} name="organization" label={t('organization')} />
                </Grid>
              )}

              <Grid item xs={12} sm={12}>
                <FormMultipleSelect
                  name="roles"
                  loading={loadingRoles}
                  label={t('roles')}
                  placeholder={t('edit.roles_placeholder')}
                  options={roleOptions}
                />
              </Grid>
            </Grid>
            <div className="mt-4 grid grid-cols-1 gap-4 md:flex md:justify-end md:gap-0">
              <div className="md:mr-2">
                <Button
                  buttonType="medium"
                  primary={false}
                  disabled={loading}
                  label={t('cancel')}
                  onClick={handleClose}
                />
              </div>

              <div>
                <Button buttonType="medium" label={t('changeRoles.action')} disabled={loading} type="submit" />
              </div>
            </div>
          </Box>
        </FormProvider>
      </Box>
    </Dialog>
  );
}

export default ChangeUserRoleDialog;
