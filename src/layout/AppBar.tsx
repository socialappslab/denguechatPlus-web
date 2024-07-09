import { Box, Container, Toolbar, useMediaQuery } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { useTranslation } from 'react-i18next';

import { Link, useLocation } from 'react-router-dom';

import Logo from '../assets/images/logo.svg';
import SelectLanguageComponent from '../components/SelectLanguageComponent';
import { Button } from '../themed/button/Button';

export interface AppBarProps {
  auth?: boolean;
  signUp?: boolean;
  logout?: () => void | undefined;
}

const styleWithMobileLogo = {
  width: '125px',
};

export function AppBar({ auth = false, signUp = false, logout }: AppBarProps) {
  const { t } = useTranslation('translation');
  const location = useLocation();
  const matches = useMediaQuery('(min-width:600px)');

  return (
    <MuiAppBar position="static" className="bg-white border-solid border-b border-neutral mb-4" elevation={0}>
      <Container maxWidth={false} className="lg:px-20 md:px-12 sm:px-10 px-6 mx-0">
        <Toolbar disableGutters sx={{ height: '80px' }}>
          <div className="flex flex-1 flex-col align-middle justify-center">
            <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
              <img style={matches && auth ? {} : styleWithMobileLogo} src={Logo} alt="logo" />
            </Link>
          </div>

          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
            {auth && !!logout && <Button className="mr-4" size="small" label={t('logout')} onClick={() => logout()} />}
            {!auth && location.pathname !== '/login' && (
              <Button primary={false} className="mr-4" size="small" label={t('login')} component={Link} to="/login" />
            )}
            {signUp && !auth && (
              <Button className="mr-4" size="small" label={t('register')} component={Link} to="/register" />
            )}

            <SelectLanguageComponent />
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}

export default AppBar;
