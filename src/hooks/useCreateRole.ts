import { ErrorResponse } from 'react-router-dom';

import { CreateRole } from '@/schemas/create';
import useAxios from 'axios-hooks';
import { deserialize, ExistingDocumentObject } from 'jsonapi-fractal';
import { IUser } from '../schemas/auth';

type IUseCreateRole = {
  createRoleMutation: (payload: CreateRole) => Promise<void>;
  loading: boolean;
};

export default function useCreateRole(): IUseCreateRole {
  const [{ loading }, createRole] = useAxios<ExistingDocumentObject, CreateRole, ErrorResponse>(
    {
      url: 'roles',
      method: 'POST',
    },
    { manual: true },
  );

  const createRoleMutation = async (data: CreateRole) => {
    const createRes = await createRole({ data });

    const deserializedData = deserialize<IUser>(createRes.data);
    // eslint-disable-next-line no-console
    console.log('deserializedData update', deserializedData);
  };

  return { createRoleMutation, loading };
}
