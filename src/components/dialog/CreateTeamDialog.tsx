import { Box, Grid } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useSnackbar } from 'notistack';

import { deserialize, ExistingDocumentObject } from 'jsonapi-fractal';
import { useEffect, useState } from 'react';
import { ErrorResponse } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import useCreateMutation from '@/hooks/useCreateMutation';
import { BaseObject, FormSelectOption } from '@/schemas';
import { CreateTeam, CreateTeamInputType, createTeamSchema } from '@/schemas/create';
import { Team } from '@/schemas/entities';
import FormMultipleSelect from '@/themed/form-multiple-select/FormMultipleSelect';
import FormSelect from '@/themed/form-select/FormSelect';
import { IUser } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import { convertToFormSelectOptions, extractAxiosErrorData } from '../../util';
import useStateContext from '@/hooks/useStateContext';

export interface EditUserProps {
  user: IUser;
}

interface CreateTeamDialogProps {
  handleClose: () => void;
  updateTable: () => void;
}

export function CreateTeamDialog({ handleClose, updateTable }: CreateTeamDialogProps) {
  const { state } = useStateContext();
  const user = state.user as IUser;
  const { t } = useTranslation(['register', 'errorCodes', 'admin', 'translation']);
  const { createMutation: createTeamMutation, loading: mutationLoading } = useCreateMutation<CreateTeam, Team>(
    `/teams`,
  );

  const [userOptions, setUserOptions] = useState<FormSelectOption[]>([]);

  const [{ data: usersData, loading: loadingUsers }] = useAxios<ExistingDocumentObject, unknown, ErrorResponse>({
    url: '/users?filter[roles][name]=brigadista&filter[without_team]=true',
  });

  useEffect(() => {
    if (!usersData) return;
    const deserializedData = deserialize(usersData);
    if (Array.isArray(deserializedData)) {
      const users = convertToFormSelectOptions(deserializedData, 'firstName', 'lastName');
      setUserOptions(users);
    }
  }, [usersData]);

  const [organizationOptions, setOrganizationOptions] = useState<FormSelectOption[]>([]);

  const [{ data: organizationsData, loading: loadingOrganizations }] = useAxios<
    ExistingDocumentObject,
    unknown,
    ErrorResponse
  >({
    url: '/organizations',
  });

  useEffect(() => {
    if (!organizationsData) return;
    const deserializedData = deserialize(organizationsData);
    if (Array.isArray(deserializedData)) {
      const organizations = convertToFormSelectOptions(deserializedData);
      setOrganizationOptions(organizations);
    }
  }, [organizationsData]);

  const [sectorOptions, setSectorOptions] = useState<FormSelectOption[]>([]);

  const [{ data: sectorsData, loading: loadingSectors }] = useAxios<ExistingDocumentObject, unknown, ErrorResponse>({
    url: '/neighborhoods',
  });

  useEffect(() => {
    if (!sectorsData) return;
    const deserializedData = deserialize(sectorsData);
    if (Array.isArray(deserializedData)) {
      const sectors = convertToFormSelectOptions(deserializedData);
      setSectorOptions(sectors);
    }
  }, [sectorsData]);

  const [wedgeOptions, setWedgeOptions] = useState<FormSelectOption[]>([]);

  const [{ data: wedgesData, loading: loadingWedges }] = useAxios<ExistingDocumentObject, unknown, ErrorResponse>({
    url: '/wedges',
  });

  useEffect(() => {
    if (!wedgesData) return;
    const deserializedData = deserialize(wedgesData);
    if (Array.isArray(deserializedData)) {
      const wedges = convertToFormSelectOptions(deserializedData);
      setWedgeOptions(wedges);
    }
  }, [wedgesData]);

  const [cityOptions, setCityOptions] = useState<FormSelectOption[]>([]);

  const [{ data: cityData, loading: loadingCities }] = useAxios<ExistingDocumentObject, unknown, ErrorResponse>({
    url: `countries/${(user.country as BaseObject).id}/states/${user.state.id}/cities`,
  });

  useEffect(() => {
    if (!cityData) return;
    const deserializedData = deserialize(cityData);
    if (Array.isArray(deserializedData)) {
      const cities = convertToFormSelectOptions(deserializedData);
      setCityOptions(cities);
    }
  }, [cityData]);

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<CreateTeamInputType>({
    resolver: zodResolver(createTeamSchema()),
    defaultValues: {},
  });

  const { handleSubmit, setError, watch } = methods;

  const onSubmitHandler: SubmitHandler<CreateTeamInputType> = async (values) => {
    try {
      const payload: CreateTeam = {
        ...values,
        memberIds: values.memberIds.map((member) => member.value),
      };
      await createTeamMutation(payload);
      enqueueSnackbar(t('translation:success'), {
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
          enqueueSnackbar(t([`errorCodes:${error?.error_code}`, 'errorCodes:generic']), {
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
          <Title type="section" className="self-center mb-8i w-full" label={t('admin:teams.create_team')} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormInput
                className="mt-2"
                name="name"
                label={t('admin:teams.form.name')}
                type="text"
                placeholder={t('admin:teams.form.name_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormMultipleSelect
                name="memberIds"
                loading={loadingUsers}
                label={t('admin:teams.form.members')}
                placeholder={t('admin:teams.form.members_placeholder')}
                options={userOptions}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormSelect
                name="leaderId"
                className="mt-2"
                label={t('admin:teams.form.team_leader')}
                loading={loadingUsers}
                options={userOptions}
                placeholder={t('admin:teams.form.team_leader_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormSelect
                name="organizationId"
                className="mt-2"
                label={t('admin:teams.form.organization')}
                loading={loadingOrganizations}
                options={organizationOptions}
                placeholder={t('admin:teams.form.organization_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormSelect
                name="sectorId"
                className="mt-2"
                label={t('admin:teams.form.sector')}
                loading={loadingSectors}
                options={sectorOptions}
                placeholder={t('admin:teams.form.sector_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormSelect
                name="cityId"
                className="mt-2"
                label={t('admin:teams.form.city')}
                loading={loadingCities}
                options={cityOptions}
                placeholder={t('admin:teams.form.city_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormSelect
                name="wedgeId"
                className="mt-2"
                label={t('admin:teams.form.wedge')}
                loading={loadingWedges}
                options={wedgeOptions}
                placeholder={t('admin:teams.form.wedge_placeholder')}
              />
            </Grid>
          </Grid>

          <div className="mt-8 grid grid-cols-1 gap-4 md:flex md:justify-end md:gap-0">
            <div className="md:mr-2">
              <Button buttonType="large" label={t('edit.action')} disabled={mutationLoading} type="submit" />
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

export default CreateTeamDialog;
