import { TypeOf, array, object, record, string } from 'zod';
import i18nInstance from '../i18n/config';
import { CreateRole } from './create';

const t = (key: string, args?: { [key: string]: string | number }) => i18nInstance.t(key, args);

export const updateCitySchema = () => {
  const requiredNameString = string().min(1, t('validation:requiredField.name'));

  return object({
    name: requiredNameString,
    neighborhoods: record(string(), string()),
    newNeighborhoods: array(string()),
  });
};

const updateCitySchemaForType = updateCitySchema();
export type UpdateCityInputType = TypeOf<typeof updateCitySchemaForType>;

export interface CityUpdate {
  name?: string;
  neighborhoodsAttributes?: {
    _destroy?: string;
    id?: string;
    name?: string;
  }[];
}

export interface UpdateRole {
  role: CreateRole;
}

export interface UpdateTeam {
  team: {
    name: string;
    memberIds: string[];
  };
}

export const updateTeamSchema = () => {
  const requiredNameString = string().min(1, t('validation:requiredField.name'));

  return object({
    name: requiredNameString,
    members: array(object({ label: string(), value: string() })).min(1, t('validation:required')),
  });
};

const updateTeamSchemaForType = updateTeamSchema();
export type UpdateTeamInputType = TypeOf<typeof updateTeamSchemaForType>;
