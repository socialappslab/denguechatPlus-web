import { Box, Grid } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';

import useCreateMutation from '@/hooks/useCreateMutation';
import { FormSelectOption } from '@/schemas';
import { CreateRole, CreateRoleInputType, createRoleSchema } from '@/schemas/create';
import { IUser } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import FormSelect from '../../themed/form-select/FormSelect';
import { Title } from '../../themed/title/Title';
import { extractAxiosErrorData } from '../../util';

export interface EditUserProps {
  user: IUser;
}

// Based on DB and https://docs.google.com/spreadsheets/d/1SKZ-qW-5fvgyS1INllLZhXu1emn1__KCKiNZirsJpjo/edit?gid=0#gid=0
const PERMISSIONS = {
  organization: [
    { name: 'index', id: 8 },
    { name: 'create', id: 11 },
    { name: 'update', id: 13 },
    { name: 'destroy', id: 14 },
  ],
  users: [
    { name: 'edit', id: 19 },
    { name: 'update', id: 20 },
    { name: 'destroy', id: 21 },
  ],
  roles: [
    { name: 'show', id: 23 },
    { name: 'edit', id: 26 },
    { name: 'create', id: 25 },
    { name: 'destroy', id: 28 },
  ],
  teams: [
    { name: 'index', id: 1 },
    { name: 'create', id: 4 },
    { name: 'destroy', id: 7 },
    { name: 'update', id: 6 },
  ],
} as const;

interface CreateRoleDialogProps {
  goBack: () => void;
}

export function CreateRoleDialog({ goBack }: CreateRoleDialogProps) {
  const { t } = useTranslation(['register', 'errorCodes', 'permissions', 'admin']);
  const { createMutation: createRoleMutation } = useCreateMutation<CreateRole>('roles');

  const { enqueueSnackbar } = useSnackbar();

  const onGoBackHandler = () => {
    if (goBack) goBack();
  };

  const methods = useForm<CreateRoleInputType>({
    resolver: zodResolver(createRoleSchema()),
    defaultValues: {},
  });

  const {
    handleSubmit,
    setError,
    // setValue,
    watch,
    // formState: { isValid, errors },
  } = methods;

  const permissionOptions = Object.keys(PERMISSIONS).flatMap((resource) => {
    type RoleKey = keyof typeof PERMISSIONS;
    // type RoleItem = (typeof PERMISSIONS)[RoleKey][number];
    return [
      {
        label: t(`permissions:${resource as RoleKey}.title`),
        value: '',
        disabled: true,
      },
      ...PERMISSIONS[resource as RoleKey].map((permission) => {
        return {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          label: t(`permissions:${resource as RoleKey}.${permission.name}`),
          value: permission.id,
        };
      }),
    ];
  });

  const onSubmitHandler: SubmitHandler<CreateRoleInputType> = async (values) => {
    try {
      const { name, permissionIds } = values;

      const payload: CreateRole = {
        name,
        permissionIds,
      };
      await createRoleMutation(payload);
      enqueueSnackbar(t('edit.success'), {
        variant: 'success',
      });
      onGoBackHandler();
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
              <FormSelect
                multiple
                name="permissionIds"
                className="mt-2"
                label={t('admin:roles.form.permissions')}
                options={permissionOptions as FormSelectOption[]}
              />
            </Grid>
          </Grid>

          <div className="mt-8 grid grid-cols-1 gap-4 md:flex md:justify-end md:gap-0">
            <div className="md:mr-2">
              <Button buttonType="large" label={t('edit.action')} disabled={false} type="submit" />
            </div>

            <div>
              <Button buttonType="large" primary={false} disabled={false} label={t('back')} onClick={onGoBackHandler} />
            </div>
          </div>
        </Box>
      </FormProvider>
    </div>
  );
}

export default CreateRoleDialog;
