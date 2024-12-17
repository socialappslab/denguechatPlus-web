import { Box, Container, Toolbar } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Text from '@/themed/text/Text';
import Button from '@/themed/button/Button';
import Logo from '../assets/images/logo.svg';

const Footer = () => {
  const { t } = useTranslation('translation');

  return (
    <MuiAppBar position="static" className="bg-white mt-8 m4-6 absolute bottom-0" elevation={0}>
      <Container maxWidth={false} className="lg:px-20 md:px-12 sm:px-10 px-6 mx-0">
        <Toolbar disableGutters sx={{ height: '80px' }} className="flex justify-between">
          <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
            <img src={Logo} alt="logo" />
          </Link>
          <Box sx={{ display: 'flex' }}>
            <Button
              primary={false}
              className="mr-4"
              buttonType="small"
              label={t('footer.userGuide')}
              component={Link}
              to="/"
            />
            <Button
              primary={false}
              className="mr-4"
              buttonType="small"
              label={t('footer.about')}
              component={Link}
              to="/"
            />
            <Button
              primary={false}
              className="mr-4"
              buttonType="small"
              label={t('footer.mosquito')}
              component={Link}
              to="/"
            />
            <Button
              primary={false}
              className="mr-4"
              buttonType="small"
              label={t('footer.faqs')}
              component={Link}
              to="/"
            />
          </Box>
          <Box>
            <Text type="menuItem" className="text-neutral-300">
              © 2024
            </Text>
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
};

export default Footer;
