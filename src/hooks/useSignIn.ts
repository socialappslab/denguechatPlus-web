import { ErrorResponse, useNavigate } from 'react-router-dom';

import { setAccessTokenToHeaders, useAxiosNoAuth } from '../api/axios';
import { DISPATCH_ACTIONS } from '../constants';
import { ILoginResponse, IUser, LoginRequestType } from '../schemas/auth';
import useStateContext from './useStateContext';

type IUseSignIn = {
  signInMutation: (payload: LoginRequestType) => Promise<void>;
  loading: boolean;
};

export default function useSignIn(): IUseSignIn {
  const navigate = useNavigate();

  const stateContext = useStateContext();

  const [{ loading }, loginPost] = useAxiosNoAuth<ILoginResponse, LoginRequestType, ErrorResponse>(
    {
      url: 'users/session',
      method: 'POST',
    },
    { manual: true },
  );

  const signInMutation = async (data: LoginRequestType) => {
    const loginRes = await loginPost({ data });
    console.log('loginRes', loginRes);

    const user: IUser = {
      id: loginRes.data.data.id,
      ...loginRes.data.data.attributes,
    };

    stateContext.dispatch({ type: DISPATCH_ACTIONS.SET_USER, payload: user });
    setAccessTokenToHeaders(loginRes.data.meta.jwt.res.access);
    navigate('/');
  };

  return { signInMutation, loading };
}
