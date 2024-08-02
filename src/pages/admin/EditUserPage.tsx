import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container, Grid } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import useAxios from 'axios-hooks';
import { ExistingDocumentObject, deserialize } from 'jsonapi-fractal';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_OPTION_CITY_NAME } from '../../constants';
import useUpdateUser from '../../hooks/useUpdateUser';
import { BaseObject, ErrorResponse, FormSelectOption, Locations } from '../../schemas';
import { IUser, UpdateUserInputType, UpdateUserSchema, UserUpdate } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import FormSelect from '../../themed/form-select/FormSelect';
import { Title } from '../../themed/title/Title';
import {
  convertToFormSelectOptions,
  createCityOptions,
  createNeighborhoodOptions,
  extractAxiosErrorData,
  findOptionByName,
} from '../../util';

export interface EditUserProps {
  user: IUser;
}
export function EditUser({ user }: EditUserProps) {
  const { t } = useTranslation(['register', 'errorCodes']);
  const navigate = useNavigate();

  const { udpateUserMutation, loading } = useUpdateUser(user.id);
  const { enqueueSnackbar } = useSnackbar();
  const [neighborhoodOptions, setNeighborhoodOptions] = useState<FormSelectOption[]>([]);
  const [cityOptions, setCityOptions] = useState<FormSelectOption[]>([]);
  const [organizationOptions, setOrganizationOptions] = useState<FormSelectOption[]>([]);
  const [teamOptions, setTeamOptions] = useState<FormSelectOption[]>([]);

  const [{ data: locationsData, loading: loadingLocations }] = useAxios<Locations[], unknown, ErrorResponse>({
    url: '/locations?filter[country_id]=1',
  });

  const [{ data: organizationData, loading: loadingOrganizations }] = useAxios<
    ExistingDocumentObject,
    unknown,
    ErrorResponse
  >({
    url: '/organizations?page[number]=1&page[size]=100&sort=name',
  });

  const [{ data: teamData, loading: loadingTeams }] = useAxios<ExistingDocumentObject, unknown, ErrorResponse>({
    url: 'admin/teams?page[number]=1&page[size]=100&sort=name',
  });

  const onGoBackHandler = () => {
    navigate('/admin/users');
  };

  const methods = useForm<UpdateUserInputType>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues:
      {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        team: user.team !== null ? String((user?.team as BaseObject)?.id) : '',
        organization: user.organization !== null ? String((user?.organization as BaseObject)?.id) : '',
        neighborhood: user.neighborhood !== null ? String((user?.neighborhood as BaseObject)?.id) : '',
        city: user.city !== null ? String((user?.city as BaseObject)?.id) : '',
        phone: user.phone || '',
        email: user.email || '',
        username: user.username || '',
      } || {},
  });

  const { handleSubmit, setError, setValue, watch } = methods;

  useEffect(() => {
    if (!locationsData) return;
    const cities = createCityOptions(locationsData[0]?.states);
    setCityOptions(cities);

    if (cities.length > 0) {
      const defaultOption = findOptionByName(cities, DEFAULT_OPTION_CITY_NAME);
      if (defaultOption) {
        // For city (Iquitos)
        const neighborhoods = createNeighborhoodOptions(locationsData[0]?.states, defaultOption.value);
        setNeighborhoodOptions(neighborhoods);
      }
    }
  }, [locationsData, user, setValue]);

  useEffect(() => {
    if (!organizationData) return;
    const deserializedData = deserialize(organizationData);
    if (Array.isArray(deserializedData)) {
      const organizations = convertToFormSelectOptions(deserializedData);
      setOrganizationOptions(organizations);
    }
  }, [organizationData]);

  useEffect(() => {
    if (!teamData) return;
    const deserializedData = deserialize(teamData);
    if (Array.isArray(deserializedData)) {
      const teams = convertToFormSelectOptions(deserializedData);
      setTeamOptions(teams);
    }
  }, [teamData]);

  const onSubmitHandler: SubmitHandler<UpdateUserInputType> = async (values) => {
    try {
      const { phone, username, password, email, firstName, lastName, organization, team, city, neighborhood } = values;

      const payload: UserUpdate = {
        username,
        phone,
        password: password !== '' ? password : undefined,
        userProfileAttributes: {
          firstName,
          lastName,
          email: email !== '' ? email : undefined,
          organizationId: organization ? Number(organization) : undefined,
          cityId: city ? Number(city) : undefined,
          neighborhoodId: neighborhood ? Number(neighborhood) : undefined,
          teamId: team ? Number(team) : undefined,
        },
      };
      await udpateUserMutation(payload);
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
    <Container
      maxWidth={false}
      className="bg-background"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate autoComplete="off">
          <Title type="section" className="self-center mb-8" label={t('edit.title')} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="firstName"
                label={t('firstName')}
                type="text"
                placeholder={t('edit.firstName_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="lastName"
                label={t('lastName')}
                type="text"
                placeholder={t('edit.lastName_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="username"
                label={t('username')}
                type="text"
                placeholder={t('edit.username_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="phone"
                label={t('phone')}
                type="phone"
                placeholder={t('edit.phone_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="email"
                label={t('email')}
                type="text"
                placeholder={t('edit.email_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                name="organization"
                className="mt-2"
                label={t('organization')}
                loading={loadingOrganizations}
                options={organizationOptions}
                placeholder={t('edit.organization_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                name="password"
                className="mt-2"
                label={t('password')}
                type="password"
                helperText={t('passwordHelperText')}
                placeholder={t('edit.password_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                name="passwordConfirm"
                className="mt-2"
                label={t('passwordConfirm')}
                type="password"
                placeholder={t('edit.passwordConfirm_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                name="city"
                className="mt-2"
                label={t('city')}
                options={cityOptions}
                loading={loadingLocations}
                placeholder={t('edit.city_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                name="neighborhood"
                className="mt-2"
                label={t('neighborhood')}
                options={neighborhoodOptions}
                loading={loadingLocations}
                placeholder={t('edit.neighborhood_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                name="team"
                className="mt-2"
                label={t('team')}
                options={teamOptions}
                loading={loadingTeams}
                placeholder={t('edit.team_placeholder')}
              />
            </Grid>
          </Grid>

          <div className="mt-8 grid grid-cols-1 gap-4 md:flex md:justify-start md:gap-0">
            <div className="md:mr-2">
              <Button buttonType="large" label={t('edit.action')} disabled={loading} type="submit" />
            </div>

            <div>
              <Button
                buttonType="large"
                primary={false}
                disabled={loading}
                label={t('back')}
                onClick={onGoBackHandler}
              />
            </div>
          </div>
        </Box>
      </FormProvider>
    </Container>
  );
}

export default EditUser;