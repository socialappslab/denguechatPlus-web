import { ErrorResponse } from 'react-router-dom';

import useAxios from 'axios-hooks';
import { deserialize, ExistingDocumentObject } from 'jsonapi-fractal';
import { City } from '@/schemas';
import { CityUpdate } from '@/schemas/update';

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
    // eslint-disable-next-line no-console
    console.log('deserializedData update', deserializedData);
  };

  return { udpateCityMutation, loading };
}
