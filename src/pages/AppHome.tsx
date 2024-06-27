import useUser from '../hooks/useUser';
import { HomeAdmin } from './admin/HomeAdmin';

import Splash from './Splash';

function AppHome() {
  const user = useUser();

  return (
    <>
      {user?.type === 'ADMIN' && <HomeAdmin />}
      {!user && <Splash />}
    </>
  );
}

export default AppHome;
