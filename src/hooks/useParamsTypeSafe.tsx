import { useParams, useSearchParams } from 'react-router-dom';
import * as z from 'zod/mini';
import { validation } from '../util';

export const useParamsTypeSafe = <T extends z.ZodMiniType>(schema: T, errorMessage?: string) => {
  const params = useParams();
  return validation(schema, params, errorMessage);
};

export const useSearchParamsTypeSafe = <T extends z.ZodMiniType>(schema: T, errorMessage?: string) => {
  const [searchParams] = useSearchParams();

  return validation(schema, Object.fromEntries([...searchParams]), errorMessage);
};
