/**
 * Generalized Create Mutation
 * It requires a type matching the payload type
 */
import { ErrorResponse } from 'react-router-dom';

import useAxios from 'axios-hooks';
import { deserialize, ExistingDocumentObject } from 'jsonapi-fractal';

type IUseCreate<P> = {
  createMutation: (payload: P) => Promise<void>;
  loading: boolean;
};

export default function useCreateMutation<P, S>(endpoint: string): IUseCreate<P> {
  const [{ loading }, create] = useAxios<ExistingDocumentObject, P, ErrorResponse>(
    {
      url: endpoint,
      method: 'POST',
    },
    { manual: true },
  );

  const createMutation = async (data: P) => {
    const createRes = await create({ data });

    const deserializedData = deserialize<S>(createRes.data);
    // eslint-disable-next-line no-console
    console.log('deserializedData update', deserializedData);
  };

  return { createMutation, loading };
}
