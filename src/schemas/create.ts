import { TypeOf, array, boolean, object, string } from 'zod';
import i18nInstance from '../i18n/config';

const t = (key: string, args?: { [key: string]: string | number }) => i18nInstance.t(key, args);

// Role
export const createRoleSchema = () => {
  const requiredNameString = string().min(1, t('validation:requiredField.name'));

  return object({
    name: requiredNameString,
    permissionIds: array(object({ label: string(), value: string(), disabled: boolean().optional() })).min(
      1,
      t('validation:required'),
    ),
  });
};

const createRoleSchemaForType = createRoleSchema();
export type CreateRoleInputType = TypeOf<typeof createRoleSchemaForType>;

export interface CreateRole {
  name: string;
  permissionIds: number[];
}

// City
export const createCitySchema = () => {
  const requiredNameString = string().min(1, t('validation:requiredField.name'));

  return object({
    name: requiredNameString,
    neighborhoods: array(string()),
  });
};

const createCitySchemaForType = createCitySchema();
export type CreateCityInputType = TypeOf<typeof createCitySchemaForType>;

export interface CreateCity {
  name: string;
  neighborhoodsAttributes: { name: string }[];
}
