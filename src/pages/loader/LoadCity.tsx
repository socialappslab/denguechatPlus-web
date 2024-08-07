import useAxios from 'axios-hooks';
import { deserialize } from 'jsonapi-fractal';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { City } from '@/schemas';
import { useParamsTypeSafe } from '../../hooks/useParamsTypeSafe';
import Loader from '../../themed/loader/Loader';
import AppErrorPage from '../AppErrorPage';
import EditCityPage from '../admin/EditCityPage';

export function LoadCity() {
  const [city, setCity] = useState<City | undefined>();
  const { id } = useParamsTypeSafe(
    z.object({
      id: z.coerce.string(),
    }),
  );

  const [{ data, loading, error }, fetchEntity] = useAxios(
    {
      url: `admin/countries/1/states/1/cities/${id}`,
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
