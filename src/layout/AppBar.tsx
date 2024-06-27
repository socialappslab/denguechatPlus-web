import { Box, Container, Toolbar, useMediaQuery } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';

import Logo from '../assets/images/logo.svg';
import SelectLanguageComponent from '../components/SelectLanguageComponent';
import { Button } from '../themed/button/Button';

export interface AppBarProps {
  // eslint-disable-next-line react/require-default-props
  auth?: boolean;
  // eslint-disable-next-line react/require-default-props
  logout?: () => void | undefined;
}

const styleWithMobileLogo = {
  width: '125px',
};

export function AppBar({ auth = true, logout }: AppBarProps) {
  const { t } = useTranslation('translation');
  const matches = useMediaQuery('(min-width:600px)');

  return (
    <MuiAppBar position="static" className="bg-white" elevation={0}>
      <Container maxWidth={false} className="lg:px-20 md:px-12 sm:px-10 px-6 mx-0">
        <Toolbar disableGutters sx={{ height: '100px' }}>
          <div className="flex flex-1 flex-col align-middle justify-center">
            <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
              <img style={matches && auth ? {} : styleWithMobileLogo} src={Logo} alt="logo" />
            </Link>
          </div>

          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
            {auth && !!logout && <Button className="mr-4" size="small" label={t('logout')} onClick={() => logout()} />}
            {!auth && <Button className="mr-4" size="small" label={t('login')} component={Link} to="/login" />}
            <SelectLanguageComponent />
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}

export default AppBar;
