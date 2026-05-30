import type { ErrorResponse } from 'react-router-dom';

import useAxios from 'axios-hooks';
import { deserialize, type ExistingDocumentObject } from 'jsonapi-fractal';
import type { IUser, UserUpdate } from '../schemas/auth';

type IUseUpdateUser = {
  udpateUserMutation: (payload: UserUpdate) => Promise<void>;
  loading: boolean;
};

export default function useUpdateUser(idParam?: string): IUseUpdateUser {
  const [{ loading }, userEdit] = useAxios<ExistingDocumentObject, UserUpdate, ErrorResponse>(
    {
      url: `users/${idParam}`,
      method: 'PUT',
    },
    { manual: true },
  );

  const udpateUserMutation = async (data: UserUpdate) => {
    const createRes = await userEdit({ data });
    // console.log('createRes', createRes);

    const deserializedData = deserialize<IUser>(createRes.data);
     
    console.log('deserializedData update', deserializedData);
  };

  return { udpateUserMutation, loading };
}
