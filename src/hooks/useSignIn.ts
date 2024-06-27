import { useNavigate } from 'react-router-dom';

import { setAccessTokenToHeaders } from '../api/axios';
import { DISPATCH_ACTIONS, UserTypes } from '../constants';
import { IUser, LoginInput } from '../schemas/auth';
import useStateContext from './useStateContext';

type IUseSignIn = {
  signInMutation: (payload: LoginInput) => void;
  isLoading: boolean;
};

export default function useSignIn(): IUseSignIn {
  const navigate = useNavigate();

  const stateContext = useStateContext();

  const signInMutation = (payload: LoginInput) => {
    const userMock: IUser = {
      id: '1',
      'first-name': 'User',
      'last-name': 'Test',
      email: payload.email,
      type: UserTypes.ADMIN,
    };

    stateContext.dispatch({ type: DISPATCH_ACTIONS.SET_USER, payload: userMock });
    setAccessTokenToHeaders('XXX');
    navigate('/');
  };

  return { signInMutation, isLoading: false };
}
