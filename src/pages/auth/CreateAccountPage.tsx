import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ExistingDocumentObject, deserialize } from 'jsonapi-fractal';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxiosNoAuth } from '../../api/axios';
import LogoSquare from '../../assets/images/logo-square.svg';
import useCreateAccount from '../../hooks/useCreateAccount';
import { ErrorResponse, FormSelectOption, Locations } from '../../schemas';
import { RegisterInputType, UserAccount, createRegisterSchema } from '../../schemas/auth';
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

const DEFAULT_OPTION_CITY_NAME = 'Iquitos';

export function CreateAccountPage() {
  const { t, i18n } = useTranslation(['register', 'errorCodes']);
  const navigate = useNavigate();

  const { resolvedLanguage: currentLanguage } = i18n;

  const { createAccountMutation, loading } = useCreateAccount();
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

  const methods = useForm<RegisterInputType>({
    resolver: zodResolver(createRegisterSchema()),
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
        setValue('city', defaultOption.value);
      }
    }
  }, [locationsData, setValue]);

  useEffect(() => {
    if (!organizationData) return;
    const deserializedData = deserialize(organizationData);
    if (Array.isArray(deserializedData)) {
      const organizations = convertToFormSelectOptions(deserializedData);
      setOrganizationOptions(organizations);
      if (organizations.length > 0) {
        setValue('organization', organizations[0].value);
      }
    }
  }, [organizationData, setValue]);

  const onSubmitHandler: SubmitHandler<RegisterInputType> = async (values) => {
    try {
      const { phone, username, password, email, firstName, lastName, organization, city, neighborhood } = values;

      const payload: UserAccount = {
        phone,
        password,
        username,
        email,
        userProfile: {
          firstName,
          lastName,
          country: 'PE',
          organizationId: organization ? Number(organization) : undefined,
          cityId: city ? Number(city) : undefined,
          neighborhoodId: neighborhood ? Number(neighborhood) : undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: currentLanguage,
        },
      };
      await createAccountMutation(payload);

      navigate('/register-success');
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

      if (!errorData?.errors) {
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
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          noValidate
          autoComplete="off"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            p: { xs: '1rem', sm: '2rem' },
            width: { sm: '500px', xs: '100%' },
            borderRadius: 0,
          }}
        >
          <img className="self-center mb-8" src={LogoSquare} alt="logo" />
          <Title type="section" className="self-center mb-8" label={t('title')} />

          <FormInput
            className="mt-2"
            name="firstName"
            label={t('firstName')}
            type="text"
            placeholder={t('firstName_placeholder')}
          />

          <FormInput
            className="mt-2"
            name="lastName"
            label={t('lastName')}
            type="text"
            placeholder={t('lastName_placeholder')}
          />

          <FormInput
            className="mt-2"
            name="username"
            label={t('username')}
            type="text"
            placeholder={t('username_placeholder')}
          />

          <FormInput
            className="mt-2"
            name="phone"
            label={t('phone')}
            type="phone"
            placeholder={t('phone_placeholder')}
          />

          <FormInput
            className="mt-2"
            name="email"
            label={t('email')}
            type="text"
            placeholder={t('email_placeholder')}
          />

          <FormInput
            name="password"
            className="mt-2"
            label={t('password')}
            type="password"
            helperText={t('passwordHelperText')}
            placeholder={t('password_placeholder')}
          />

          <FormInput
            name="passwordConfirm"
            className="mt-2"
            label={t('passwordConfirm')}
            type="password"
            placeholder={t('passwordConfirm_placeholder')}
          />

          <FormSelect
            name="city"
            className="mt-2"
            label={t('city')}
            options={cityOptions}
            loading={loadingLocations}
            placeholder={t('city_placeholder')}
          />

          <FormSelect
            name="neighborhood"
            className="mt-2"
            label={t('neighborhood')}
            options={neighborhoodOptions}
            loading={loadingLocations}
            placeholder={t('neighborhood_placeholder')}
          />

          <FormSelect
            name="organization"
            className="mt-2"
            label={t('organization')}
            loading={loadingOrganizations}
            options={organizationOptions}
            placeholder={t('organization_placeholder')}
          />

          <Button className="mb-8 mt-3" label={t('action')} type="submit" disabled={loading} />
        </Box>
      </FormProvider>
    </Container>
  );
}

export default CreateAccountPage;
