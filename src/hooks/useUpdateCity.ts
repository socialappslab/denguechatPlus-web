import type { ErrorResponse } from 'react-router';

import useAxios from 'axios-hooks';
import { deserialize, type ExistingDocumentObject } from 'jsonapi-fractal';
import type { City } from '@/schemas';
import type { CityUpdate } from '@/schemas/update';

type IUseUpdateCity = {
  udpateCityMutation: (payload: CityUpdate) => Promise<void>;
  loading: boolean;
};

export default function useUpdateCity(endpoint: string): IUseUpdateCity {
  const [{ loading }, userEdit] = useAxios<ExistingDocumentObject, CityUpdate, ErrorResponse>(
    {
      url: endpoint,
      method: 'PUT',
    },
    { manual: true },
  );

  const udpateCityMutation = async (data: CityUpdate) => {
    const createRes = await userEdit({ data });
    // console.log('createRes', createRes);

    const deserializedData = deserialize<City>(createRes.data);
     
    console.log('deserializedData update', deserializedData);
  };

  return { udpateCityMutation, loading };
}
