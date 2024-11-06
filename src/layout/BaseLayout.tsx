import { Box, Container, Toolbar } from '@mui/material';
import { PropsWithChildren } from 'react';

import { ScrollToTop } from '../components/ScrollToTop';
import { drawerWidth } from '../constants';
import { AppBar, AppBarProps } from './AppBar';
import Footer from './Footer';

export default function BaseLayout({ children, auth, signUp, logout, footer }: AppBarProps & PropsWithChildren) {
  if (!auth) {
    return (
      <Container
        maxWidth={false}
        className="bg-white p-0 m-0"
        sx={{
          minHeight: '100vh',
        }}
      >
        <ScrollToTop />
        <AppBar auth={auth} signUp={signUp} logout={logout} />
        {children}
        {footer && <Footer />}
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <ScrollToTop />
      <AppBar auth={auth} signUp={signUp} logout={logout} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        {children}
      </Box>
    </Box>
  );
}
