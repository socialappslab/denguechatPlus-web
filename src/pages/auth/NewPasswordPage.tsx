/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Container } from '@mui/material';

import { useState } from 'react';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { useSnackbar } from 'notistack';
import Text from '@/themed/text/Text';
import LogoSquare from '../../assets/images/logo-square.svg';
import ArrowLeft from '../../assets/icons/arrow-left-green.svg';
import Success from '@/assets/icons/success-badge.svg';
import { LoginInputType } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import { extractAxiosErrorData } from '../../util';

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
  await timeout(2000);
  return fn(...args);
}

const NewPassword = ({ onClick }) => {
  const { t } = useTranslation(['auth', 'register']);
  const [loading, setLoading] = useState(false);

  const onClickNewPassword = () => {
    setLoading(true);
    sleep(() => {
      setLoading(false);
      onClick();
    });
  };

  return (
    <>
      <Title className="self-center mb-8" type="page2" label="Reestablecer contraseña" />
      <Text>Ingrese su nueva contraseña</Text>
      <FormInput
        name="password"
        className="mt-2"
        label={t('password')}
        type="password"
        helperText={t('register:passwordHelperText')}
        placeholder={t('password_placeholder')}
      />

      <FormInput
        name="passwordConfirm"
        className="mt-2"
        label={t('register:passwordConfirm')}
        type="password"
        placeholder={t('register:passwordConfirm_placeholder')}
      />
      <Button className="mb-4 mt-4" label="Guardar contraseña" onClick={onClickNewPassword} disabled={loading} />
    </>
  );
};

const SuccessContent = () => {
  const { t } = useTranslation('auth');
  return (
    <>
      <Title className="self-center mb-8" type="section" label="Contraseña actualizada" />
      <Text className="text-center mb-6">
        Hemos actualizado tu contraseña. Puedes volver a la aplicación y utilizar tu nueva contraseña.
      </Text>
      <Box className="flex justify-center">
        <img src={ArrowLeft} alt="arrow left" width="20" className="mr-2" />
        <Link className="font-semibold text-grass no-underline self-center" to="/reset-password">
          Volver al inicio de sesión
        </Link>
      </Box>
    </>
  );
};

export function NewPasswordPage() {
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
      setValue('hi');
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
          <img className="self-center mb-8" src={value ? Success : LogoSquare} alt="logo" />

          {value && <SuccessContent />}
          {!value && <NewPassword onClick={() => setValue('hi')} />}
        </Box>
      </FormProvider>
    </Container>
  );
}

export default NewPasswordPage;
