/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorResponse, useLocation, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import useAxios from 'axios-hooks';
import { ExistingDocumentObject } from 'jsonapi-fractal';
import { useSnackbar } from 'notistack';
import { object, z } from 'zod';
import { extractAxiosErrorData } from '@/util';
import Text from '@/themed/text/Text';
import useCreateMutation from '@/hooks/useCreateMutation';
import LogoSquare from '../../assets/images/logo-square.svg';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import { BaseResetForm, ValidatePhone } from './ResetPasswordPage';

const trimString = (str: string) => `${'*'.repeat(3)}${str.slice(str.length - 5, str.length)}`;

interface ValidateCode {
  code: string;
}

interface ValidateCodePayload extends ValidateCode {
  username: string;
  phone: string;
}

const ValidateCodePage = () => {
  const { t } = useTranslation(['auth', 'errorCodes']);
  const { state } = useLocation();
  const { phone: phoneNumber, username } = state;
  const navigate = useNavigate();

  const { createMutation: validatePhoneMutation } = useCreateMutation<ValidatePhone, null>(
    `/recovery_password/validate_phone`,
  );

  const [{ loading }, validateCodeMutation] = useAxios<ExistingDocumentObject, ValidateCodePayload, ErrorResponse>(
    {
      url: '/recovery_password/validate_code',
      method: 'POST',
    },
    { manual: true },
  );

  if (!phoneNumber) {
    navigate('/404');
  }

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<ValidateCode>({
    resolver: zodResolver(object({ code: z.string().min(6, t('auth:resetPassword.invalidCode')) })),
  });

  const onResendCode = async () => {
    try {
      const payload = { phone: phoneNumber, username: state.username };
      await validatePhoneMutation(payload);
      enqueueSnackbar(t('auth:resetPassword.codeSent_success'), {
        variant: 'success',
      });
    } catch (error) {
      const errorData = extractAxiosErrorData(error);
      // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-explicit-any
      errorData?.errors?.forEach((error: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        enqueueSnackbar(t(`errorCodes:${error.error_code || 'generic'}`), {
          variant: 'error',
        });
        console.log(error);
      });

      if (!errorData?.errors || errorData?.errors.length === 0) {
        enqueueSnackbar(t('errorCodes:generic'), {
          variant: 'error',
        });
      }
    }
  };

  const { handleSubmit } = methods;

  const onSubmitHandler: SubmitHandler<ValidateCode> = async (values) => {
    try {
      const payload = {
        code: values.code,
        username,
        phone: phoneNumber,
      };
      const data = await validateCodeMutation({ data: payload });
      // eslint-disable-next-line prefer-destructuring
      const url = (data?.data as unknown as { url: string }).url;
      const token = url.split('/').pop();
      enqueueSnackbar(t('auth:resetPassword.validatedCode'), {
        variant: 'success',
      });
      navigate('/new-password', { state: { token } });
    } catch (error) {
      const errorData = extractAxiosErrorData(error);
      // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-explicit-any
      errorData?.errors?.forEach((error: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        enqueueSnackbar(error.detail || t(`errorCodes:${error.error_code || 'generic'}`), {
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
            <Title className="self-center text-center mb-8" type="page2" label={t('auth:resetPassword.title')} />
            <Text className="text-center mb-6">
              {t('auth:resetPassword.sentCode', { phone: trimString(phoneNumber) })}
            </Text>
            <FormInput name="code" label={t('auth:resetPassword.code')} type="text" placeholder="****" />

            <Box className="flex justify-between items-center">
              <Text className="font-semibold text-grass no-underline cursor-pointer">
                <Box onClick={onResendCode}>{t('auth:resetPassword.resendCode')}</Box>
              </Text>
              <Button className="mb-4 mt-4 max-w-min" label={t('next')} type="submit" disabled={loading} />
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </BaseResetForm>
  );
};

export default ValidateCodePage;
