import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { UserTypes } from '../constants';
import useUser from '../hooks/useUser';

export interface ProtectedRouteProps extends PropsWithChildren {
  requiredUserType?: UserTypes;
}

export default function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const user = useUser();
  const { t } = useTranslation('translation');

  if (!user) return <Navigate to="/login" replace />;
  if (requiredUserType && requiredUserType !== user.type) {
    throw new Error(t('errors.unauthorized'));
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
