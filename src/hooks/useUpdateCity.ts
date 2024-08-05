import { ErrorResponse } from 'react-router-dom';

import useAxios from 'axios-hooks';
import { deserialize, ExistingDocumentObject } from 'jsonapi-fractal';
import { City } from '@/schemas';
import { CityUpdate } from '@/schemas/update';

type IUseUpdateCity = {
  udpateCityMutation: (payload: CityUpdate) => Promise<void>;
  loading: boolean;
};

export default function useUpdateCity(idParam?: string): IUseUpdateCity {
  const [{ loading }, userEdit] = useAxios<ExistingDocumentObject, CityUpdate, ErrorResponse>(
    {
      url: `admin/countries/1/states/1/cities/${idParam}`,
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
