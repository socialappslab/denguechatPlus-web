import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container, Grid } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ExistingDocumentObject, deserialize } from 'jsonapi-fractal';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxiosNoAuth } from '../../api/axios';
import { DEFAULT_OPTION_CITY_NAME } from '../../constants';
import useUpdateUser from '../../hooks/useUpdateUser';
import { BaseObject, ErrorResponse, FormSelectOption, Locations } from '../../schemas';
import { IUser, UpdateUserInputType, UserUpdate, updateUserSchema } from '../../schemas/auth';
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

  const [{ data: locationsData, loading: loadingLocations }] = useAxiosNoAuth<Locations[], unknown, ErrorResponse>({
    url: '/locations?filter[country_id]=1',
  });

  const [{ data: organizationData, loading: loadingOrganizations }] = useAxiosNoAuth<
    ExistingDocumentObject,
    unknown,
    ErrorResponse
  >({
    url: '/organizations?page[number]=1&page[size]=100&sort=name',
  });

  const onGoBackHandler = () => {
    navigate('/admin/users');
  };

  const methods = useForm<UpdateUserInputType>({
    resolver: zodResolver(updateUserSchema()),
    defaultValues:
      {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        organization: user.organization !== null ? String((user?.organization as BaseObject)?.id) : '',
        neighborhood: user.neighborhood !== null ? String((user?.neighborhood as BaseObject)?.id) : '',
        city: user.city !== null ? String((user?.city as BaseObject)?.id) : '',
        phone: user.phone || '',
        email: user.email || '',
        username: user.username || '',
      } || {},
  });

  const {
    handleSubmit,
    setError,
    setValue,
    watch,
    // formState: { isValid, errors },
  } = methods;

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
  }, [organizationData, setValue]);

  const onSubmitHandler: SubmitHandler<UpdateUserInputType> = async (values) => {
    try {
      const { phone, username, password, email, firstName, lastName, organization, city, neighborhood } = values;

      const payload: UserUpdate = {
        password: password !== '' ? password : undefined,
        user_profile_attributes: {
          firstName,
          lastName,
          email: email !== '' ? email : undefined,
          username,
          phone,
          organizationId: organization ? Number(organization) : undefined,
          cityId: city ? Number(city) : undefined,
          neighborhoodId: neighborhood ? Number(neighborhood) : undefined,
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
                placeholder={t('firstName_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="lastName"
                label={t('lastName')}
                type="text"
                placeholder={t('lastName_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="username"
                label={t('username')}
                type="text"
                placeholder={t('username_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="phone"
                label={t('phone')}
                type="phone"
                placeholder={t('phone_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="email"
                label={t('email')}
                type="text"
                placeholder={t('email_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                name="organization"
                className="mt-2"
                label={t('organization')}
                loading={loadingOrganizations}
                options={organizationOptions}
                placeholder={t('organization_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                name="password"
                className="mt-2"
                label={t('password')}
                type="password"
                helperText={t('passwordHelperText')}
                placeholder={t('password_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                name="passwordConfirm"
                className="mt-2"
                label={t('passwordConfirm')}
                type="password"
                placeholder={t('passwordConfirm_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                name="city"
                className="mt-2"
                label={t('city')}
                options={cityOptions}
                loading={loadingLocations}
                placeholder={t('city_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                name="neighborhood"
                className="mt-2"
                label={t('neighborhood')}
                options={neighborhoodOptions}
                loading={loadingLocations}
                placeholder={t('neighborhood_placeholder')}
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
