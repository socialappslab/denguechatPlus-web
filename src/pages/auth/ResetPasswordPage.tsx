/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Container } from '@mui/material';

import { useState } from 'react';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { useSnackbar } from 'notistack';
import Text from '@/themed/text/Text';
import LogoSquare from '../../assets/images/logo-square.svg';
import { LoginInputType } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import { extractAxiosErrorData } from '../../util';

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
  await timeout(1000);
  return fn(...args);
}

const trimString = (str: string) => `${'*'.repeat(3)}${str.slice(str.length - 5, str.length)}`;

const CodeVerification = ({ value }: { value: string }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(['auth', 'register']);
  const [loading, setLoading] = useState(false);

  const onResendCode = () => {
    enqueueSnackbar('El código se reenvio', {
      variant: 'success',
    });
  };

  const onClickNext = async () => {
    setLoading(true);
    await sleep(() => setLoading(false));
    navigate('../new-password');
  };

  return (
    <>
      <Title className="self-center text-center mb-8" type="page2" label="Reestablecer contraseña" />
      <Text className="text-center mb-6">{`Te enviamos un SMS con el código a tu teléfono ${trimString(value)}. Ingrese el código recibido.`}</Text>
      <FormInput name="code" label="Codigo de verificación" type="text" placeholder="****" />
      <Box className="flex justify-between items-center">
        <Text className="self-center">
          <Link className="font-semibold text-grass no-underline" onClick={onResendCode} to="#">
            Reenviar código
          </Link>
        </Text>
        <Button className="mb-4 mt-4 max-w-min" label={t('next')} onClick={onClickNext} disabled={loading} />
      </Box>
    </>
  );
};

const PhoneNumberOrEmail = () => {
  const { t } = useTranslation('auth');
  return (
    <>
      <Title className="self-center mb-8" type="section" label={t('forgotPassword')} />
      <FormInput
        name="identityValue"
        label={t('resetPassword.title')}
        type="text"
        placeholder={t('resetPassword.placeholder')}
      />
      <Button className="mb-4 mt-4" label={t('next')} type="submit" />
      <Text className="self-center">
        <Link className="font-semibold text-grass no-underline" to="/reset-password">
          {t('forgotPassword')}
        </Link>
      </Text>
    </>
  );
};

export function ResetPasswordPage() {
  const { t } = useTranslation(['auth', 'errorCodes']);
  const navigate = useNavigate();

  const [value, setValue] = useState<null | string>(null);
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<LoginInputType>({
    // resolver: zodResolver(loginSchema),
  });

  const { handleSubmit, setError, formState } = methods;

  const onSubmitHandler: SubmitHandler<{ identityValue: string }> = async (values) => {
    try {
      setValue(values.identityValue);
      // await signInMutation(payload);
      // navigate('/');
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

          {value && <CodeVerification value={value} />}
          {!value && <PhoneNumberOrEmail />}
        </Box>
      </FormProvider>
    </Container>
  );
}

export default ResetPasswordPage;
