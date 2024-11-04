/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from 'lodash';
import { PropsWithChildren } from 'react';

import useUser from '../hooks/useUser';
import { IUser } from '../schemas/auth';

export interface ProtectedViewProps extends PropsWithChildren {
  hasPermission?: string | string[];
  hasSomePermission?: string | string[];
  hasSomeResource?: string | string[];
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

const checkHasSomeResource = _.memoize((user: IUser, requiredResource: string | string[]): boolean => {
  if (Array.isArray(requiredResource)) {
    return requiredResource.some((resource) =>
      user.permissions?.some((element) => {
        const resourceOfPermission = element.split('-')[0];
        return resourceOfPermission === resource;
      }),
    );
  }
  return !!user.permissions?.some((element) => {
    const resourceOfPermission = element.split('-')[0];
    return resourceOfPermission === requiredResource;
  });
});

export default function ProtectedView({
  children,
  hasPermission,
  hasSomePermission,
  hasSomeResource,
}: ProtectedViewProps) {
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

  if (hasSomeResource && checkHasSomeResource(user, hasSomeResource)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }
}
