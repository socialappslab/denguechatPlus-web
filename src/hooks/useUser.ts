import { getUser } from '../api/localstore';
import { IUser } from '../schemas/auth';

export default function useUser(): IUser | null {
  return getUser();
}
