/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { UserTypes } from '../constants';
import useUser from '../hooks/useUser';
import { IUser } from '../schemas/auth';

export interface ProtectedRouteProps extends PropsWithChildren {
  requiredUserType?: UserTypes;
}

const isOfType = (_user: IUser, _requiredUserType: UserTypes) => true;

export default function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const user = useUser();
  const { t } = useTranslation('translation');

  if (!user) return <Navigate to="/login" replace />;
  if (requiredUserType && isOfType(user, requiredUserType)) {
    throw new Error(t('errors.unauthorized'));
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
