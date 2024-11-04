import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container } from '@mui/material';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { useState } from 'react';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { useSnackbar } from 'notistack';
import LogoSquare from '../../assets/images/logo-square.svg';
import useSignIn from '../../hooks/useSignIn';
import TabPanel from '../../layout/TabPanel';
import { LoginInputType, LoginRequestType, loginSchema } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Text } from '../../themed/text/Text';
import { Title } from '../../themed/title/Title';
import { a11yProps, extractAxiosErrorData } from '../../util';

export function SignInPage() {
  const { t } = useTranslation(['auth', 'errorCodes']);
  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const { signInMutation, loading } = useSignIn();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<LoginInputType>({
    resolver: zodResolver(loginSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { isValid },
  } = methods;

  const onSubmitHandler: SubmitHandler<LoginInputType> = async (values) => {
    try {
      const payload: LoginRequestType = {
        ...values,
        type: value === 0 ? 'username' : 'phone',
      };
      await signInMutation(payload);
      navigate('/');
    } catch (error) {
      const errorData = extractAxiosErrorData(error);
      // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-explicit-any
      errorData?.errors?.forEach((error: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        enqueueSnackbar(t(`errorCodes:${error.error_code || 'generic'}`), {
          variant: 'error',
        });
      });

      if (!errorData?.errors || errorData?.errors.length === 0) {
        enqueueSnackbar(t('errorCodes:generic'), {
          variant: 'error',
        });
      }

      setError('username', {
        type: 'manual',
        message: '',
      });
      setError('phone', {
        type: 'manual',
        message: '',
      });
      setError('password', {
        type: 'manual',
        message: '',
      });
    }
  };

  const handleChangeLoginSelector = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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

          <Tabs variant="fullWidth" value={value} onChange={handleChangeLoginSelector} aria-label="Login type selector">
            <Tab label={t('username')} {...a11yProps(0)} />
            <Tab label={t('phone')} {...a11yProps(1)} />
          </Tabs>

          <TabPanel value={value} index={0}>
            <FormInput
              className="mt-6"
              name="username"
              label={t('username')}
              type="text"
              placeholder={t('username_placeholder')}
            />
          </TabPanel>

          <TabPanel value={value} index={1}>
            <FormInput
              className="mt-6"
              name="phone"
              label={t('phone')}
              type="phone"
              placeholder={t('phone_placeholder')}
            />
          </TabPanel>

          <FormInput
            name="password"
            className="mt-2"
            label={t('password')}
            type="password"
            placeholder={t('password_placeholder')}
          />

          <Text className="mb-6 mt-5">
            <Link className="font-semibold text-grass no-underline" to="/reset-password">
              {t('forgotPassword')}
            </Link>
          </Text>

          <Button className="mb-8" label={t('action')} type="submit" disabled={loading || !isValid} />
          <Box className="self-center">
            <Text className="inline-block text-lg">{t('registerMessage')}</Text>
            <Link className="ml-2 font-semibold text-grass no-underline text-lg" to="/register">
              {t('register')}
            </Link>
          </Box>
        </Box>
      </FormProvider>
    </Container>
  );
}

export default SignInPage;
