/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { object } from 'zod';
import Text from '@/themed/text/Text';
import useCreateMutation from '@/hooks/useCreateMutation';
import ArrowLeft from '@/assets/icons/arrow-left-green.svg';
import SuccessIcon from '@/assets/icons/success-icon.svg';
import LogoSquare from '../../assets/images/logo-square.svg';
import { passwordConfirmSchema, passwordSchema } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import { extractAxiosErrorData } from '../../util';
import { BaseResetForm } from './ResetPasswordPage';

interface NewPassword {
  password: string;
  passwordConfirm: string;
}

interface NewPasswordPayload {
  password: string;
  password_confirmation: string;
  token: string;
}

const SuccessContent = () => {
  const { t } = useTranslation('auth');
  return (
    <Box className="mt-8 flex flex-col items-center">
      <img src={SuccessIcon} alt="arrow left" />
      <Title className="self-center mb-4 mt-4" type="section" label={t('resetPassword.passwordUpdated')} />
      <Text className="text-center mb-6 max-w-80">{t('resetPassword.passwordUpdate_success')}</Text>
      <Box className="flex justify-center">
        <img src={ArrowLeft} alt="arrow left" width="20" className="mr-2" />
        <Link className="font-semibold text-grass no-underline self-center" to="/login">
          {t('resetPassword.returnToLogin')}
        </Link>
      </Box>
    </Box>
  );
};

const NewPasswordPage = () => {
  const { t } = useTranslation(['auth', 'errorCodes', 'register', 'validation']);
  const [success, setSuccess] = useState(false);
  const { state } = useLocation();
  const token = state?.token;

  const newPasswordSchema = object({
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: t('validation:notMatch'),
  });

  const { enqueueSnackbar } = useSnackbar();

  const { createMutation: newPasswordMutation, loading } = useCreateMutation<NewPasswordPayload, null>(
    `/recovery_password/validate_phone`,
  );

  const methods = useForm<NewPassword>({
    resolver: zodResolver(newPasswordSchema),
  });

  const { handleSubmit } = methods;

  const onSubmitHandler: SubmitHandler<NewPassword> = async (values) => {
    try {
      const payload = {
        password: values.password,
        password_confirmation: values.passwordConfirm,
        token,
      };
      await newPasswordMutation(payload);
      setSuccess(true);
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
    }
  };

  return (
    <BaseResetForm>
      <>
        {success && <SuccessContent />}
        {!success && (
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

              <Box>
                <Title className="self-center mb-8" type="page2" label={t('auth:resetPassword.title')} />
                <Text>{t('auth:resetPassword.newPassword')}</Text>
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
                <Button
                  className="mb-4 mt-4"
                  label={t('auth:resetPassword.savePassword')}
                  type="submit"
                  disabled={loading}
                />
              </Box>
            </Box>
          </FormProvider>
        )}
      </>
    </BaseResetForm>
  );
};

export default NewPasswordPage;
