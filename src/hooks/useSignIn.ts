import type { ErrorResponse } from 'react-router';

import { deserialize, type ExistingDocumentObject } from 'jsonapi-fractal';
import { setAccessTokenToHeaders, useAxiosNoAuth } from '../api/axios';
import { DISPATCH_ACTIONS, REFRESH_TOKEN_LOCAL_STORAGE_KEY } from '@/constants';
import type { ILoginResponse, IUser, LoginRequestType } from '../schemas/auth';
import useStateContext from './useStateContext';

type IUseSignIn = {
  signInMutation: (payload: LoginRequestType) => Promise<void>;
  loading: boolean;
};

export default function useSignIn(): IUseSignIn {
  const stateContext = useStateContext();

  const [{ loading }, loginPost] = useAxiosNoAuth<
    ExistingDocumentObject & ILoginResponse,
    LoginRequestType,
    ErrorResponse
  >(
    {
      url: 'users/session',
      method: 'POST',
    },
    { manual: true },
  );

  async function signInMutation(data: LoginRequestType) {
    const loginRes = await loginPost({ data });

    const deserializedData = deserialize<IUser>(loginRes.data);

    if (!Array.isArray(deserializedData)) {
      stateContext.dispatch({ type: DISPATCH_ACTIONS.SET_USER, payload: deserializedData });

      const { access, refresh } = loginRes.data.meta.jwt.res;
      setAccessTokenToHeaders(access);
      localStorage.setItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY, refresh);
    } else {
      throw new Error("Couldn't deserialize user data");
    }
  }

  return { signInMutation, loading };
}
