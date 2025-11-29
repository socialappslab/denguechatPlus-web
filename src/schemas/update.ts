import * as z from 'zod/mini';
import i18nInstance from '../i18n/config';
import { CreateRole } from './create';
import { HouseBlockType } from './entities';

const t = (key: string, args?: { [key: string]: string | number }) => i18nInstance.t(key, args);

export const updateCitySchema = () => {
  const requiredNameString = z.string().check(z.minLength(1, t('validation:requiredField.name')));

  return z.object({
    name: requiredNameString,
    neighborhoods: z.record(z.string(), z.string()),
    newNeighborhoods: z.array(z.string()),
  });
};

const updateCitySchemaForType = updateCitySchema();
export type UpdateCityInputType = z.infer<typeof updateCitySchemaForType>;

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

// update visit
export const updateVisitSchema = () => {
  const requiredString = z.string().check(z.minLength(1, t('validation:requiredField.name')));

  return z.object({
    site: z.object({ value: z.string(), label: z.string() }),
    brigadist: requiredString,
    brigade: requiredString,
    visitStartPlace: requiredString,
    visitPermission: requiredString,
    household: z.array(z.object({ value: z.string(), label: z.string() })),
    familyEducationTopics: z.array(z.object({ value: z.string(), label: z.string() })),
    otherFamilyEducationTopic: z.nullable(requiredString),
    notes: requiredString,
    date: requiredString,
  });
};

const updateVisitSchemaForType = updateVisitSchema();
export type UpdateVisitInputType = z.infer<typeof updateVisitSchemaForType>;

export interface UpdateVisit {
  house_id: string;
  visited_at: string;
  user_account_id: string;
  host: string[];
  notes: string;
  answers?: Record<string, string>[];
  family_education_topics?: string[];
  other_family_education_topic: string | null;
}

// update inspection
export const updateInspectionSchema = () => {
  return z.object({
    breadingSiteType: z.string().check(z.minLength(1, '*')),
    lidType: z.string().check(z.minLength(1, '*')),
    lidTypeOther: z.string(),
    eliminationMethodTypeOther: z.string(),
    containerProtectionOther: z.string(),
    containerProtection: z.string().check(z.minLength(1, '*')),
    typeContents: z.array(z.object({ value: z.string(), label: z.string() })),
    eliminationMethodTypes: z.string().check(z.minLength(1, '*')),
    waterSourceType: z.string().check(z.minLength(1, '*')),
    waterSourceOther: z.string(),
    wasChemicallyTreated: z.string().check(z.minLength(1, '*')),
  });
};

const updateInspectionSchemaForType = updateInspectionSchema();
export type UpdateInspectionInputType = z.infer<typeof updateInspectionSchemaForType>;

export interface UpdateInspection {
  breeding_site_type_id: string;
  other_elimination_method: string;
  other_protection: string;
  was_chemically_treated: string;
  water_source_other: string;
  container_protection_ids: string[];
  elimination_method_type_ids: number[];
  water_source_type_ids: string[];
  type_content_ids: string[];
}

// update visit
export const updateHouseBlockSchema = () => {
  return z.object({
    name: z.string().check(z.minLength(1, t('validation:requiredField.name'))),
    blockType: z.enum(HouseBlockType),
    houseIds: z.array(z.object({ value: z.string(), label: z.string() })),
  });
};

const updateHouseBlockSchemaForType = updateHouseBlockSchema();
export type UpdateHouseBlockInputType = z.infer<typeof updateHouseBlockSchemaForType>;

// update house block
export interface UpdateHouseBlock {
  name: string;
  blockType: HouseBlockType;
  houseIds: number[];
  wedgeId?: string;
}
