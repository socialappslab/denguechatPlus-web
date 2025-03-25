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
import { DEFAULT_OPTION_CITY_NAME } from '../../constants';
import useCreateAccount from '../../hooks/useCreateAccount';
import { City, ErrorResponse, FormSelectOption, Neighborhood } from '../../schemas';
import { RegisterInputType, RegisterSchema, UserAccount } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import FormSelect from '../../themed/form-select/FormSelect';
import { Title } from '../../themed/title/Title';
import { convertToFormSelectOptions, extractAxiosErrorData, findOptionByName } from '../../util';

export function CreateAccountPage() {
  const { t, i18n } = useTranslation(['register', 'errorCodes']);
  const navigate = useNavigate();

  const { resolvedLanguage: currentLanguage } = i18n;

  const { createAccountMutation, loading } = useCreateAccount();
  const { enqueueSnackbar } = useSnackbar();
  const [neighborhoodOptions, setNeighborhoodOptions] = useState<FormSelectOption[]>([]);
  const [cityOptions, setCityOptions] = useState<FormSelectOption[]>([]);
  const [organizationOptions, setOrganizationOptions] = useState<FormSelectOption[]>([]);

  const methods = useForm<RegisterInputType>({
    resolver: zodResolver(RegisterSchema),
  });

  const { handleSubmit, setError, setValue, watch } = methods;
  const [cityValue] = watch(['city']);

  const [{ data: citiesData, loading: loadingCities }] = useAxiosNoAuth<ExistingDocumentObject, unknown, ErrorResponse>(
    {
      url: `public/cities?page[number]=1&page[size]=1000`,
    },
  );

  const [{ data: neighborhoodsData, loading: loadingNeighborhoods }] = useAxiosNoAuth<
    ExistingDocumentObject,
    unknown,
    ErrorResponse
  >({
    url: `public/neighborhoods?filter[city_id]=${cityValue}&page[number]=1&page[size]=1000`,
  });

  const [{ data: organizationData, loading: loadingOrganizations }] = useAxiosNoAuth<
    ExistingDocumentObject,
    unknown,
    ErrorResponse
  >({
    url: 'public/organizations?page[number]=1&page[size]=100&sort=name',
  });

  useEffect(() => {
    if (!citiesData) return;
    const deserializedData = deserialize<City>(citiesData);
    if (Array.isArray(deserializedData)) {
      const cities = convertToFormSelectOptions(deserializedData);
      setCityOptions(cities);
      if (cities.length > 0) {
        const defaultOption = findOptionByName(cities, DEFAULT_OPTION_CITY_NAME);
        if (defaultOption) {
          setValue('city', defaultOption.value);
        }
      }
    }
  }, [citiesData, setValue]);

  useEffect(() => {
    if (!neighborhoodsData) return;
    const deserializedData = deserialize<Neighborhood>(neighborhoodsData);
    if (Array.isArray(deserializedData)) {
      const neighborhoods = convertToFormSelectOptions(deserializedData);
      setNeighborhoodOptions(neighborhoods);
    }
  }, [neighborhoodsData]);

  useEffect(() => {
    if (cityValue !== undefined) {
      setValue('neighborhood', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityValue, setValue]);

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
        userProfile: {
          firstName,
          lastName,
          email,
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
            required
          />

          <FormInput
            className="mt-2"
            name="lastName"
            label={t('lastName')}
            type="text"
            placeholder={t('lastName_placeholder')}
            required
          />

          <FormInput
            className="mt-2"
            name="username"
            label={t('username')}
            type="text"
            placeholder={t('username_placeholder')}
            required
          />

          <FormInput
            className="mt-2"
            name="phone"
            label={t('phone')}
            type="phone"
            placeholder={t('phone_placeholder')}
            required
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
            required
          />

          <FormInput
            name="passwordConfirm"
            className="mt-2"
            label={t('passwordConfirm')}
            type="password"
            placeholder={t('passwordConfirm_placeholder')}
            required
          />

          <FormSelect
            name="city"
            className="mt-2"
            label={t('city')}
            options={cityOptions}
            loading={loadingCities}
            placeholder={t('city_placeholder')}
            required
          />

          <FormSelect
            name="neighborhood"
            className="mt-2"
            label={t('neighborhood')}
            options={neighborhoodOptions}
            loading={loadingNeighborhoods}
            placeholder={t('neighborhood_placeholder')}
            required
          />

          <FormSelect
            name="organization"
            className="mt-2"
            label={t('organization')}
            loading={loadingOrganizations}
            options={organizationOptions}
            placeholder={t('organization_placeholder')}
            required
          />

          <Button className="mb-8 mt-3" label={t('action')} type="submit" disabled={loading} />
        </Box>
      </FormProvider>
    </Container>
  );
}

export default CreateAccountPage;
