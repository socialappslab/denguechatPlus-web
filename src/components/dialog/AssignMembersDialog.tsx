import { Box, Grid } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useSnackbar } from 'notistack';

import { zodResolver } from '@hookform/resolvers/zod';
import useAxios from 'axios-hooks';
import { deserialize, ExistingDocumentObject } from 'jsonapi-fractal';
import { useEffect, useState } from 'react';
import { ErrorResponse } from 'react-router-dom';
import { TEAM_MEMBER_ROLE } from '@/constants';
import useUpdateMutation from '@/hooks/useUpdateMutation';
import { FormSelectOption, Member } from '@/schemas';
import { Team } from '@/schemas/entities';
import { UpdateTeam, UpdateTeamInputType, updateTeamSchema } from '@/schemas/update';
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
  team: Team | null;
  handleClose: () => void;
  updateTable: () => void;
}

const returnName = (member: Member) => (member.fullName ? member.fullName : `${member.firstName} ${member.lastName}`);

const convertToFormSelectOptions = (rows: Member[]): FormSelectOption[] => {
  return rows.map((row) => ({ label: returnName(row), value: String(row.id) }));
};

export function AssignMembersDialog({ team, handleClose, updateTable }: CreateRoleDialogProps) {
  const { t } = useTranslation(['register', 'errorCodes', 'permissions', 'admin']);
  const { udpateMutation: updateRoleMutation } = useUpdateMutation<UpdateTeam, Team>(`teams/${team?.id}`);

  const [membersOptions, setMembersOptions] = useState<FormSelectOption[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const [{ data, loading }] = useAxios<ExistingDocumentObject, unknown, ErrorResponse>({
    url: `users?filter[roles]=${TEAM_MEMBER_ROLE}&page[size]=500&page[number]=1`,
  });

  useEffect(() => {
    if (!data) return;
    const deserializedData = deserialize<Member>(data);
    if (Array.isArray(deserializedData)) {
      const members = convertToFormSelectOptions(deserializedData);
      setMembersOptions(members);
    }
  }, [data, loading]);

  const methods = useForm<UpdateTeamInputType>({
    resolver: zodResolver(updateTeamSchema()),
    defaultValues: {
      name: team?.name,
      members: convertToFormSelectOptions(team?.members || []),
    },
  });

  const {
    handleSubmit,
    setError,
    // setValue,
    watch,
    // formState: { isValid, errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<UpdateTeamInputType> = async (values) => {
    try {
      const { name, members } = values;

      const payload: UpdateTeam = {
        team: {
          name,
          memberIds: members.map((member) => member.value),
        },
      };
      await updateRoleMutation(payload);
      enqueueSnackbar(t('admin:teams.edit.success'), {
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
          <Title type="section" className="self-center mb-8i w-full" label={t('admin:teams.edit.edit_team')} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormInput
                className="mt-2"
                name="name"
                label={t('admin:teams.form.name')}
                type="text"
                disabled
                placeholder={t('admin:teams.form.name_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormMultipleSelect
                name="members"
                loading={loading}
                label={t('admin:teams.form.members')}
                placeholder={t('admin:teams.form.members_placeholder')}
                options={membersOptions}
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

export default AssignMembersDialog;
