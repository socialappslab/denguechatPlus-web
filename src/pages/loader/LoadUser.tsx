import useAxios from 'axios-hooks';
import { deserialize } from 'jsonapi-fractal';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useParamsTypeSafe } from '../../hooks/useParamsTypeSafe';
import { IUser } from '../../schemas/auth';
import Loader from '../../themed/loader/Loader';
import AppErrorPage from '../AppErrorPage';
import EditUserPage from '../admin/EditUserPage';

export function LoadUser() {
  const [user, setUser] = useState<IUser | undefined>();
  const { id } = useParamsTypeSafe(
    z.object({
      id: z.coerce.string(),
    }),
  );

  const [{ data, loading, error }, fetchEntity] = useAxios(
    {
      url: `/users/${id}`,
    },
    { manual: true },
  );

  useEffect(() => {
    if (data) {
      const deserializedData = deserialize<IUser>(data);
      if (!Array.isArray(deserializedData)) {
        // eslint-disable-next-line no-console
        console.log('deserializedData load user', deserializedData);
        setUser(deserializedData);
      }
    }
    if (id && !data) {
      fetchEntity();
    }
  }, [id, data, fetchEntity]);

  return (
    <>
      {loading && <Loader />}
      {!loading && !error && user && <EditUserPage user={user} />}
      {error && <AppErrorPage message={error?.message} />}
    </>
  );
}
export default LoadUser;
