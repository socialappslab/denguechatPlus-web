import { TypeOf, array, number, object, string } from 'zod';
import i18nInstance from '../i18n/config';

const t = (key: string, args?: { [key: string]: string | number }) => i18nInstance.t(key, args);

export const createRoleSchema = () => {
  const requiredNameString = string().min(1, t('validation:requiredField.name'));

  return object({
    name: requiredNameString,
    permissionIds: array(number()).min(1, t('validation:required')),
  });
};

const createRoleSchemaForType = createRoleSchema();
export type CreateRoleInputType = TypeOf<typeof createRoleSchemaForType>;

export interface CreateRole {
  name: string;
  permissionIds: number[];
}
