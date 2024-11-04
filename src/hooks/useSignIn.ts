import { ErrorResponse } from 'react-router-dom';

import { deserialize, ExistingDocumentObject } from 'jsonapi-fractal';
import { saveRefreshToken, setAccessTokenToHeaders, useAxiosNoAuth } from '../api/axios';
import { DISPATCH_ACTIONS } from '../constants';
import { ILoginResponse, IUser, LoginRequestType } from '../schemas/auth';
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

  const signInMutation = async (data: LoginRequestType) => {
    const loginRes = await loginPost({ data });

    const deserializedData = deserialize<IUser>(loginRes.data);

    if (!Array.isArray(deserializedData)) {
      // eslint-disable-next-line no-console
      console.log('deserializedData login', deserializedData);

      stateContext.dispatch({ type: DISPATCH_ACTIONS.SET_USER, payload: deserializedData });
      setAccessTokenToHeaders(loginRes.data.meta.jwt.res.access);
      saveRefreshToken(loginRes.data.meta.jwt.res.refresh);
    } else {
      throw new Error("Couldn't deserialize user data");
    }
  };

  return { signInMutation, loading };
}
