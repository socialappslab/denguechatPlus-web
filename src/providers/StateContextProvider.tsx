import React, { useEffect, useReducer, useState } from 'react';

import useAxios from 'axios-hooks';
import { deserialize, ExistingDocumentObject } from 'jsonapi-fractal';
import { ErrorResponse } from 'react-router-dom';
import { getUser, saveUser } from '../api/localstore';
import { DISPATCH_ACTIONS } from '../constants';
import { IUser } from '../schemas/auth';

type AuthState = {
  user: IUser | null | unknown;
};

type ActionSetAuth = {
  type: string;
  payload: IUser | null | unknown;
};

type Dispatch = (action: ActionSetAuth) => void;

const initialState: AuthState = {
  user: getUser(),
};

type StateContextProviderProps = { children: React.ReactNode };

export const StateContext = React.createContext<
  { state: AuthState; meData?: IUser | null; dispatch: Dispatch } | undefined
>(undefined);

const authReducer = (state: AuthState, action: ActionSetAuth) => {
  switch (action.type) {
    case DISPATCH_ACTIONS.SET_USER: {
      saveUser(action.payload);
      return {
        ...state,
        user: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
};

export function StateContextProvider({ children }: StateContextProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [meData, setMeData] = useState<IUser | null>(null);

  const value = React.useMemo(
    () => ({
      state,
      dispatch,
      meData,
    }),
    [state, meData],
  );

  const [{ data: dataMe }, featchMe] = useAxios<ExistingDocumentObject, unknown, ErrorResponse>(
    {
      url: `users/me`,
    },
    { manual: true },
  );

  useEffect(() => {
    if (!value.state.user) return;
    featchMe();
  }, [value.state.user, featchMe]);

  useEffect(() => {
    if (!dataMe) return;
    const deserializedData = deserialize<IUser>(dataMe) as IUser;

    setMeData(deserializedData);
    console.log('deserialized USER ME>>', deserializedData);
  }, [dataMe]);

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export default StateContextProvider;
