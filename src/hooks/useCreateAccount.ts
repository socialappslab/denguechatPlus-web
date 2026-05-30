import type { ErrorResponse } from 'react-router-dom';

import { deserialize, type ExistingDocumentObject } from 'jsonapi-fractal';
import { useAxiosNoAuth } from '../api/axios';
import type { UserAccount } from '../schemas/auth';

type IUseCreateAccount = {
  createAccountMutation: (payload: UserAccount) => Promise<void>;
  loading: boolean;
};

export default function useCreateAccount(): IUseCreateAccount {
  const [{ loading }, userPost] = useAxiosNoAuth<ExistingDocumentObject, UserAccount, ErrorResponse>(
    {
      url: 'users/accounts',
      method: 'POST',
    },
    { manual: true },
  );

  const createAccountMutation = async (data: UserAccount) => {
    const createRes = await userPost({ data });
    // console.log('createRes', createRes);

    const deserializedData = deserialize(createRes.data);
     
    console.log('deserializedData create', deserializedData);
  };

  return { createAccountMutation, loading };
}
