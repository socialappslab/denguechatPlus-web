import { Box, Grid } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useSnackbar } from 'notistack';

import useAxios from 'axios-hooks';
import { useEffect, useState } from 'react';
import useUpdateMutation from '@/hooks/useUpdateMutation';
import { FormSelectOption } from '@/schemas';
import { CreateRoleInputType } from '@/schemas/create';
import { Permission, Role } from '@/schemas/entities';
import { UpdateRole } from '@/schemas/update';
import FormMultipleSelect from '@/themed/form-multiple-select/FormMultipleSelect';
import { IUser } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import { extractAxiosErrorData } from '../../util';

export interface EditUserProps {
  user: IUser;
}

interface CreateRoleDialogProps {
  role: Role | null;
  handleClose: () => void;
  updateTable: () => void;
}

export function EditRoleDialog({ role, handleClose, updateTable }: CreateRoleDialogProps) {
  const { t } = useTranslation(['register', 'errorCodes', 'permissions', 'admin']);
  const { udpateMutation: updateRoleMutation } = useUpdateMutation<UpdateRole, Role>(`roles/${role?.id}`);

  const [permissionsOptions, setPermissionsOptions] = useState<FormSelectOption[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const [{ data, loading }] = useAxios({
    url: `/permissions`,
  });

  const normalizePermissions = (rows: Permission[]): FormSelectOption[] => {
    if (!rows) return [];
    return rows.map((row: Permission) => {
      const attr = row.attributes;
      return { label: `${attr.resource}.${attr.name}`, value: String(attr.id) };
    });
  };

  useEffect(() => {
    if (!loading) {
      const normalizedPermissions = normalizePermissions(data.data);
      setPermissionsOptions(normalizedPermissions);
    }
  }, [data, loading]);

  const methods = useForm<CreateRoleInputType>({
    defaultValues: {
      name: role?.name,
      permissionIds: role?.permissions.data.map((permission) => ({
        value: String(permission.attributes.id),
        label: `${permission.attributes.resource}.${permission.attributes.name}`,
      })),
    },
  });

  const {
    handleSubmit,
    setError,
    // setValue,
    watch,
    // formState: { isValid, errors },
  } = methods;

  //  @ts-expect-error option.label is a dynamic value that does not match with our resources.ts
  const renderOption = (option: FormSelectOption): string => t(`permissions:${option.label}`);

  const onSubmitHandler: SubmitHandler<CreateRoleInputType> = async (values) => {
    try {
      const { name, permissionIds } = values;

      const payload: UpdateRole = {
        role: {
          name,
          permissionIds: permissionIds.map((permission: FormSelectOption) => parseInt(permission.value, 10)),
        },
      };
      await updateRoleMutation(payload);
      enqueueSnackbar(t('edit.success'), {
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
    <div className="flex flex-col py-6 px-4">
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          noValidate
          autoComplete="off"
          className="w-full p-8"
        >
          <Title type="section" className="self-center mb-8i w-full" label={t('admin:roles.create_role')} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormInput
                className="mt-2"
                name="name"
                label={t('admin:roles.form.name')}
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormMultipleSelect
                name="permissionIds"
                loading={loading}
                label={t('roles')}
                placeholder={t('edit.roles_placeholder')}
                options={permissionsOptions}
                renderOption={renderOption}
              />
            </Grid>
          </Grid>

          <div className="mt-8 grid grid-cols-1 gap-4 md:flex md:justify-end md:gap-0">
            <div className="md:mr-2">
              <Button buttonType="large" label={t('edit.action')} disabled={false} type="submit" />
            </div>

            <div>
              <Button buttonType="large" primary={false} disabled={false} label={t('back')} onClick={handleClose} />
            </div>
          </div>
        </Box>
      </FormProvider>
    </div>
  );
}

export default EditRoleDialog;
