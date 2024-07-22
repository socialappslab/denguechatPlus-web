import { Container } from '@mui/material';
import { PropsWithChildren } from 'react';

import useSignOut from '../hooks/useLogout';
import useUser from '../hooks/useUser';
import BaseLayout from './BaseLayout';

export default function PageLayout({ children }: PropsWithChildren) {
  const user = useUser();
  const signOut = useSignOut();

  const handleLogout = () => {
    signOut();
  };

  return (
    <BaseLayout auth={!!user} signUp logout={handleLogout}>
      <Container maxWidth={false} className="lg:pt-6 lg:px-8 md:pt-6 md:px-8 sm:pt-5 sm:px-6 pt-4 px-4 pb-8 mx-0">
        {children}
      </Container>
    </BaseLayout>
  );
}
