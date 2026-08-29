import { Box, Grid } from '@mui/material';

import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useSnackbar } from 'notistack';

import { deserialize, type ExistingDocumentObject } from 'jsonapi-fractal';
import { useEffect, useMemo, useState } from 'react';
import type { ErrorResponse } from 'react-router';
import useAxios from 'axios-hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import useCreateMutation from '@/hooks/useCreateMutation';
import type { BaseObject, FormSelectOption } from '@/schemas';
import { createTeamSchema, type CreateTeam, type CreateTeamInputType } from '@/schemas/create';
import type { Team } from '@/schemas/entities';
import FormMultipleSelect from '@/themed/form-multiple-select/FormMultipleSelect';
import FormSelect from '@/themed/form-select/FormSelect';
import type { IUser } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import FormInput from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import { convertToFormSelectOptions, extractAxiosErrorData } from '../../util';
import useStateContext from '@/hooks/useStateContext';
import { authApi } from '@/api/axios';

export interface EditUserProps {
  user: IUser;
}

interface CreateTeamDialogProps {
  handleClose: () => void;
  updateTable: () => void;
}

function useWedges(sectorId: string) {
  return useQuery({
    enabled: !!sectorId,
    queryKey: ['wedges', sectorId],
    queryFn: async () => (await authApi.get('/wedges', { params: { 'filter[sector_id]': sectorId } })).data,
  });
}

export function CreateTeamDialog({ handleClose, updateTable }: CreateTeamDialogProps) {
  const { state } = useStateContext();
  const user = state.user as IUser;
  const { t } = useTranslation(['register', 'errorCodes', 'admin', 'translation']);

  const methods = useForm<CreateTeamInputType>({
    resolver: zodResolver(createTeamSchema()),
    defaultValues: {},
  });
  const { handleSubmit, resetField, setError, control, getValues } = methods;

  const sectorId = useWatch({ control, name: 'sectorId' });
  const wedges = useWedges(sectorId);
  const wedgeOptions = useMemo(
    () =>
      // @ts-expect-error
      wedges.data?.data?.map((wedge) => ({
        label: wedge.attributes.name,
        value: wedge.id,
      })) ?? [],
    [wedges],
  );

  const [userOptions, setUserOptions] = useState<FormSelectOption[]>([]);

  const { createMutation: createTeamMutation, loading: mutationLoading } = useCreateMutation<CreateTeam, Team>(
    `/teams`,
  );

  const [{ data: usersData, loading: loadingUsers }] = useAxios<ExistingDocumentObject, unknown, ErrorResponse>({
    url: '/users?filter[roles][name]=brigadista&filter[without_team]=true&sort=user_profiles.first_name&order=asc',
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
    url: '/organizations?sort=name',
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

  const [cityOptions, setCityOptions] = useState<FormSelectOption[]>([]);

  const [{ data: cityData, loading: loadingCities }] = useAxios<ExistingDocumentObject, unknown, ErrorResponse>({
    url: `countries/${(user.country as BaseObject).id}/states/${user.state.id}/cities?sort=name`,
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

       
      errorData?.errors?.forEach((error: any) => {
        if (error?.field && getValues(error.field)) {
          setError(error.field, {
            type: 'manual',
             
            // @ts-ignore
            message: t(`errorCodes:${String(error?.error_code)}` || 'errorCodes:genericField', {
              field: getValues(error.field),
            }),
          });
        } else {
           
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
            <Grid
              size={{
                xs: 12,
                sm: 12
              }}>
              <FormInput
                className="mt-2"
                name="name"
                label={t('admin:teams.form.name')}
                type="text"
                placeholder={t('admin:teams.form.name_placeholder')}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 12
              }}>
              <FormMultipleSelect
                name="memberIds"
                loading={loadingUsers}
                label={t('admin:teams.form.members')}
                placeholder={t('admin:teams.form.members_placeholder')}
                options={userOptions}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 12
              }}>
              <FormSelect
                name="cityId"
                className="mt-2"
                label={t('admin:teams.form.city')}
                loading={loadingCities}
                options={cityOptions}
                placeholder={t('admin:teams.form.city_placeholder')}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 12
              }}>
              <FormSelect
                name="sectorId"
                className="mt-2"
                label={t('admin:teams.form.sector')}
                loading={loadingSectors}
                options={sectorOptions}
                placeholder={t('admin:teams.form.sector_placeholder')}
                onChange={() => {
                  resetField('wedgeId');
                }}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 12
              }}>
              <FormSelect
                name="wedgeId"
                className="mt-2"
                label={t('admin:teams.form.wedge')}
                loading={wedges.isLoading}
                disabled={!sectorId}
                options={wedgeOptions}
                placeholder={t('admin:teams.form.wedge_placeholder')}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 12
              }}>
              <FormSelect
                name="organizationId"
                className="mt-2"
                label={t('admin:teams.form.organization')}
                loading={loadingOrganizations}
                options={organizationOptions}
                placeholder={t('admin:teams.form.organization_placeholder')}
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
