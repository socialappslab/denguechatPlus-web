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

// update team
export const updateTeamSchema = () => {
  const requiredNameString = string().min(1, t('validation:requiredField.name'));

  return object({
    name: requiredNameString,
    members: array(object({ label: string(), value: string() })).min(1, t('validation:required')),
  });
};

const updateTeamSchemaForType = updateTeamSchema();
export type UpdateTeamInputType = TypeOf<typeof updateTeamSchemaForType>;

// update visit
export const updateVisitSchema = () => {
  const requiredString = string().min(1, t('validation:requiredField.name'));

  return object({
    site: requiredString,
    brigadist: requiredString,
    brigade: requiredString,
    visitStartPlace: requiredString,
    visitPermission: requiredString,
    household: requiredString,
    notes: requiredString,
    date: requiredString,
  });
};

const updateVisitSchemaForType = updateVisitSchema();
export type UpdateVisitInputType = TypeOf<typeof updateVisitSchemaForType>;

export interface UpdateVisit {
  // house_id: string;
  visited_at: string;
  user_account_id: string;
  host: string;
  notes: string;
  answers?: Record<string, string>[];
}
