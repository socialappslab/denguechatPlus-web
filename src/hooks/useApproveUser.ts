import { ErrorResponse } from 'react-router-dom';

import { deserialize, ExistingDocumentObject } from 'jsonapi-fractal';

import useAxios from 'axios-hooks';
import { ChangeStatus, IUser } from '../schemas/auth';

type IUseApproveUser = {
  approveUserMutation: (payload: ChangeStatus) => Promise<void>;
  loading: boolean;
};

export default function useApproveUser(idParam?: string): IUseApproveUser {
  const [{ loading }, approveUser] = useAxios<ExistingDocumentObject, ChangeStatus, ErrorResponse>(
    {
      url: `admin/users/${idParam}/change_status`,
      method: 'PUT',
    },
    { manual: true },
  );

  const approveUserMutation = async (payload: ChangeStatus) => {
    const mutationResponse = await approveUser({ data: payload });
    const deserializedData = deserialize<IUser>(mutationResponse.data);

    if (!Array.isArray(deserializedData)) {
      // eslint-disable-next-line no-console
      console.log('deserializedData approve', deserializedData);
    } else {
      throw new Error("Couldn't deserialize user data");
    }
  };

  return { approveUserMutation, loading };
}
