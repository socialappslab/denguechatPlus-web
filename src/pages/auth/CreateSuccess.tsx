import { Box, Container } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import ArrowLeft from '../../assets/images/arrow-left-green.svg';
import IconSuccess from '../../assets/images/icon-success.svg';

import { Text } from '../../themed/text/Text';
import { Title } from '../../themed/title/Title';

export function CreateSuccessPage() {
  const { t } = useTranslation(['register']);

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          p: { xs: '1rem', sm: '2rem' },
          width: { sm: '500px', xs: '100%' },
          borderRadius: 0,
        }}
      >
        <img className="self-center mb-8" src={IconSuccess} alt="success" />
        <Title type="section" className="self-center mb-4" label={t('success')} />
        <Text className="self-center text-gray">{t('success_description')}</Text>

        <Box className="self-center flex flex-row justify-center align-middle">
          <img className="mr-1" src={ArrowLeft} alt="arrow" />
          <Link className="font-semibold text-grass no-underline text-lg" to="/">
            {t('success_action')}
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default CreateSuccessPage;
