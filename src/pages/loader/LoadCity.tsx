import useAxios from 'axios-hooks';
import { deserialize } from 'jsonapi-fractal';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { City } from '@/schemas';
import { useParamsTypeSafe } from '../../hooks/useParamsTypeSafe';
import Loader from '../../themed/loader/Loader';
import AppErrorPage from '../AppErrorPage';
import EditCityPage from '../admin/EditCityPage';
import { IUser } from '@/schemas/auth';
import useStateContext from '@/hooks/useStateContext';

export function LoadCity() {
  const [city, setCity] = useState<City | undefined>();
  const { id } = useParamsTypeSafe(
    z.object({
      id: z.coerce.string(),
    }),
  );

  const { state } = useStateContext();
  const user = state.user as IUser;

  const [{ data, loading, error }, fetchEntity] = useAxios(
    {
      url: `admin/countries/${user.country.id}/states/${user.state.id}/cities/${id}`,
    },
    { manual: true },
  );

  useEffect(() => {
    if (data) {
      const deserializedData = deserialize<City>(data);
      if (!Array.isArray(deserializedData)) {
        // eslint-disable-next-line no-console
        console.log('deserializedData load user', deserializedData);
        setCity(deserializedData);
      }
    }
    if (id && !data) {
      fetchEntity();
    }
  }, [id, data, fetchEntity]);

  return (
    <>
      {loading && <Loader />}
      {!loading && !error && city && <EditCityPage city={city} />}
      {error && <AppErrorPage message={error?.message} />}
    </>
  );
}
export default LoadCity;
