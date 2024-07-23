/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from 'lodash';
import { PropsWithChildren } from 'react';

import useUser from '../hooks/useUser';
import { IUser } from '../schemas/auth';

export interface ProtectedViewProps extends PropsWithChildren {
  hasPermission?: string | string[];
  hasSomePermission?: string | string[];
}

const chekcHasPermission = _.memoize((user: IUser, requiredPermission: string | string[]): boolean => {
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.every((permission) => user.permissions?.includes(permission));
  }
  return !!user.permissions?.includes(requiredPermission);
});

const checkHasSomePermission = _.memoize((user: IUser, requiredPermission: string | string[]): boolean => {
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some((permission) => user.permissions?.includes(permission));
  }
  return !!user.permissions?.includes(requiredPermission);
});

export default function ProtectedView({ children, hasPermission, hasSomePermission }: ProtectedViewProps) {
  const user = useUser();

  if (!user) return null;

  if (hasPermission && chekcHasPermission(user, hasPermission)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  if (hasSomePermission && checkHasSomePermission(user, hasSomePermission)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }
}
