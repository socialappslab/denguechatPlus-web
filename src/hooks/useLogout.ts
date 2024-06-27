import { useNavigate } from 'react-router-dom';

import { resetAuthApi } from '../api/axios';
import { DISPATCH_ACTIONS } from '../constants';
import useStateContext from './useStateContext';

type IUseSignOut = () => void;

export default function useSignOut(): IUseSignOut {
  const navigate = useNavigate();
  const stateContext = useStateContext();

  const onSignOut = async () => {
    stateContext.dispatch({ type: DISPATCH_ACTIONS.SET_USER, payload: null });
    resetAuthApi();
    navigate('/login');
  };

  return onSignOut;
}
