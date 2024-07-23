import { useParams, useSearchParams } from 'react-router-dom';
import { ZodType, z } from 'zod';
import { validation } from '../util';

export const useParamsTypeSafe = <T extends ZodType>(schema: T, errorMessage?: string): z.infer<T> => {
  const params = useParams();
  return validation(schema, params, errorMessage);
};

export const useSearchParamsTypeSafe = <T extends ZodType>(schema: T, errorMessage?: string): z.infer<T> => {
  const [searchParams] = useSearchParams();

  return validation(schema, Object.fromEntries([...searchParams]), errorMessage);
};
