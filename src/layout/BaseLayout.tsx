import { Box, Container } from '@mui/material';
import { PropsWithChildren } from 'react';

import { ScrollToTop } from '../components/ScrollToTop';
import { drawerWidth } from '../constants';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

interface Props {
  auth?: boolean;
  logout?: () => void;
  footer?: boolean;
}

export default function BaseLayout({ children, auth, logout, footer }: PropsWithChildren<Props>) {
  if (!auth || !logout) {
    return (
      <Container
        maxWidth={false}
        className="bg-white p-0 m-0"
        sx={{
          minHeight: '100vh',
        }}
      >
        <ScrollToTop />
        <Header />
        {children}
        {footer && <Footer />}
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <ScrollToTop />
      <Sidebar logout={logout} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        {children}
      </Box>
    </Box>
  );
}
