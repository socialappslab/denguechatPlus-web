import useAxios from 'axios-hooks';
import { deserialize } from 'jsonapi-fractal';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Visit } from '@/schemas/entities';
import { useParamsTypeSafe } from '../../hooks/useParamsTypeSafe';
import Loader from '../../themed/loader/Loader';
import AppErrorPage from '../AppErrorPage';
import EditVisit from '../visits/EditVisitPage';

export function LoadVisit() {
  const [visit, setVisit] = useState<Visit | undefined>();

  const { id } = useParamsTypeSafe(
    z.object({
      id: z.coerce.string(),
    }),
  );

  const [{ data, loading, error }, fetchEntity] = useAxios(
    {
      url: `/visits/${id}`,
    },
    { manual: true },
  );

  useEffect(() => {
    if (data) {
      const deserializedData = deserialize<Visit>(data);
      if (!Array.isArray(deserializedData)) {
        // eslint-disable-next-line no-console
        console.log('deserializedData load user', deserializedData);
        setVisit(deserializedData);
      }
    }
    if (id && !data) {
      fetchEntity();
    }
  }, [id, data, fetchEntity]);

  return (
    <>
      {loading && <Loader />}
      {!loading && !error && visit && <EditVisit visit={visit} />}
      {error && <AppErrorPage message={error?.message} />}
    </>
  );
}
export default LoadVisit;
