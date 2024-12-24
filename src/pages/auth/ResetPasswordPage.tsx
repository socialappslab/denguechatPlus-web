/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Container } from '@mui/material';
import { TypeOf, z } from 'zod';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
// eslint-disable-next-line import/no-extraneous-dependencies
import validator from 'validator';
import useCreateMutation from '@/hooks/useCreateMutation';
import LogoSquare from '../../assets/images/logo-square.svg';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import { extractAxiosErrorData } from '../../util';

export function BaseResetForm({ children }: { children: JSX.Element }) {
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
      {children}
    </Container>
  );
}

export interface ValidatePhone {
  username: string;
  phone: string;
}

const ResetPasswordPage = () => {
  const { t } = useTranslation(['auth', 'errorCodes']);
  const navigate = useNavigate();

  const validatePhoneSchema = z.object({
    phone: z
      .string()
      .refine((value) => validator.isMobilePhone(value, 'any'), t('auth:resetPassword.phoneNumber_error')),
    username: z.string().min(1, t('auth:resetPassword.username_error')),
  });

  type ValidatePhoneSchema = TypeOf<typeof validatePhoneSchema>;

  const { enqueueSnackbar } = useSnackbar();

  const { createMutation: validatePhoneMutation, loading: loadingPhoneMutation } = useCreateMutation<
    ValidatePhone,
    null
  >(`/recovery_password/validate_phone`);

  const methods = useForm<ValidatePhoneSchema>({
    resolver: zodResolver(validatePhoneSchema),
  });

  const { handleSubmit } = methods;

  const onSubmitHandler: SubmitHandler<ValidatePhoneSchema> = async (values) => {
    try {
      const payload: ValidatePhone = {
        username: values.username,
        phone: values.phone,
      };
      await validatePhoneMutation(payload);
      navigate('/validate-code', { state: { phone: values.phone, username: values.username } });
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
            <Title className="self-center mb-8" type="section" label={t('forgotPassword')} />
            <FormInput
              name="username"
              label={t('auth:resetPassword.username')}
              type="text"
              placeholder={t('auth:resetPassword.username_placeholder')}
            />
            <FormInput
              name="phone"
              label={t('auth:resetPassword.phoneNumber')}
              type="phone"
              placeholder={t('phone_placeholder')}
            />
            <Button className="mb-4 mt-4" label={t('auth:next')} type="submit" disabled={loadingPhoneMutation} />
          </Box>
        </Box>
      </FormProvider>
    </BaseResetForm>
  );
};

export default ResetPasswordPage;
