import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import LogoSquare from '../../assets/images/logo-square.svg';
import useSignIn from '../../hooks/useSignIn';
import { LoginInput, loginSchema } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Text } from '../../themed/text/Text';
import { Title } from '../../themed/title/Title';

export function SignInPage() {
  const { t } = useTranslation('auth');
  const { signInMutation, isLoading } = useSignIn();

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit } = methods;

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    // TODO: Implement the login mutation
    signInMutation(values);
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

          <FormInput name="email" label={t('email')} type="text" placeholder={t('email_placeholder')} />
          <FormInput name="password" label={t('password')} type="password" placeholder={t('password_placeholder')} />

          <Text className="mb-6 mt-5">
            <Link className="font-semibold text-grass no-underline" to="/reset-password">
              {t('forgotPassword')}
            </Link>
          </Text>

          <Button className="mb-8" label={t('action')} type="submit" disabled={isLoading} />
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
