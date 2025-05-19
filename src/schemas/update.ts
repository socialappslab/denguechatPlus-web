import { TypeOf, array, number, object, record, string } from 'zod';
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
    site: object({ value: string(), label: string() }),
    brigadist: requiredString,
    brigade: requiredString,
    visitStartPlace: requiredString,
    visitPermission: requiredString,
    household: array(object({ value: string(), label: string() })),
    notes: requiredString,
    date: requiredString,
  });
};

const updateVisitSchemaForType = updateVisitSchema();
export type UpdateVisitInputType = TypeOf<typeof updateVisitSchemaForType>;

export interface UpdateVisit {
  house_id: string;
  visited_at: string;
  user_account_id: string;
  host: string[];
  notes: string;
  answers?: Record<string, string>[];
}

// update inspection
export const updateInspectionSchema = () => {
  return object({
    breadingSiteType: string().min(1, '*'),
    lidType: string().min(1, '*'),
    lidTypeOther: string(),
    eliminationMethodTypeOther: string(),
    containerProtectionOther: string(),
    containerProtection: string().min(1, '*'),
    typeContents: array(object({ value: string(), label: string() })),
    eliminationMethodType: string().min(1, '*'),
    waterSourceType: string().min(1, '*'),
    waterSourceOther: string(),
    wasChemicallyTreated: string().min(1, '*'),
  });
};

const updateInspectionSchemaForType = updateInspectionSchema();
export type UpdateInspectionInputType = TypeOf<typeof updateInspectionSchemaForType>;

export interface UpdateInspection {
  breeding_site_type_id: string;
  // lid_type: string;
  // lid_type_other: string;
  other_elimination_method: string;
  other_protection: string;
  was_chemically_treated: string;
  water_source_other: string;
  container_protection_ids: string[];
  elimination_method_type_id: string;
  water_source_type_ids: string[];
  type_content_ids: string[];
}

// update visit
export const updateHouseBlockSchema = () => {
  return object({
    name: string().min(1, t('validation:requiredField.name')),
    houseIds: array(object({ value: string(), label: string() })),
  });
};

const updateHouseBlockSchemaForType = updateHouseBlockSchema();
export type UpdateHouseBlockInputType = TypeOf<typeof updateHouseBlockSchemaForType>;

// update house block
export interface UpdateHouseBlock {
  name: string;
  houseIds: number[];
  wedgeId?: string;
}
