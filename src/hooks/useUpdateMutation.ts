import type { ErrorResponse } from 'react-router-dom';

import useAxios from 'axios-hooks';
import { deserialize, type ExistingDocumentObject } from 'jsonapi-fractal';

type IUseUpdateMutation<P> = {
  udpateMutation: (payload: P) => Promise<void>;
  loading: boolean;
};

export default function useUpdateMutation<P, S>(endpoint: string): IUseUpdateMutation<P> {
  const [{ loading }, userEdit] = useAxios<ExistingDocumentObject, P, ErrorResponse>(
    {
      url: endpoint,
      method: 'PUT',
    },
    { manual: true },
  );

  const udpateMutation = async (data: P) => {
    const createRes = await userEdit({ data });
    // console.log('createRes', createRes);

    const deserializedData = deserialize<S>(createRes.data);
     
    console.log('deserializedData update', deserializedData);
  };

  return { udpateMutation, loading };
}
